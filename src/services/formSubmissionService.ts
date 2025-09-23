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
   * Génère le contenu SVG pour le schéma des dommages
   * Copie INTÉGRALE du composant CarDamageSelector pour un rendu identique
   */
  private createCarDamageSVG(selectedDamages: string[]): string {
    console.log('🚗 Génération SVG avec dommages sélectionnés:', selectedDamages);
    
    const getPartStyle = (partName: string) => {
      if (selectedDamages.includes(partName)) {
        return 'fill: #FF0000; stroke: #CC0000; stroke-width: 2;';
      }
      return 'fill: #E0E0E0; stroke: #808080; stroke-width: 1;';
    };

    return `<svg width="418" height="558" viewBox="0 0 418 558" xmlns="http://www.w3.org/2000/svg">
  <rect width="418" height="558" fill="white"/>
  <g>
    <!-- Portières -->
    <path style="${getPartStyle("Portière avant gauche")}" d="m 37,195 11.5,-0.5 H 60 74 l 14.5,0.5 v 26 4 c 0,0 0.5,1.5 1,2.5 0.5,1 1,2 1.5,2 h 2 c 1,0 2.3284,1.024 3.5,2 l 4.5,4 3,78 L 90.5,311 74.5,310 56,309 H 38 Z"/>
    <path style="${getPartStyle("Portière avant droite")}" d="M 382,195.5 370.5,195 H 359 345 l -14.5,0.5 v 26 4 c 0,0 -0.5,1.5 -1,2.5 -0.5,1 -1,2 -1.5,2 h -2 c -1,0 -2.328,1.024 -3.5,2 l -4.5,4 -3,78 13.5,-2.5 16,-1 18.5,-1 h 18 z"/>
    <path style="${getPartStyle("Portière arrière gauche")}" d="m 38,312.5 h 14 l 19.5,0.5 18.5,1 14.5,2.5 2.5,86 c 0,0 -3.305,1.635 -5.5,2.5 -2.2979,0.906 -3.6351,1.288 -6,2 -2.1317,0.642 -3.3088,1.106 -5.5,1.5 -2.5057,0.45 -6.5,0.5 -6.5,0.5 0,0 -1.1297,-4.441 -2.5,-7 -1.5118,-2.823 -2.9433,-4.045 -5,-6.5 -2.7503,-3.283 -4.2428,-5.22 -7.5,-8 -4.534,-3.87 -7.4523,-5.819 -13,-8 -6.0951,-2.396 -16.5,-3 -16.5,-3 z"/>
    <path style="${getPartStyle("Portière arrière droite")}" d="m 381,312 h -14 l -19.5,0.5 -18.5,1 -14.5,2.5 -2.5,86 c 0,0 3.305,1.635 5.5,2.5 2.298,0.906 3.635,1.288 6,2 2.132,0.642 3.309,1.106 5.5,1.5 2.506,0.45 6.5,0.5 6.5,0.5 0,0 1.13,-4.441 2.5,-7 1.512,-2.823 2.943,-4.045 5,-6.5 2.75,-3.283 4.243,-5.22 7.5,-8 4.534,-3.87 7.452,-5.819 13,-8 6.095,-2.396 16.5,-3 16.5,-3 z"/>
    
    <!-- Capot, Toit, Hayon principaux -->
    <path style="${getPartStyle("Capot")}" d="m 138.25918,72 c 0,0 7.043,-5.0566 12,-7.5 5.761,-2.8398 15.5,-5.5 15.5,-5.5 0,0 2.385,-1.4617 3,-3 0.58,-1.4504 0,-4 0,-4 h 3.5 v 3 c 0,0 22.181,-3.4293 36.5,-3.5 15.097,-0.0746 38.5,3.5 38.5,3.5 l 1,-3 h 3 c 0,0 -0.338,2.667 0.5,4 0.441,0.7014 0.874,0.9579 1.5,1.5 1.85,1.6011 5.5,3 5.5,3 0,0 6.866,2.0496 11,4 4.755,2.2434 11.5,7 11.5,7 0,0 3.851,27.3556 5,45 0.641,9.848 0.609,15.389 1,25.25 0.391,9.861 0.1,15.423 1,25.25 0.574,6.271 2,16 2,16 0,0 -8.741,-4.766 -14.5,-7.5 -5.768,-2.737 -8.977,-4.383 -15,-6.5 -4.605,-1.619 -7.263,-2.32 -12,-3.5 -4.645,-1.157 -7.262,-1.816 -12,-2.5 -4.847,-0.7 -7.612,-0.707 -12.5,-1 -4.877,-0.292 -7.615,-0.441 -12.5,-0.5 0,0 -14.716,-0.341 -24,1 -4.927,0.712 -7.639,1.428 -12.5,2.5 -4.116,0.908 -6.462,1.29 -10.5,2.5 -3.372,1.011 -5.242,1.666 -8.5,3 -3.395,1.39 -5.193,2.412 -8.5,4 -6.691,3.213 -17,8.5 -17,8.5 0,0 1.508,-11.555 2,-19 0.529,-7.991 0.261,-12.495 0.5,-20.5 0.315,-10.547 0.4,-16.466 1,-27 0.991,-17.4202 4,-44.5 4,-44.5 z"/>
    <path style="${getPartStyle("Toit")}" d="m 150.5,260 c 0,0 10.5,-10 54,-12 43.5,-2 63.5,11.5 63.5,11.5 0,0 -4,24 -6,69.5 -2,45.5 2,68 2,68 0,0 -13,12 -54.5,11 -41.5,-1 -54.5,-9.5 -54.5,-9.5 0,0 3,-11 1.5,-71 -1.5,-60 -6,-67.5 -6,-67.5 z"/>
    <path style="${getPartStyle("Hayon")}" d="m 143.72,462.5 c 0,0 4.983,4.992 9,7 4,2 9.049,4.292 13.55,5.823 4.092,1.392 18.627,5 22.95,5 5,0 10.341,1.275 31,0 5.082,-0.314 17.554,-1.519 22.55,-2.5 5.453,-1.071 8.45,-2.5 13.5,-4.5 2.819,-1.116 5.818,-2.319 8.45,-3.823 3.5,-2 8.55,-5.5 8.55,-5.5 v 9.823 c 0,0 -4.639,0.643 -7.5,1.5 -5.689,1.705 -4.939,1.196 -9.5,5 -1.908,1.592 -4.96,4.867 -5.27,5.177 -2.5,2.5 -5.283,6.513 -5.5,8.323 -0.5,4.177 2.5,5 2.5,5 l 25.27,-2 c 0,0 1.168,5.102 0,8 -1.085,2.692 -2.584,3.89 -5,5.5 -3.349,2.233 -6.068,2.637 -10,3.5 -17.233,3.781 -26.5,3.5 -26.5,3.5 0,0 -48.119,2.57 -68,-2.5 -3.95,-1.008 -9.368,-1.146 -13,-3 -3.235,-1.652 -5.588,-2.412 -7.5,-5.5 -1.976,-3.194 -1.5,-9.5 -1.5,-9.5 10.935,0.781 26.5,2.5 28,2 1.5,-0.5 1.289,-2.903 1.45,-5 0.288,-3.745 -2.557,-5.605 -4.95,-8.5 -2.662,-3.221 -3.945,-3.887 -7.55,-6 -5.541,-3.248 -15.45,-6 -15.45,-6 z"/>
  </g>
</svg>`;
  }
  }

  /**
   * Convertit le contenu SVG en image PNG
   * Méthode simplifiée et robuste avec logs de débogage
   */
  private async svgToPng(svgContent: string): Promise<Blob> {
    console.log('🔄 Début conversion SVG vers PNG...');
    
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 418 * 2;
        canvas.height = 558 * 2;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Impossible de créer le contexte canvas');
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('✅ Conversion PNG réussie');
              resolve(blob);
            } else {
              reject(new Error('Échec conversion PNG'));
            }
          }, 'image/png', 0.92);
        };
        
        img.onerror = () => reject(new Error('Erreur chargement SVG'));
        
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        
      } catch (error) {
        console.error('❌ Erreur conversion:', error);
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