'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth, useTrello } from '../../../../services/useStagiaireAPI';

interface Card {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: string;
}

interface List {
  id: string;
  name: string;
  cards: Card[];
}

interface TrelloBoard {
  name: string;
  url: string;
  lists: List[];
}

export default function TrelloView(): React.JSX.Element {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { board: trelloData, loading: trelloLoading, error: trelloError } = useTrello(user?.id);
  const [board, setBoard] = useState<TrelloBoard | null>(null);

  // Transformer les données de l'API en format attendu par le composant
  useEffect(() => {
    if (trelloData) {
      // Organiser les cartes par liste - associer chaque carte à sa liste
      const listsWithCards = trelloData.lists.map(list => ({
        id: list.id,
        name: list.name,
        cards: trelloData.cards
          .filter(card => card.idList === list.id) // Filtrer les cartes par liste
          .map(card => ({
            id: card.id,
            title: card.name,
            description: card.desc || '',
            labels: card.labels?.map(label => label.name) || [],
            dueDate: card.due || undefined
          }))
      }));

      setBoard({
        name: trelloData.board.name,
        url: trelloData.board.url,
        lists: listsWithCards
      });
    }
  }, [trelloData]);

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
          <p className="text-gray-600 mb-4">Veuillez vous connecter pour accéder à Trello.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (trelloLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement du tableau Trello...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trelloError || !board) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau Trello non trouvé</h2>
              <p className="text-gray-600 mb-6">
                {trelloError || 'Aucun tableau Trello configuré pour votre compte.'}
              </p>
              <Link
                href="/stagiaire/accueil/trello/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Configurer un tableau Trello
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{board.name}</h1>
                <p className="mt-2 text-gray-600">Tableau Trello synchronisé</p>
              </div>
              <div className="flex space-x-3">
                <a
                  href={board.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Ouvrir dans Trello
                </a>
                <Link
                  href="/stagiaire/accueil"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </div>
          </div>

          {/* Trello Board */}
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-6" style={{ minWidth: 'max-content' }}>
              {board.lists.map((list) => (
                <div key={list.id} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* List Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">{list.name}</h3>
                      <p className="text-sm text-gray-500">{list.cards.length} carte(s)</p>
                    </div>

                    {/* Cards */}
                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                      {list.cards.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aucune carte</p>
                      ) : (
                        list.cards.map((card) => (
                          <div
                            key={card.id}
                            className="bg-gray-50 border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow duration-200"
                          >
                            <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>
                            
                            {card.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                {card.description}
                              </p>
                            )}

                            {/* Labels */}
                            {card.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {card.labels.map((label, index) => (
                                  <span
                                    key={index}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Due Date */}
                            {card.dueDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(card.dueDate).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
              <div className="flex space-x-4">
                <a
                  href={board.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Modifier dans Trello
                </a>
                <Link
                  href="/stagiaire/accueil/trello/add"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Changer de tableau
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
