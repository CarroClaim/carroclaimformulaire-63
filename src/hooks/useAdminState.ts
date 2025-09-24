// Hook centralisé pour l'état de l'administration
import { useState, useEffect } from 'react';
import { adminService, RequestSnapshot, AdminRequestDetail, AdminCredentials } from '@/services/adminService';
import { useErrorHandler } from './useErrorHandler';
import { mapDBToUI } from '@/lib/damageMapping';

export const useAdminState = () => {
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // États des données
  const [requests, setRequests] = useState<RequestSnapshot[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequestDetail | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // États de navigation
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // États de chargement
  const [loading, setLoading] = useState(true);
  const [requestDetailLoading, setRequestDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const { handleAsync, handleError } = useErrorHandler();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const isStored = adminService.checkStoredAuth();
    setIsAuthenticated(isStored);
    setLoading(false);
  }, []);

  // Charger les demandes quand nécessaire
  useEffect(() => {
    if (isAuthenticated && activeSection === 'requests') {
      loadRequests();
    }
  }, [isAuthenticated, activeSection]);

  // Actions d'authentification
  const authenticate = async (credentials: AdminCredentials): Promise<boolean> => {
    setAuthLoading(true);
    try {
      const success = await adminService.authenticate(credentials);
      setIsAuthenticated(success);
      return success;
    } catch (error) {
      handleError(error, 'Identifiants incorrects');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setActiveSection('dashboard');
    setSelectedRequest(null);
    setSelectedRequestId(null);
  };

  // Actions des données
  const loadRequests = async (statusFilter?: string) => {
    setLoading(true);
    const result = await handleAsync(
      () => adminService.loadRequests(statusFilter),
      'Chargement des demandes...',
      'Erreur lors du chargement des demandes'
    );
    
    if (result) {
      setRequests(result);
    }
    setLoading(false);
  };

  const loadRequestDetail = async (requestId: string) => {
    setRequestDetailLoading(true);
    setSelectedRequestId(requestId);
    
    const result = await handleAsync(
      () => adminService.loadRequestDetail(requestId),
      'Chargement des détails...',
      'Impossible de charger les détails de la demande'
    );
    
    if (result) {
      // Transformer les dommages pour l'affichage
      const transformedData = {
        ...result,
        damages: result.damages.map(damage => ({
          name: mapDBToUI(damage.name),
          description: damage.description
        }))
      };
      setSelectedRequest(transformedData);
    }
    
    setRequestDetailLoading(false);
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    
    const success = await handleAsync(
      () => adminService.updateRequestStatus(requestId, newStatus),
      'Mise à jour du statut...',
      'Impossible de mettre à jour le statut'
    );
    
    if (success !== null) {
      // Rafraîchir les données
      await loadRequests();
      
      // Mettre à jour la demande sélectionnée si nécessaire
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    }
    
    setUpdatingStatus(null);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'requests') {
      loadRequests();
    }
    // Nettoyer la sélection lors du changement de section
    setSelectedRequest(null);
    setSelectedRequestId(null);
  };

  return {
    // États
    isAuthenticated,
    authLoading,
    requests,
    selectedRequest,
    selectedRequestId,
    activeSection,
    loading,
    requestDetailLoading,
    updatingStatus,
    
    // Actions
    authenticate,
    logout,
    loadRequests,
    loadRequestDetail,
    updateRequestStatus,
    handleSectionChange,
  };
};