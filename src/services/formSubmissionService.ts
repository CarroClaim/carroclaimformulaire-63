/**
 * SERVICE DE SOUMISSION DU FORMULAIRE
 * 
 * Ce service gère la soumission finale du formulaire :
 * - Préparation des données pour envoi backend
 * - Sauvegarde en base de données Supabase
 * - Génération et envoi d'emails de notification
 * - Gestion des erreurs et retry automatique
 * - Logging des soumissions pour suivi
 */

import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/form';
import { photoUploadService } from './photoUploadService';

// Interface pour les données de soumission enrichies
interface SubmissionData {
  id: string;
  requestType: 'quote' | 'appointment';
  selectedDamages: string[];
  photoUrls: {
    registration: string[];
    mileage: string[];
    vehicleAngles: string[];
    damagePhotosClose: string[];
    damagePhotosFar: string[];
  };
  contact: FormData['contact'];
  description?: string;
  preferredDate?: string;
  preferredTime?: string;
  submittedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: {
    userAgent: string;
    ipAddress?: string;
    sessionId: string;
    formVersion: string;
  };
}

// Interface pour le résultat de soumission
interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  error?: string;
  retryable?: boolean;
}

class FormSubmissionService {
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 2000;

  /**
   * SOUMISSION PRINCIPALE DU FORMULAIRE
   * Point d'entrée principal pour soumettre le formulaire
   */
  async submitFormData(formData: FormData): Promise<boolean> {
    let lastError: Error | null = null;

    // Tentatives avec retry automatique
    for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        console.log(`Tentative de soumission ${attempt}/${this.MAX_RETRY_ATTEMPTS}`);
        
        const result = await this.performSubmission(formData);
        
        if (result.success && result.submissionId) {
          console.log(`Soumission réussie - ID: ${result.submissionId}`);
          
          // Notifications post-soumission (asynchrone)
          this.sendNotifications(result.submissionId, formData).catch(error => {
            console.warn('Échec envoi notifications:', error);
          });
          
          return true;
        } else {
          throw new Error(result.error || 'Échec de soumission sans détail');
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erreur inconnue');
        console.error(`Tentative ${attempt} échouée:`, lastError.message);

        // Attendre avant retry (sauf dernière tentative)
        if (attempt < this.MAX_RETRY_ATTEMPTS) {
          await this.delay(this.RETRY_DELAY_MS * attempt);
        }
      }
    }

    // Toutes les tentatives ont échoué
    console.error('Échec définitif de soumission après', this.MAX_RETRY_ATTEMPTS, 'tentatives');
    
    // Log de l'échec pour debugging
    await this.logFailedSubmission(formData, lastError);
    
