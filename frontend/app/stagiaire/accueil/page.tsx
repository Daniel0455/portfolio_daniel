'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth, useTrello, useNotifications, useSession, usePresence } from '../../../services/useStagiaireAPI';
import useNetworkDetection, { NetworkInfo } from '../../../hooks/useNetworkDetection';

interface Card {
  title: string;
  value: string;
  subtitle: string;
  icon: React.JSX.Element;
  bgColor: string;
  borderColor: string;
}

export default function Dashboard(): React.JSX.Element {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { board, loading: trelloLoading } = useTrello(user?.id);
  const { notifications, unreadCount, loading: notifLoading } = useNotifications(user?.id);
  const { stats, sessionActive, startSession, endSession, loading: sessionLoading } = useSession(user?.id);
  const { recordPresence, recording, history } = usePresence(user?.id);
  
  // État pour suivre si la présence a déjà été enregistrée aujourd'hui
  const [presenceRecorded, setPresenceRecorded] = useState(false);
  const [presenceAttempted, setPresenceAttempted] = useState(false);
  const [presenceAlreadyRecorded, setPresenceAlreadyRecorded] = useState(false);
  
  const handleCompanyNetworkDetected = useCallback((info: NetworkInfo) => {
    console.log('[Dashboard] Réseau entreprise détecté:', info);
    // La présence sera gérée par l'effet ci-dessous
  }, []);

  // Utilisation du hook de détection réseau avec gestionnaire d'événement
  const networkInfo = useNetworkDetection({
    onCompanyNetworkDetected: handleCompanyNetworkDetected
  });
  
  const { ssid, isCompanyNetwork, ipAddress, error: networkError } = networkInfo;
  
  const [todayPresence, setTodayPresence] = useState<string>('0h00');
  const [weeklyTime, setWeeklyTime] = useState<string>('0h');

  // Enregistrer automatiquement la présence si sur le réseau de l'entreprise
  useEffect(() => {
    if (presenceAttempted) return; // Ne tente qu'une seule fois

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = history.find(h => h.date === today);
    
    if (isCompanyNetwork && !presenceRecorded && !todayRecord && user?.id) {
      setPresenceAttempted(true); // Marque la tentative, même si erreur
      recordPresence({
        ssid: ssid || 'ITDC Mada',
        ipAddress: ipAddress || ''
      }).then((res) => {
        if (res && (res as any).alreadyRecorded) {
          setPresenceAlreadyRecorded(true);
        } else if (res) {
          setPresenceRecorded(true);
        }
      }).catch(error => {
        // Affiche une erreur ou log, mais ne relance pas en boucle
        console.error('Erreur lors de l\'enregistrement de la présence:', error);
      });
    }
  }, [isCompanyNetwork, presenceRecorded, history, user?.id, recordPresence, ssid, ipAddress, presenceAttempted]);

  // Calculer le temps de présence aujourd'hui depuis l'historique
  useEffect(() => {
    console.log('history', history);
    if (history.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = history.find(h => h.cree_le && new Date(h.cree_le).toISOString().slice(0, 10) === today);
      console.log('todayRecord', todayRecord);
      if (todayRecord) {
        // Utilise cree_le comme heure d'arrivée
        const arrival = new Date(todayRecord.cree_le);
        const now = new Date();
        const diffMs = now.getTime() - arrival.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTodayPresence(`${hours}h${minutes.toString().padStart(2, '0')}`);
        
        // Mettre à jour l'état de présence enregistrée
        if (!presenceRecorded) {
          setPresenceRecorded(true);
        }
      }
    }
  }, [history, presenceRecorded]);

  // Calculer le temps de travail de la semaine depuis les stats
  useEffect(() => {
    if (stats) {
      setWeeklyTime(stats.total_time.formatted || '0h');
    }
  }, [stats]);

  // Supprimé : useEffect qui causait la boucle infinie d'enregistrement de présence

  // Démarrer automatiquement une session si pas active
  useEffect(() => {
    if (user && !authLoading && !sessionActive && !sessionLoading) {
      startSession().catch(console.error);
    }
  }, [user, authLoading, sessionActive, sessionLoading, startSession]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Veuillez vous connecter pour accéder au tableau de bord.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // État de la connexion réseau
  const getNetworkStatus = () => {
    if (!isCompanyNetwork) {
      return {
        text: 'Hors réseau entreprise',
        icon: <WifiOff className="w-4 h-4 text-red-500" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: 'Connectez-vous au réseau ITDC Mada pour enregistrer votre présence.'
      };
    }
    
    if (ssid) {
      return {
        text: `Connecté à ${ssid}`,
        icon: <Wifi className="w-4 h-4 text-green-500" />,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: 'Vous êtes connecté au réseau de l\'entreprise.'
      };
    }
    
    return {
      text: 'Réseau entreprise détecté',
      icon: <Wifi className="w-4 h-4 text-green-500" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Votre connexion est sécurisée.'
    };
  };
  
  const networkStatus = getNetworkStatus();

  const cards: Card[] = [
    {
      title: 'Réseau',
      value: networkStatus.text,
      subtitle: networkStatus.description,
      icon: networkStatus.icon,
      bgColor: networkStatus.bgColor,
      borderColor: networkStatus.borderColor,
    },
    {
      title: 'Présence',
      value: todayPresence,
      subtitle: 'Temps présent aujourd\'hui',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Temps de travail',
      value: weeklyTime,
      subtitle: 'Cette semaine',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Lien Trello',
      value: board ? 'Configuré' : 'Non configuré',
      subtitle: board ? 'Tableau accessible' : 'Configuration requise',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Notifications',
      value: unreadCount.toString(),
      subtitle: 'Messages non lus',
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12c.78.78.78 2.05 0 2.83L4.83 17.12c-.78.78-2.05.78-2.83 0L2 17.12V2.82c0-1.1.9-2 2-2h6.07z" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-2 text-gray-600">Bienvenue sur votre espace stagiaire</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trello Configuration Section */}
          {!board && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Configuration Trello</h3>
                  <p className="text-gray-600 mt-1">
                    Connectez votre tableau Trello pour suivre vos tâches et projets.
                  </p>
                </div>
                <Link
                  href="/stagiaire/accueil/trello/add"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Configurer Trello
                </Link>
              </div>
            </div>
          )}

          {/* Presence Tracking Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Suivi de présence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Statut actuel</p>
                  <p className="text-lg font-semibold text-green-600">Présent</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dernière vérification</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              {recording && (
                <div className="mt-4 flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Enregistrement de la présence...</span>
                </div>
              )}
              {presenceAlreadyRecorded && (
                <div className="text-yellow-600 mt-2">
                  Votre présence a déjà été enregistrée aujourd'hui.
                </div>
              )}
            </div>
          </div>

          {/* Historique de présence - 7 derniers jours */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historique de présence (7 derniers jours)</h3>
              <div className="space-y-3">
                {Array.from({ length: 7 }, (_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - index);
                  const dateStr = date.toISOString().slice(0, 10);
                  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
                  const dayNumber = date.getDate();
                  const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
                  
                  // Trouver la présence pour cette date
                  const presenceRecord = history.find(h => {
                    const recordDate = new Date(h.cree_le).toISOString().slice(0, 10);
                    return recordDate === dateStr;
                  });

                  const isToday = index === 0;
                  const isPresent = presenceRecord !== undefined;
                  
                  return (
                    <div key={dateStr} className={`flex items-center justify-between p-3 rounded-lg border ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isPresent ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div>
                          <p className={`font-medium ${
                            isToday ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {dayName} {dayNumber} {monthName}
                            {isToday && <span className="ml-2 text-blue-600 text-sm">(Aujourd'hui)</span>}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isPresent ? 'Présent' : 'Absent'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isPresent && (
                          <p className="text-sm text-gray-600">
                            Arrivée: {new Date(presenceRecord.cree_le).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/stagiaire/accueil/messages"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="ml-3 text-lg font-medium text-gray-900 group-hover:text-blue-700">Messages</h3>
              </div>
              <p className="mt-2 text-gray-600">Accéder au chat de groupe</p>
            </Link>

            <Link
              href={board ? "/stagiaire/accueil/trello" : "/stagiaire/accueil/trello/add"}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <h3 className="ml-3 text-lg font-medium text-gray-900 group-hover:text-purple-700">
                  {board ? 'Voir Trello' : 'Configurer Trello'}
                </h3>
              </div>
              <p className="mt-2 text-gray-600">
                {board ? 'Accéder à votre tableau' : 'Ajouter votre tableau Trello'}
                {trelloLoading && <span className="text-blue-600"> (Chargement...)</span>}
              </p>
            </Link>

            <Link
              href="/stagiaire/accueil/settings"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="ml-3 text-lg font-medium text-gray-900 group-hover:text-gray-700">Paramètres</h3>
              </div>
              <p className="mt-2 text-gray-600">Gérer votre profil</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
