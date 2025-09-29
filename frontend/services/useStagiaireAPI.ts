// Hook React personnalisé pour utiliser l'API Stagiaire
import { useState, useEffect, useCallback } from 'react';
import stagiaireAPI, { 
  LoginResponse, 
  TrelloBoardResponse, 
  NotificationResponse,
  MessageResponse,
  SessionTimeResponse 
} from './stagiaireAPI';

// Hook pour l'authentification
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = stagiaireAPI.isAuthenticated();
      const userData = stagiaireAPI.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await stagiaireAPI.login(email, password);
      stagiaireAPI.setCurrentUser(response.stagiaire);
      setIsAuthenticated(true);
      setUser(response.stagiaire);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    stagiaireAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};

// Hook pour Trello
export const useTrello = (stagiaireId?: number) => {
  const [board, setBoard] = useState<TrelloBoardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadBoard = useCallback(async () => {
    if (!stagiaireId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const boardData = await stagiaireAPI.getTrelloBoard(stagiaireId);
      setBoard(boardData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du tableau Trello');
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  const addBoard = async (trelloUrl: string) => {
    if (!stagiaireId) throw new Error('ID stagiaire requis');
    
    setLoading(true);
    setError('');
    
    try {
      await stagiaireAPI.addTrelloBoard(stagiaireId, trelloUrl);
      await loadBoard(); // Recharger après ajout
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du tableau Trello');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stagiaireId) {
      loadBoard();
    }
  }, [stagiaireId, loadBoard]);

  return {
    board,
    loading,
    error,
    addBoard,
    reloadBoard: loadBoard,
  };
};

// Hook pour la présence
export const usePresence = (stagiaireId?: number) => {
  const [recording, setRecording] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const recordPresence = async (networkInfo?: { ssid?: string; bssid?: string; ipAddress?: string }) => {
    if (!stagiaireId) throw new Error('ID stagiaire requis');
    
    setRecording(true);
    try {
      const response = await stagiaireAPI.recordPresence(stagiaireId, networkInfo);
      await loadHistory(); // Recharger l'historique
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      throw error;
    } finally {
      setRecording(false);
    }
  };

  const loadHistory = useCallback(async () => {
    if (!stagiaireId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getPresenceHistory(stagiaireId);
      setHistory(response.presence_history || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  useEffect(() => {
    if (stagiaireId) {
      loadHistory();
    }
  }, [stagiaireId, loadHistory]);

  return {
    recording,
    history,
    loading,
    recordPresence,
    reloadHistory: loadHistory,
  };
};

// Hook pour les notifications
export const useNotifications = (stagiaireId?: number) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!stagiaireId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getNotifications(stagiaireId);
      setNotifications(response.notifications || []);
      setUnreadCount(response.notifications?.filter(n => !n.lu).length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  const markAsRead = async (notificationIds: number[]) => {
    if (!stagiaireId) throw new Error('ID stagiaire requis');
    
    try {
      await stagiaireAPI.markNotificationsAsRead(stagiaireId, notificationIds);
      await loadNotifications(); // Recharger après marquage
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (stagiaireId) {
      loadNotifications();
    }
  }, [stagiaireId, loadNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    reloadNotifications: loadNotifications,
  };
};

// Hook pour la messagerie
export const useMessages = (themeId?: number) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!themeId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getMessages(themeId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  }, [themeId]);

  const sendMessage = async (contenu: string) => {
    if (!themeId) throw new Error('ID thème requis');
    
    setSending(true);
    try {
      await stagiaireAPI.sendMessage(contenu, themeId);
      await loadMessages(); // Recharger après envoi
    } catch (error) {
      throw error;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (themeId) {
      loadMessages();
    }
  }, [themeId, loadMessages]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    reloadMessages: loadMessages,
  };
};

// Hook pour les participants d'un thème
export const useThemeParticipants = (themeId?: number) => {
  const [participants, setParticipants] = useState<{ stagiaires: Array<{ id_stagiaire: number; nom: string; prenom: string; }>; encadreurs: Array<{ id_enc: number; nom: string; }> } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadParticipants = useCallback(async () => {
    if (!themeId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getThemeParticipants(themeId);
      setParticipants(response);
    } catch (error) {
      console.error('Erreur lors du chargement des participants:', error);
    } finally {
      setLoading(false);
    }
  }, [themeId]);

  useEffect(() => {
    if (themeId) {
      loadParticipants();
    }
  }, [themeId, loadParticipants]);

  return {
    participants,
    loading,
    reloadParticipants: loadParticipants,
  };
};

// Hook pour les messages non lus
export const useUnreadMessages = (stagiaireId?: number) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!stagiaireId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getUnreadMessagesCount(stagiaireId);
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Erreur lors du chargement des messages non lus:', error);
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  useEffect(() => {
    if (stagiaireId) {
      loadUnreadCount();
      // Polling toutes les 30 secondes
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [stagiaireId, loadUnreadCount]);

  return {
    unreadCount,
    loading,
    reloadUnreadCount: loadUnreadCount,
    clearUnreadCount: () => setUnreadCount(0),
  };
};

// Hook pour les sessions
export const useSession = (stagiaireId?: number) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [stats, setStats] = useState<SessionTimeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    if (!stagiaireId) throw new Error('ID stagiaire requis');
    
    try {
      await stagiaireAPI.startSession(stagiaireId);
      setSessionActive(true);
    } catch (error) {
      throw error;
    }
  };

  const endSession = async () => {
    if (!stagiaireId) throw new Error('ID stagiaire requis');
    
    try {
      const response = await stagiaireAPI.endSession(stagiaireId);
      setSessionActive(false);
      await loadStats(); // Recharger les stats
      return response;
    } catch (error) {
      throw error;
    }
  };

  const loadStats = useCallback(async (period: string = 'week') => {
    if (!stagiaireId) return;
    
    setLoading(true);
    try {
      const response = await stagiaireAPI.getSessionTime(stagiaireId, period);
      setStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  useEffect(() => {
    if (stagiaireId) {
      loadStats();
    }
  }, [stagiaireId, loadStats]);

  return {
    sessionActive,
    stats,
    loading,
    startSession,
    endSession,
    loadStats,
  };
};

// Hook pour l'inscription
export const useInscription = () => {
  const [loading, setLoading] = useState(false);

  const inscrire = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await stagiaireAPI.inscription(formData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    inscrire,
  };
};

// Récupérer les infos d'un stagiaire
export const getStagiaireById = async (id: number) => {
  return await fetch(`${stagiaireAPI.baseUrl}/stagiaires/${id}`, {
    headers: {
      'Authorization': `Bearer ${stagiaireAPI.getStoredToken()}`,
    },
  }).then(res => res.json());
};

// Mettre à jour les infos d'un stagiaire
export const updateStagiaire = async (id: number, data: any) => {
  return await fetch(`${stagiaireAPI.baseUrl}/stagiaires/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${stagiaireAPI.getStoredToken()}`,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
};

// Changer le mot de passe d'un stagiaire
export const updateStagiairePassword = async (id: number, oldPassword: string, newPassword: string) => {
  return await fetch(`${stagiaireAPI.baseUrl}/stagiaires/${id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${stagiaireAPI.getStoredToken()}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  }).then(res => res.json());
};

export const useStagiairePassword = (stagiaireId?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!stagiaireId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res: any = await updateStagiairePassword(stagiaireId, oldPassword, newPassword);
      if (res.message && res.message.toLowerCase().includes('succès')) {
        setSuccess(res.message);
      } else {
        setError(res.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, changePassword };
};

// Hook pour charger et modifier dynamiquement le profil stagiaire
export const useStagiaireProfile = (stagiaireId?: number) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const loadProfile = useCallback(async () => {
    if (!stagiaireId) return;
    setLoading(true);
    setError('');
    try {
      const res: any = await getStagiaireById(stagiaireId);
      setProfile(res.stagiaire);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }, [stagiaireId]);

  const saveProfile = async (data: any) => {
    if (!stagiaireId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res: any = await updateStagiaire(stagiaireId, data);
      setProfile(res.stagiaire);
      setSuccess(res.message || 'Profil mis à jour');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stagiaireId) {
      loadProfile();
    }
  }, [stagiaireId, loadProfile]);

  return { profile, loading, error, success, loadProfile, saveProfile, setProfile };
};
