'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { useAuth, useTrello } from '../../../../../services/useStagiaireAPI';

export default function AddTrello(): React.JSX.Element {
  const [trelloUrl, setTrelloUrl] = useState<string>('');
  const [boardName, setBoardName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();
  const { addBoard } = useTrello(user?.id);

  const validateTrelloUrl = (url: string): boolean => {
    const trelloPattern = /^https:\/\/trello\.com\/b\/[a-zA-Z0-9]+/;
    return trelloPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!trelloUrl.trim()) {
      setError('Veuillez entrer une URL Trello');
      return;
    }

    if (!validateTrelloUrl(trelloUrl)) {
      setError('URL Trello invalide. Format attendu: https://trello.com/b/[ID]/[nom-du-tableau]');
      return;
    }

    if (!boardName.trim()) {
      setError('Veuillez entrer un nom pour le tableau');
      return;
    }

    setIsLoading(true);

    try {
      await addBoard(trelloUrl);
      // Rediriger vers la page Trello
      router.push('/stagiaire/accueil/trello');
    } catch (err: any) {
      if (err.message && err.message.includes('Stagiaire non trouvé') || err.message.includes('theme')) {
        setError('Veuillez attendre l\'attribution de votre thème avant de configurer Trello.');
      } else {
      setError('Erreur lors de la configuration du tableau Trello');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/stagiaire/accueil"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au tableau de bord
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Configurer Trello</h1>
            <p className="mt-2 text-gray-600">Connectez votre tableau Trello pour suivre vos tâches</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du tableau
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Ex: Mon projet de stage"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="trelloUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL du tableau Trello
                </label>
                <input
                  type="url"
                  id="trelloUrl"
                  value={trelloUrl}
                  onChange={(e) => setTrelloUrl(e.target.value)}
                  placeholder="https://trello.com/b/[ID]/[nom-du-tableau]"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Copiez l'URL complète de votre tableau Trello depuis votre navigateur
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="ml-2 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Configuration...
                    </>
                  ) : (
                    'Configurer le tableau'
                  )}
                </button>
                
                <Link
                  href="/stagiaire/accueil"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 h-10"
                >
                  Annuler
                </Link>
              </div>
            </form>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Comment obtenir l'URL de votre tableau Trello ?</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ouvrez votre tableau Trello dans votre navigateur</li>
              <li>Copiez l'URL complète depuis la barre d'adresse</li>
              <li>L'URL doit ressembler à : https://trello.com/b/ABC123/mon-tableau</li>
              <li>Collez cette URL dans le champ ci-dessus</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
