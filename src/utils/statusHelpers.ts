// Utilitaires pour la gestion des statuts
import { Play, Check, Archive, Trash2 } from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-500 text-yellow-50';
    case 'processing': return 'bg-blue-500 text-blue-50';
    case 'completed': return 'bg-green-500 text-green-50';
    case 'archived': return 'bg-gray-500 text-gray-50';
    case 'deleted': return 'bg-red-500 text-red-50';
    default: return 'bg-gray-500 text-gray-50';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'processing': return 'En cours';
    case 'completed': return 'Traité';
    case 'archived': return 'Archivé';
    case 'deleted': return 'Supprimé';
    default: return status;
  }
};

export interface StatusAction {
  key: string;
  label: string;
  status: string;
  icon: any;
  className: string;
}

export const getStatusActions = (currentStatus: string): StatusAction[] => {
  const actions: StatusAction[] = [];
  
  if (currentStatus === 'pending') {
    actions.push({
      key: 'start',
      label: 'Commencer',
      status: 'processing',
      icon: Play,
      className: 'bg-blue-600 hover:bg-blue-700'
    });
  }
  
  if (currentStatus === 'processing') {
    actions.push({
      key: 'complete',
      label: 'Terminer',
      status: 'completed',
      icon: Check,
      className: 'bg-green-600 hover:bg-green-700'
    });
  }
  
  if (currentStatus === 'completed') {
    actions.push({
      key: 'archive',
      label: 'Archiver',
      status: 'archived',
      icon: Archive,
      className: 'bg-gray-600 hover:bg-gray-700'
    });
  }

  // Ajouter l'option de suppression pour tous les statuts sauf 'deleted'
  if (currentStatus !== 'deleted') {
    actions.push({
      key: 'delete',
      label: 'Supprimer',
      status: 'deleted',
      icon: Trash2,
      className: 'bg-red-600 hover:bg-red-700'
    });
  }
  
  return actions;
};