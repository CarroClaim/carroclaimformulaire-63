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
  damageScreenshotUrl?: string; // URL du screenshot des dégâts
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
    // Upload des photos vers Supabase Storage et récupération des URLs
    const photoUrls = await this.uploadPhotosToStorage(formData.photos);
    
    // Génération et upload du damage screenshot si des dommages sont sélectionnés
    let damageScreenshotUrl = '';
    if (formData.selectedDamages && formData.selectedDamages.length > 0) {
      try {
        damageScreenshotUrl = await this.generateDamageScreenshot(formData.selectedDamages);
      } catch (error) {
        console.warn('Erreur génération damage screenshot:', error);
        // Ne pas faire échouer la soumission pour ça
      }
    }

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
      damageScreenshotUrl, // Nouveau champ pour le screenshot
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
          request_type: submissionData.requestType,
          damage_screenshot: submissionData.damageScreenshotUrl
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
        } else if (category === 'vehicleAngles') {
          photoType = 'vehicle_angles';
        }

        // Extraire le path du fichier depuis l'URL publique
        // URL format: https://domain/storage/v1/object/public/claim-photos/path
        const urlParts = url.split('/claim-photos/');
        const filePath = urlParts.length > 1 ? urlParts[1] : `${category}/${Date.now()}_${index + 1}.jpg`;

        photoRecords.push({
          request_id: requestId,
          photo_type: photoType,
          file_path: filePath, // Stocker le chemin du fichier, pas l'URL complète
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
      
      console.log(`Sauvegardé ${photoRecords.length} photos en base de données`);
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
      const { error } = await supabase.functions.invoke('send-submission-notification', {
        body: {
          submissionId,
          contact: formData.contact,
          requestType: formData.requestType,
          damageCount: formData.selectedDamages.length,
          description: formData.description
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
   * UPLOAD DES PHOTOS VERS SUPABASE STORAGE
   */
  private async uploadPhotosToStorage(photos: FormData['photos']): Promise<SubmissionData['photoUrls']> {
    const uploadedUrls: SubmissionData['photoUrls'] = {
      registration: [],
      mileage: [],
      vehicleAngles: [],
      damagePhotosClose: [],
      damagePhotosFar: []
    };

    try {
      // Upload chaque catégorie de photos
      for (const [category, files] of Object.entries(photos) as [keyof FormData['photos'], File[]][]) {
        if (files && files.length > 0) {
          console.log(`Uploading ${files.length} files for category: ${category}`);
          
          // Utiliser le service d'upload existant
          const uploadedFiles = await photoUploadService.uploadToSupabase(files, category);
          
          // Extraire les URLs publiques des fichiers uploadés
          uploadedUrls[category] = uploadedFiles
            .map(file => {
              const metadata = photoUploadService.getFileMetadata(file);
              return metadata?.publicUrl || '';
            })
            .filter(url => url !== '');

          console.log(`Uploaded ${uploadedUrls[category].length} URLs for ${category}`);
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Erreur lors de l\'upload des photos:', error);
      throw new Error(`Échec de l'upload des photos: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * GÉNÉRATION DU DAMAGE SCREENSHOT
   * Crée un PNG des dégâts sélectionnés et l'upload vers Supabase Storage
   */
  private async generateDamageScreenshot(selectedDamages: string[]): Promise<string> {
    try {
      console.log('Génération du damage screenshot pour:', selectedDamages);

      // Créer un SVG avec les dégâts sélectionnés
      const svgContent = this.createCarDamageSVG(selectedDamages);
      
      // Convertir le SVG en PNG
      const pngBlob = await this.svgToPng(svgContent);
      
      // Convertir le blob en File pour utiliser le service d'upload existant
      const file = new File([pngBlob], `damage_screenshot_${Date.now()}.png`, {
        type: 'image/png'
      });

      // Upload vers Supabase Storage
      const uploadedFiles = await photoUploadService.uploadToSupabase([file], 'damagePhotosClose');
      
      if (uploadedFiles.length > 0) {
        const metadata = photoUploadService.getFileMetadata(uploadedFiles[0]);
        return metadata?.publicUrl || '';
      }
      
      throw new Error('Échec upload damage screenshot');

    } catch (error) {
      console.error('Erreur génération damage screenshot:', error);
      throw error;
    }
  }

  /**
   * CRÉATION DU SVG DES DÉGÂTS DE VOITURE
   * Reproduit la logique du composant CarDamageSelector
   */
  private createCarDamageSVG(selectedDamages: string[]): string {
    const getPartStyle = (partName: string) => {
      const isSelected = selectedDamages.includes(partName);
      return isSelected ? 
        'fill="#0ea5e9" stroke="#0284c7" stroke-width="2"' : 
        'fill="#d9d9d9" stroke="#b0b0b0" stroke-width="2"';
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="418" height="558" viewBox="0 0 418 558" xmlns="http://www.w3.org/2000/svg" style="background: white;">
  <title>Schéma des dégâts du véhicule</title>
  <g>
    <!-- Portières -->
    <path ${getPartStyle("Portière avant gauche")} d="m 37,195 11.5,-0.5 H 60 74 l 14.5,0.5 v 26 4 c 0,0 0.5,1.5 1,2.5 0.5,1 1,2 1.5,2 h 2 c 1,0 2.3284,1.024 3.5,2 l 4.5,4 3,78 L 90.5,311 74.5,310 56,309 H 38 Z" />
    <path ${getPartStyle("Portière avant droite")} d="M 382,195.5 370.5,195 H 359 345 l -14.5,0.5 v 26 4 c 0,0 -0.5,1.5 -1,2.5 -0.5,1 -1,2 -1.5,2 h -2 c -1,0 -2.328,1.024 -3.5,2 l -4.5,4 -3,78 13.5,-2.5 16,-1 18.5,-1 h 18 z" />
    <path ${getPartStyle("Portière arrière gauche")} d="m 38,312.5 h 14 l 19.5,0.5 18.5,1 14.5,2.5 2.5,86 c 0,0 -3.305,1.635 -5.5,2.5 -2.2979,0.906 -3.6351,1.288 -6,2 -2.1317,0.642 -3.3088,1.106 -5.5,1.5 -2.5057,0.45 -6.5,0.5 -6.5,0.5 0,0 -1.1297,-4.441 -2.5,-7 -1.5118,-2.823 -2.9433,-4.045 -5,-6.5 -2.7503,-3.283 -4.2428,-5.22 -7.5,-8 -4.534,-3.87 -7.4523,-5.819 -13,-8 -6.0951,-2.396 -16.5,-3 -16.5,-3 z" />
    <path ${getPartStyle("Portière arrière droite")} d="m 381,312 h -14 l -19.5,0.5 -18.5,1 -14.5,2.5 -2.5,86 c 0,0 3.305,1.635 5.5,2.5 2.298,0.906 3.635,1.288 6,2 2.132,0.642 3.309,1.106 5.5,1.5 2.506,0.45 6.5,0.5 6.5,0.5 0,0 1.13,-4.441 2.5,-7 1.512,-2.823 2.943,-4.045 5,-6.5 2.75,-3.283 4.243,-5.22 7.5,-8 4.534,-3.87 7.452,-5.819 13,-8 6.095,-2.396 16.5,-3 16.5,-3 z" />
    
    <!-- Rétroviseurs -->
    <path ${getPartStyle("Rétroviseur gauche")} d="m 98.5,230.5 c 5,3 11.5,15.5 10,-18 0,-9.665 -3.529,-17.5 -8.5,-17.5 -12.5,-2.5 -9.5,1.5 -10,18 0.2435,9.422 -3,12.5 8.5,17.5 z" />
    <path ${getPartStyle("Rétroviseur droite")} d="m 320.22,231.183 c -5,3 -11.5,15.5 -10.001,-18 0,-9.665 3.53,-17.5 8.5,-17.5 12.501,-2.5 9.501,1.5 10.001,18 -0.244,9.422 3,12.5 -8.5,17.5 z" />
    
    <!-- Vitres -->
    <path ${getPartStyle("Vitre avant gauche")} d="m 111,214.5 c 0,0 27.5,39 31,56.5 3.5,17.5 5.5,51 5.5,51 L 106,313.5 c 0,0 -2.5,-72.5 -2.5,-75 0,-2.5 7.5,0 7.5,-8 z" />
    <path ${getPartStyle("Vitre avant droite")} d="m 308.5,215 c 0,0 -27.5,39 -31,56.5 -3.5,17.5 -5.5,51 -5.5,51 l 41.5,-8.5 c 0,0 2.5,-72.5 2.5,-75 0,-2.5 -7.5,0 -7.5,-8 z" />
    <path ${getPartStyle("Vitre arrière gauche")} d="m 107,317 40,7 c 0,0 -2,48 -4.5,55 -2.5,7 -13.5,12 -15.5,13 -2,1 -18,9.5 -18,9.5 z" />
    <path ${getPartStyle("Vitre arrière droite")} d="m 312,317 -40,7 c 0,0 2,48 4.5,55 2.5,7 13.5,12 15.5,13 2,1 18,9.5 18,9.5 z" />
    <path ${getPartStyle("Pare-brise")} d="m 130,184 c 0,0 22.077,-12.244 37.5,-16.5 16.296,-4.497 26.094,-5.046 43,-5 16.518,0.045 26.091,0.558 42,5 15.238,4.254 37,16.5 37,16.5 0,0 -7.13,23.043 -11,38 -3.714,14.353 -8.5,37 -8.5,37 0,0 -16.409,-7.031 -27.5,-9.5 -12.252,-2.727 -19.449,-2.885 -32,-3 -13.912,-0.128 -21.966,-0.227 -35.5,3 -10.515,2.508 -26,9.5 -26,9.5 0,0 -4.575,-24.217 -8.5,-39.5 C 136.903,205.497 130,184 130,184 Z" />
    <path ${getPartStyle("Lunette arrière")} d="m 154.808,400.5 c 0,0 12.189,4.779 21.192,6.5 12.137,2.32 21.145,2.785 33.5,3 11.144,0.194 21.541,0.03 32.5,-2 10.687,-1.979 22,-8.5 22,-8.5 0,0 0.731,11.597 1.5,19 0.65,6.263 0.903,9.799 2,16 0.941,5.318 1.906,8.211 3,13.5 1.047,5.063 2.5,13 2.5,13 0,0 -6.443,4.997 -11,7.5 -4.832,2.654 -7.729,3.886 -13,5.5 -7.183,2.2 -11.529,2.218 -19,3 -7.584,0.794 -11.877,0.818 -19.5,1 -6.637,0.158 -10.384,0.551 -17,0 -6.91,-0.575 -10.762,-1.364 -17.5,-3 -6.361,-1.545 -10.104,-2.155 -16,-5 -6.195,-2.989 -14.5,-10 -14.5,-10 0,0 2.016,-7.577 3,-12.5 1.315,-6.58 1.475,-10.368 2.5,-17 0.936,-6.059 1.744,-9.415 2.5,-15.5 0.701,-5.642 1.308,-14.5 1.308,-14.5 z" />
  </g>
</svg>`;
  }

  /**
   * CONVERSION SVG VERS PNG
   * Utilise la même logique que le composant CarDamageSelector
   */
  private async svgToPng(svgContent: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // Créer un canvas pour le rendu
        const canvas = document.createElement('canvas');
        canvas.width = 418 * 2; // 2x pour meilleure qualité
        canvas.height = 558 * 2;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contexte 2D non disponible'));
          return;
        }

        // Fond blanc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Créer une image à partir du SVG
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Échec conversion PNG'));
            }
          }, 'image/png', 0.92);
        };
        img.onerror = () => reject(new Error('Erreur chargement SVG'));

        // Encoder le SVG en base64 pour l'image
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      } catch (error) {
        reject(error);
      }
    });
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