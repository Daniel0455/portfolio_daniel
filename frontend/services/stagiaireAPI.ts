// Service API pour le module Stagiaire
// Liaison avec le backend Node.js/Express

interface LoginResponse {
  message: string;
  token: string;
  stagiaire: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    code_badge: string;
  };
}

interface TrelloBoardResponse {
  board: {
    id: string;
    name: string;
    url: string;
  };
  cards: Array<{
    id: string;
    name: string;
    desc: string;
    due: string | null;
    idList: string;
    labels: Array<{
      name: string;
      color: string;
    }>;
  }>;
  lists: Array<{
    id: string;
    name: string;
  }>;
}

interface PresenceResponse {
  message: string;
  presence: {
    id: number;
    date: string;
    etat: string;
    justification: string;
  };
}

interface NotificationResponse {
  notifications: Array<{
    id_notif: number;
    titre_notif: string;
    contenu_notif: string;
    type_notif: string;
    lu: boolean;
    date_notif: string;
  }>;
}

interface MessageResponse {
  messages: Array<{
    id_mg: number;
    contenu: string;
    date_envoie: string;
    nom: string;
    prenom: string;
    user_type: string;
  }>;
}

interface SessionTimeResponse {
  period: string;
  total_sessions: number;
  total_time: {
    minutes: number;
    hours: number;
    formatted: string;
  };
  average_session_minutes: number;
}

