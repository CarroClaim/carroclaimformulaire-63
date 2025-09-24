// Service centralisé pour l'administration
// Sépare la logique métier de l'interface utilisateur

export interface RequestSnapshot {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  request_type: 'quote' | 'appointment';
  created_at: string;
  snapshot_url?: string;
}

export interface AdminRequestDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  status: string;
  request_type: string;
  description?: string;
  preferred_date?: string;
  preferred_time?: string;
  damage_screenshot?: string;
  created_at: string;
  updated_at: string;
  photos: Array<{
    id: string;
    photo_type: string;
    public_url: string;
    file_name: string;
  }>;
  damages: Array<{
    name: string;
    description?: string;
  }>;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

class AdminService {
  private readonly baseUrl = 'https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth';
  private authCache: string | null = null;

  // Authentification
  async authenticate(credentials: AdminCredentials): Promise<boolean> {
    const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
    
    try {
      const response = await fetch(this.baseUrl, {
        headers: { 'Authorization': `Basic ${basicAuth}` }
      });
      
      if (response.ok) {
        this.authCache = basicAuth;
        this.saveAuthToStorage(basicAuth);
        return true;
      }
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('AdminService: Auth error:', error);
      throw error;
    }
  }

  // Vérifier l'authentification stockée
  checkStoredAuth(): boolean {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
      this.authCache = stored;
      return true;
    }
    return false;
  }

  // Déconnexion
  logout(): void {
    this.authCache = null;
    localStorage.removeItem('adminAuth');
  }

  // Charger toutes les demandes
  async loadRequests(statusFilter?: string): Promise<RequestSnapshot[]> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Not authenticated');

    try {
      const url = statusFilter ? `${this.baseUrl}?status=${statusFilter}` : this.baseUrl;
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${auth}` }
      });

      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication expired');
      }

      if (!response.ok) {
        throw new Error(`Failed to load requests: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('AdminService: Load requests error:', error);
      throw error;
    }
  }

  // Charger les détails d'une demande
  async loadRequestDetail(requestId: string): Promise<AdminRequestDetail> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${this.baseUrl}?id=${requestId}`, {
        headers: { 'Authorization': `Basic ${auth}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to load request detail: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformRequestDetail(data);
    } catch (error) {
      console.error('AdminService: Load request detail error:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une demande
  async updateRequestStatus(requestId: string, newStatus: string): Promise<void> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Not authenticated');

    const validStatuses = ['pending', 'processing', 'completed', 'archived', 'deleted'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}?id=${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
    } catch (error) {
      console.error('AdminService: Update status error:', error);
      throw error;
    }
  }

  // Méthodes privées
  private getAuth(): string | null {
    return this.authCache || localStorage.getItem('adminAuth');
  }

  private saveAuthToStorage(auth: string): void {
    localStorage.setItem('adminAuth', auth);
  }

  private transformRequestDetail(data: any): AdminRequestDetail {
    return {
      ...data,
      damages: data.request_damages?.map((rd: any) => ({
        name: rd.damage_parts.name,
        description: rd.damage_parts.description
      })) || []
    };
  }
}

export const adminService = new AdminService();