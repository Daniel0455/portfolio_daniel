'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth, useMessages, useThemeParticipants, useUnreadMessages } from '../../../../services/useStagiaireAPI';

interface Message {
  id_mg: number;
  contenu: string;
  date_envoie: string;
  nom: string;
  prenom: string;
  user_type: string;
}

export default function Messages(): React.JSX.Element {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState<string>('');
  const [themeId, setThemeId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [noTheme, setNoTheme] = useState<boolean>(false);

  // Récupérer le thème du stagiaire
  useEffect(() => {
    const fetchTheme = async () => {
      if (user?.id) {
        try {
          console.log('🔍 Récupération du thème pour le stagiaire:', user.id);
          const response = await fetch(`http://localhost:3000/api/stagiaires/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('📦 Données reçues:', data);
            console.log('🎯 ID thème trouvé:', data.stagiaire?.id_theme);
            setThemeId(data.stagiaire?.id_theme);
          } else {
            console.error('❌ Erreur lors de la récupération du thème:', response.status);
            setNoTheme(true);
          }
        } catch (error) {
          console.error('❌ Erreur lors de la récupération du thème:', error);
          setNoTheme(true);
        }
      }
    };

    fetchTheme();
  }, [user]);

  const { messages, loading, sending, sendMessage, reloadMessages } = useMessages(themeId || undefined);
  const { participants, loading: participantsLoading } = useThemeParticipants(themeId || undefined);
  const { reloadUnreadCount, clearUnreadCount } = useUnreadMessages(user?.id);

  // Polling pour les nouveaux messages (toutes les 10 secondes)
  useEffect(() => {
    if (themeId) {
      const interval = setInterval(() => {
        reloadMessages();
      }, 10000); // 10 secondes

      return () => clearInterval(interval);
    }
  }, [themeId, reloadMessages]);

  // Marquer les messages comme lus quand on arrive sur la page
  useEffect(() => {
    if (themeId && user?.id) {
      const markAsRead = async () => {
        try {
          await fetch(`http://localhost:3000/api/stagiaires/${user.id}/mark-messages-read`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
          });
          // Forcer la mise à jour du compteur à 0
          setTimeout(() => {
            clearUnreadCount();
          }, 1000);
        } catch (error) {
          console.error('Erreur lors du marquage des messages:', error);
        }
      };
      
      markAsRead();
    }
  }, [themeId, user?.id, reloadUnreadCount]);

  // Vérifier si le stagiaire a un thème
  useEffect(() => {
    if (user && !themeId) {
      setNoTheme(true);
    } else {
      setNoTheme(false);
    }
  }, [user, themeId]);

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (newMessage.trim() && themeId) {
      try {
        await sendMessage(newMessage);
        setNewMessage('');
        setError('');
      } catch (error: any) {
        setError(error.message || 'Erreur lors de l\'envoi du message');
      }
    }
  };

  // Formatage de la date pour l'affichage
  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Vérifier si le message est de l'utilisateur actuel
  const isOwnMessage = (message: Message): boolean => {
    return message.user_type === 'stagiaire' && 
           message.nom === user?.nom && 
           message.prenom === user?.prenom;
  };

  // Affichage si pas de thème
  if (noTheme) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun thème assigné</h2>
                <p className="text-gray-600">
                  Vous devez avoir un thème assigné pour accéder aux messages de groupe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages de groupe</h1>
            <p className="mt-2 text-gray-600">Chat avec les autres stagiaires et encadreurs</p>
            
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Chargement des messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500">Aucun message pour le moment</p>
                    <p className="text-sm text-gray-400">Soyez le premier à envoyer un message !</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id_mg}
                    className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage(message)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {!isOwnMessage(message) && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {message.prenom} {message.nom}
                          {message.user_type === 'encadreur' && ' (Encadreur)'}
                        </p>
                      )}
                      <p className="text-sm">{message.contenu}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.date_envoie)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
              >
                <textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    const el = e.target as HTMLTextAreaElement;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  placeholder="Écrire un message..."
                  className="flex-grow px-4 py-2 pr-12 bg-transparent rounded-full text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-base max-h-32 overflow-y-auto"
                  style={{ minHeight: '45px', lineHeight: '1.4' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center"
                  title="Envoyer le message"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Online Users */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Participants du groupe</h3>
            {participantsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Chargement des participants...</span>
              </div>
            ) : participants ? (
              <div className="space-y-3">
                {/* Stagiaires */}
                {participants.stagiaires.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Stagiaires ({participants.stagiaires.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {participants.stagiaires.map((stagiaire) => (
                        <span 
                          key={stagiaire.id_stagiaire}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            stagiaire.id_stagiaire === user?.id 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            stagiaire.id_stagiaire === user?.id ? 'bg-green-400' : 'bg-blue-400'
                          }`}></span>
                          {stagiaire.prenom} {stagiaire.nom}
                          {stagiaire.id_stagiaire === user?.id && ' (Vous)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Encadreurs */}
                {participants.encadreurs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Encadreurs ({participants.encadreurs.length})</h4>
                    <div className="flex flex-wrap gap-2">
                                             {participants.encadreurs.map((encadreur) => (
                         <span 
                           key={encadreur.id_enc}
                           className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                         >
                           <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                           {encadreur.nom} (Encadreur)
                         </span>
                       ))}
                    </div>
                  </div>
                )}
                
                {participants.stagiaires.length === 0 && participants.encadreurs.length === 0 && (
                  <p className="text-gray-500 text-sm">Aucun participant trouvé pour ce thème.</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Impossible de charger les participants.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