class StagiaireAPI {
  public baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
    this.token = this.getStoredToken();
  }

  // Gestion du token
  public getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Cas particulier : pas de Trello associé
      if (
        !response.ok &&
        response.status === 404 &&
        data &&
        data.message &&
        data.message.includes('Aucun tableau Trello associé')
      ) {
        return null as T;
      }

      // Cas particulier : présence déjà enregistrée
      if (
        !response.ok &&
        response.status === 400 &&
        data &&
        data.message &&
        data.message.includes("Présence déjà enregistrée pour aujourd'hui")
      ) {
        return { alreadyRecorded: true } as T;
      }

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Authentification
  async login(email: string, mdp: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>('/stagiaires/login', {
      method: 'POST',
      body: JSON.stringify({ email, mdp }),
    });
    if (!data) throw new Error('Erreur lors de la connexion');
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  logout(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Inscription (sans authentification requise)
  async inscription(formData: FormData): Promise<any> {
    const url = `${this.baseUrl}/stagiaires/inscription`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // FormData pour gérer les fichiers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP: ${response.status}`);
    }

    return data;
  }

  // Trello
  async addTrelloBoard(stagiaireId: number, trelloUrl: string): Promise<any> {
    return this.request(`/stagiaires/${stagiaireId}/trello`, {
      method: 'POST',
      body: JSON.stringify({ trello_url: trelloUrl }),
    });
  }

  async getTrelloBoard(stagiaireId: number): Promise<TrelloBoardResponse | null> {
    try {
      return await this.request<TrelloBoardResponse>(`/stagiaires/${stagiaireId}/trello`);
    } catch (error: any) {
      // Si c'est une erreur 404 "Aucun tableau Trello associé", retourne null
      if (error.message && error.message.includes('Aucun tableau Trello associé')) {
        return null;
      }
      throw error;
    }
  }

  // Présence
  async recordPresence(stagiaireId: number, networkInfo?: { ssid?: string; bssid?: string; ipAddress?: string }): Promise<PresenceResponse | { alreadyRecorded: true }> {
    try {
      const data = await this.request<PresenceResponse>(`/stagiaires/${stagiaireId}/presence`, {
        method: 'POST',
        body: JSON.stringify({
          network_info: {
            ssid: networkInfo?.ssid,
            bssid: networkInfo?.bssid,
            ip_address: networkInfo?.ipAddress,
            user_agent: navigator.userAgent,
            connection_type: (navigator as any).connection?.effectiveType || 'unknown',
          },
        }),
      });
      if (!data) throw new Error('Erreur lors de l\'enregistrement de la présence');
      return data;
    } catch (error: any) {
      if (error.message && error.message.includes("Présence déjà enregistrée pour aujourd'hui")) {
        return { alreadyRecorded: true };
      }
      throw error;
    }
  }

  async getPresenceHistory(stagiaireId: number, limit: number = 30): Promise<any> {
    return this.request(`/stagiaires/${stagiaireId}/presence?limit=${limit}`);
  }

  // Notifications
  async getNotifications(stagiaireId: number, limit: number = 20): Promise<NotificationResponse> {
    const data = await this.request<NotificationResponse>(`/stagiaires/${stagiaireId}/notifications?limit=${limit}`);
    if (!data) throw new Error('Erreur lors du chargement des notifications');
    return data;
  }

  async markNotificationsAsRead(stagiaireId: number, notificationIds: number[]): Promise<any> {
    return this.request(`/stagiaires/${stagiaireId}/notifications/read`, {
      method: 'POST',
      body: JSON.stringify({ notification_ids: notificationIds }),
    });
  }

  // Messagerie
  async sendMessage(contenu: string, idTheme: number): Promise<any> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ contenu, id_theme: idTheme }),
    });
  }

  async getMessages(themeId: number, limit: number = 50): Promise<MessageResponse> {
    const data = await this.request<MessageResponse>(`/messages/${themeId}?limit=${limit}`);
    if (!data) throw new Error('Erreur lors du chargement des messages');
    return data;
  }

  // Sessions
  async startSession(stagiaireId: number): Promise<any> {
    return this.request(`/stagiaires/${stagiaireId}/start-session`, {
      method: 'POST',
    });
  }

  async endSession(stagiaireId: number): Promise<any> {
    return this.request(`/stagiaires/${stagiaireId}/end-session`, {
      method: 'POST',
    });
  }

  async getSessionTime(stagiaireId: number, period: string = 'all'): Promise<SessionTimeResponse> {
    const data = await this.request<SessionTimeResponse>(`/stagiaires/${stagiaireId}/session-time?period=${period}`);
    if (!data) throw new Error('Erreur lors du chargement des stats de session');
    return data;
  }

  async getStagiaireTheme(stagiaireId: number): Promise<{ id_theme: number | null }> {
    const data = await this.request<{ stagiaire: { id_theme: number | null } }>(`/stagiaires/${stagiaireId}`);
    if (!data) throw new Error('Erreur lors de la récupération du thème');
    return { id_theme: data.stagiaire.id_theme };
  }

  async getThemeParticipants(themeId: number): Promise<{ stagiaires: Array<{ id_stagiaire: number; nom: string; prenom: string; }>; encadreurs: Array<{ id_enc: number; nom: string; }> }> {
    const data = await this.request<{ stagiaires: Array<{ id_stagiaire: number; nom: string; prenom: string; }>; encadreurs: Array<{ id_enc: number; nom: string; }> }>(`/stagiaires/themes/${themeId}/participants`);
    if (!data) throw new Error('Erreur lors de la récupération des participants');
    return data;
  }

  async getUnreadMessagesCount(stagiaireId: number): Promise<{ count: number }> {
    const data = await this.request<{ count: number }>(`/stagiaires/${stagiaireId}/unread-messages`);
    if (!data) throw new Error('Erreur lors de la récupération du nombre de messages non lus');
    return data;
  }

  async markMessagesAsRead(stagiaireId: number): Promise<void> {
    await this.request(`/stagiaires/${stagiaireId}/mark-messages-read`, { method: 'POST' });
  }

  // Utilitaires
  getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  setCurrentUser(userData: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  }
}

// Instance singleton
const stagiaireAPI = new StagiaireAPI();

export default stagiaireAPI;
export { StagiaireAPI };
export type {
  LoginResponse,
  TrelloBoardResponse,
  PresenceResponse,
  NotificationResponse,
  MessageResponse,
  SessionTimeResponse,
};