    throw lastError || new Error('Échec de soumission après plusieurs tentatives');
  }

  /**
   * EXÉCUTION DE LA SOUMISSION
   * Logique principale de soumission avec gestion transactionnelle
   */
  private async performSubmission(formData: FormData): Promise<SubmissionResult> {
    try {
      // 1. Préparation des données
      const submissionData = await this.prepareSubmissionData(formData);

      // 2. Sauvegarde en base de données
      const submissionId = await this.saveToDatabase(submissionData);

      // 3. Validation post-sauvegarde
      await this.validateSubmission(submissionId);

      return {
        success: true,
        submissionId: submissionId
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      return {
        success: false,
        error: errorMessage,
        retryable: this.isRetryableError(error)
      };
    }
  }

  /**
   * PRÉPARATION DES DONNÉES DE SOUMISSION
   * Transforme les données du formulaire en format de base de données
   */
  private async prepareSubmissionData(formData: FormData): Promise<SubmissionData> {
    // Extraction des URLs des photos uploadées
    const photoUrls = {
      registration: this.extractPhotoUrls(formData.photos.registration),
      mileage: this.extractPhotoUrls(formData.photos.mileage),
      vehicleAngles: this.extractPhotoUrls(formData.photos.vehicleAngles),
      damagePhotosClose: this.extractPhotoUrls(formData.photos.damagePhotosClose),
      damagePhotosFar: this.extractPhotoUrls(formData.photos.damagePhotosFar)
    };

    // L'ID sera généré automatiquement par Supabase (UUID)
    // const submissionId = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Collecte des métadonnées
    const metadata = {
      userAgent: navigator.userAgent,
      sessionId: this.generateSessionId(),
      formVersion: '1.0.0',
      submissionTimestamp: new Date().toISOString()
    };

    return {
      id: '', // L'ID sera généré par Supabase
      requestType: formData.requestType as 'quote' | 'appointment',
      selectedDamages: formData.selectedDamages,
      photoUrls,
      contact: formData.contact,
      description: formData.description || undefined,
      preferredDate: formData.preferredDate || undefined,
      preferredTime: formData.preferredTime || undefined,
      submittedAt: new Date(),
      status: 'pending',
      metadata
    };
  }

  /**
   * SAUVEGARDE EN BASE DE DONNÉES
   * Utilise la table 'requests' existante du schéma Supabase
   */
  private async saveToDatabase(submissionData: SubmissionData): Promise<string> {
    try {
      // Insertion de la demande principale dans la table 'requests'
      // On ne spécifie pas l'ID, Supabase génèrera automatiquement un UUID
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .insert([{
          first_name: submissionData.contact.firstName,
          last_name: submissionData.contact.lastName,
          email: submissionData.contact.email,
          phone: submissionData.contact.phone,
          address: submissionData.contact.address,
          city: submissionData.contact.city,
          postal_code: submissionData.contact.postalCode,
          description: submissionData.description,
          preferred_date: submissionData.preferredDate,
          preferred_time: submissionData.preferredTime,
          status: 'pending',
          request_type: submissionData.requestType
        }])
        .select()
        .single();

      if (requestError) {
        throw new Error(`Erreur sauvegarde request: ${requestError.message}`);
      }

      if (!requestData?.id) {
        throw new Error('ID de la demande non récupéré après insertion');
      }

      const generatedRequestId = requestData.id;

      // Sauvegarde des dommages sélectionnés
      await this.saveDamages(generatedRequestId, submissionData.selectedDamages);

      // Sauvegarde des URLs des photos
      await this.savePhotoUrls(generatedRequestId, submissionData.photoUrls);

      console.log('Données sauvegardées avec succès:', requestData);
      return generatedRequestId;

    } catch (error) {
      console.error('Erreur sauvegarde base de données:', error);
      throw error;
    }
  }

  /**
   * SAUVEGARDE DES DOMMAGES SÉLECTIONNÉS
   * Utilise la table 'request_damages' pour lier les dommages à la demande
   */
  private async saveDamages(requestId: string, selectedDamages: string[]): Promise<void> {
    if (selectedDamages.length === 0) return;

    // D'abord, récupérer les IDs des damage_parts correspondants
    const { data: damageParts, error: damagePartsError } = await supabase
      .from('damage_parts')
      .select('id, name')
      .in('name', selectedDamages);

    if (damagePartsError) {
      console.warn('Erreur récupération damage parts:', damagePartsError);
      return; // Ne pas faire échouer la soumission pour ça
    }

    if (!damageParts || damageParts.length === 0) {
      console.warn('Aucune damage part trouvée pour les dommages sélectionnés');
      return;
    }

    const damageRecords = damageParts.map(damagePart => ({
      request_id: requestId,
      damage_part_id: damagePart.id,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('request_damages')
      .insert(damageRecords);

    if (error) {
      console.error('Erreur sauvegarde dommages:', error);
      // Ne pas faire échouer la soumission pour les dommages
    }
  }

  /**
   * SAUVEGARDE DES URLS DES PHOTOS
   * Utilise la table 'photos' existante du schéma
   */
  private async savePhotoUrls(requestId: string, photoUrls: SubmissionData['photoUrls']): Promise<void> {
    const photoRecords: any[] = [];

    // Transformation des URLs en enregistrements pour la table 'photos'
    for (const [category, urls] of Object.entries(photoUrls)) {
      urls.forEach((url, index) => {
        // Mapping des catégories vers les types acceptés par le schéma
        let photoType: string = category;
        if (category === 'damagePhotosClose' || category === 'damagePhotosFar') {
          photoType = 'damage_photos';
        }

        photoRecords.push({
          request_id: requestId,
          photo_type: photoType,
          file_path: url,
          file_name: `${category}_${index + 1}`,
          mime_type: 'image/jpeg',
          file_size: 0 // Sera mis à jour si nécessaire
        });
      });
    }

    if (photoRecords.length > 0) {
      const { error } = await supabase
        .from('photos')
        .insert(photoRecords);

      if (error) {
        throw new Error(`Erreur sauvegarde photos: ${error.message}`);
      }
    }
  }

  /**
   * VALIDATION POST-SOUMISSION
   * Vérifie que la soumission a été correctement enregistrée
   */
  private async validateSubmission(submissionId: string): Promise<void> {
    const { data, error } = await supabase
      .from('requests')
      .select('id, status, created_at')
      .eq('id', submissionId)
      .single();

    if (error || !data) {
      throw new Error('Validation échouée: soumission non trouvée en base');
    }

    console.log('Validation réussie pour:', data);
  }

  /**
   * ENVOI DES NOTIFICATIONS
   * Envoie les emails de confirmation et notification interne
   */
  private async sendNotifications(submissionId: string, formData: FormData): Promise<void> {
    try {
      // Appel de la fonction Edge pour envoi d'emails
      const { error } = await supabase.functions.invoke('send-submission-notifications', {
        body: {
          submissionId,
          contact: formData.contact,
          requestType: formData.requestType,
          damageCount: formData.selectedDamages.length
        }
      });

      if (error) {
        console.error('Erreur envoi notifications:', error);
      } else {
        console.log('Notifications envoyées avec succès');
      }
    } catch (error) {
      console.error('Échec envoi notifications:', error);
    }
  }

  /**
   * LOGGING DES ÉCHECS
   * Enregistre les erreurs dans la console pour debugging (pas de table dédiée)
   */
  private async logFailedSubmission(formData: FormData, error: Error | null): Promise<void> {
    try {
      console.error('Échec de soumission du formulaire:', {
        error: error?.message || 'Erreur inconnue',
        stack: error?.stack,
        formData: {
          requestType: formData.requestType,
          selectedDamagesCount: formData.selectedDamages.length,
          contactEmail: formData.contact.email,
          hasPhotos: Object.values(formData.photos).some(arr => arr.length > 0)
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (logError) {
      console.error('Échec du logging d\'erreur:', logError);
    }
  }

  /**
   * UTILITAIRES PRIVÉS
   */
  private extractPhotoUrls(photos: File[]): string[] {
    return photos
      .map(photo => {
        const metadata = photoUploadService.getFileMetadata(photo);
        return metadata?.publicUrl || '';
      })
      .filter(url => url !== ''); // Filtrer les URLs vides
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Erreurs réseau ou temporaires
      return error.message.includes('network') || 
             error.message.includes('timeout') || 
             error.message.includes('503') ||
             error.message.includes('502');
    }
    return false;
  }

  /**
   * RÉCUPÉRATION DU STATUT D'UNE SOUMISSION
   * Permet de vérifier l'état d'une soumission existante
   */
  async getSubmissionStatus(submissionId: string): Promise<{ status: string; createdAt: Date } | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('status, created_at')
        .eq('id', submissionId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        status: data.status,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      console.error('Erreur récupération statut:', error);
      return null;
    }
  }
}

// Export de l'instance unique du service
export const formSubmissionService = new FormSubmissionService();