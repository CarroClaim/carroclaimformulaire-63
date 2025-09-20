/**
 * SERVICE DE GESTION DES UPLOADS DE PHOTOS
 * 
 * Ce service centralise la logique d'upload des photos :
 * - Validation des fichiers (taille, format, qualité)
 * - Upload vers Supabase Storage avec organisation par catégories
 * - Redimensionnement et optimisation des images
 * - Génération de thumbnails pour prévisualisation
 * - Gestion des erreurs et retry automatique
 */

import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/form';

// Configuration des uploads
const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  maxFiles: {
    registration: 1,
    mileage: 1,
    vehicleAngles: 4,
    damagePhotosClose: 10,
    damagePhotosFar: 10
  },
  thumbnailSize: 200,
  compressionQuality: 0.8
};

// Interface pour les résultats de validation
interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

// Interface pour les métadonnées de fichier uploadé
interface UploadedFileMetadata {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  category: keyof FormData['photos'];
  publicUrl: string;
  thumbnailUrl?: string;
}

class PhotoUploadService {
  /**
   * VALIDATION DES FICHIERS AVANT UPLOAD
   * Vérifie la conformité des fichiers selon les règles métier
   */
  validateFiles(files: File[], category?: keyof FormData['photos']): ValidationResult {
    const warnings: string[] = [];

    // Vérification du nombre de fichiers
    if (category && UPLOAD_CONFIG.maxFiles[category] && files.length > UPLOAD_CONFIG.maxFiles[category]) {
      return {
        isValid: false,
        error: `Maximum ${UPLOAD_CONFIG.maxFiles[category]} fichier(s) autorisé(s) pour cette catégorie`
      };
    }

    // Validation de chaque fichier
    for (const file of files) {
      // Vérification de la taille
      if (file.size > UPLOAD_CONFIG.maxFileSize) {
        return {
          isValid: false,
          error: `Le fichier "${file.name}" dépasse la taille maximum de ${this.formatFileSize(UPLOAD_CONFIG.maxFileSize)}`
        };
      }

      // Vérification du type MIME
      if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: `Format de fichier non supporté : ${file.type}. Formats acceptés : JPEG, PNG, WebP, HEIC`
        };
      }

      // Avertissements pour optimisation
      if (file.size > 5 * 1024 * 1024) { // 5MB
        warnings.push(`Le fichier "${file.name}" est volumineux et sera compressé automatiquement`);
      }

      if (file.type === 'image/heic') {
        warnings.push(`Le fichier HEIC "${file.name}" sera converti en JPEG pour une meilleure compatibilité`);
      }
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * UPLOAD VERS SUPABASE STORAGE
   * Gère l'upload des fichiers avec optimisation automatique
   */
  async uploadToSupabase(files: File[], category: keyof FormData['photos']): Promise<File[]> {
    const uploadedFiles: File[] = [];
    const timestamp = Date.now();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Génération du nom de fichier unique
        const fileExtension = this.getFileExtension(file.name);
        const fileName = `${category}/${timestamp}_${i + 1}.${fileExtension}`;

        // Optimisation du fichier si nécessaire
        const optimizedFile = await this.optimizeImage(file);

        // Upload vers Supabase
        const { data, error } = await supabase.storage
          .from('claim-photos')
          .upload(fileName, optimizedFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: optimizedFile.type
          });

        if (error) {
          console.error(`Erreur upload fichier ${file.name}:`, error);
          throw new Error(`Échec de l'upload du fichier ${file.name}: ${error.message}`);
        }

        // Récupération de l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from('claim-photos')
          .getPublicUrl(data.path);

        // Création d'un objet File avec les métadonnées
        const uploadedFile = new File([optimizedFile], file.name, {
          type: optimizedFile.type,
          lastModified: Date.now()
        });

        // Ajout des métadonnées personnalisées (version simplifiée)
        Object.defineProperty(uploadedFile, 'supabaseMetadata', {
          value: {
            id: data.path,
            originalName: file.name,
            size: optimizedFile.size,
            mimeType: optimizedFile.type,
            path: data.path,
            publicUrl: publicUrlData.publicUrl,
            uploadedAt: new Date(),
            category: category
          },
          writable: false,
          enumerable: false
        });

        uploadedFiles.push(uploadedFile);

        // Génération du thumbnail pour prévisualisation
        await this.generateThumbnail(optimizedFile, data.path);
      }

      return uploadedFiles;

    } catch (error) {
      // Nettoyage des fichiers partiellement uploadés
      await this.cleanupFailedUploads(uploadedFiles);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload';
      throw new Error(`Échec de l\'upload des photos: ${errorMessage}`);
    }
  }

  /**
   * OPTIMISATION DES IMAGES
   * Redimensionne et compresse les images pour optimiser l'espace et la performance
   */
  private async optimizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calcul des dimensions optimales (max 1920px de largeur)
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Redimensionnement sur canvas
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);

            // Conversion en blob avec compression
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const optimizedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                  resolve(optimizedFile);
                } else {
                  reject(new Error('Échec de la compression d\'image'));
                }
              },
              'image/jpeg',
              UPLOAD_CONFIG.compressionQuality
            );
          } else {
            reject(new Error('Impossible de créer le contexte canvas'));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image pour optimisation'));
      };

      // Chargement de l'image
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * GÉNÉRATION DE THUMBNAILS
   * Crée des miniatures pour prévisualisation rapide
   */
  private async generateThumbnail(file: File, originalPath: string): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const size = UPLOAD_CONFIG.thumbnailSize;
          canvas.width = size;
          canvas.height = size;

          if (ctx) {
            // Calcul pour centrer l'image dans le carré
            const scale = Math.max(size / img.width, size / img.height);
            const x = (size - img.width * scale) / 2;
            const y = (size - img.height * scale) / 2;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            canvas.toBlob(async (blob) => {
              if (blob) {
                const thumbnailPath = originalPath.replace(/(\.[^.]+)$/, '_thumb$1');
                
                await supabase.storage
                  .from('claim-photos')
                  .upload(thumbnailPath, blob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: 'image/jpeg'
                  });
              }
              resolve();
            }, 'image/jpeg', 0.7);
          } else {
            resolve();
          }
        };

        img.onerror = () => resolve(); // Échec silencieux pour les thumbnails
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.warn('Échec de génération de thumbnail:', error);
      // Les thumbnails sont optionnels, on continue sans erreur
    }
  }

  /**
   * NETTOYAGE DES UPLOADS ÉCHOUÉS
   * Supprime les fichiers partiellement uploadés en cas d'erreur
   */
  private async cleanupFailedUploads(uploadedFiles: File[]): Promise<void> {
    for (const file of uploadedFiles) {
      try {
        const metadata = (file as any).supabaseMetadata;
        if (metadata?.path) {
          await supabase.storage
            .from('claim-photos')
            .remove([metadata.path]);
        }
      } catch (error) {
        console.warn('Échec du nettoyage du fichier:', error);
      }
    }
  }

  /**
   * SUPPRESSION DE PHOTOS
   * Supprime les photos du storage Supabase
   */
  async deletePhotos(files: File[]): Promise<void> {
    const pathsToDelete: string[] = [];

    for (const file of files) {
      const metadata = (file as any).supabaseMetadata;
      if (metadata?.path) {
        pathsToDelete.push(metadata.path);
        // Ajouter aussi le thumbnail s'il existe
        const thumbnailPath = metadata.path.replace(/(\.[^.]+)$/, '_thumb$1');
        pathsToDelete.push(thumbnailPath);
      }
    }

    if (pathsToDelete.length > 0) {
      const { error } = await supabase.storage
        .from('claim-photos')
        .remove(pathsToDelete);

      if (error) {
        console.error('Erreur suppression photos:', error);
        throw new Error('Échec de la suppression des photos');
      }
    }
  }

  /**
   * UTILITAIRES PRIVÉS
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'jpg';
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * RÉCUPÉRATION DES MÉTADONNÉES
   * Extrait les métadonnées Supabase d'un fichier uploadé
   */
  getFileMetadata(file: File): UploadedFileMetadata | null {
    return (file as any).supabaseMetadata || null;
  }

  /**
   * VÉRIFICATION DE L'ÉTAT D'UPLOAD
   * Vérifie si un fichier a été correctement uploadé vers Supabase
   */
  isFileUploaded(file: File): boolean {
    const metadata = this.getFileMetadata(file);
    return metadata !== null && !!metadata.publicUrl;
  }
}

// Export de l'instance unique du service
export const photoUploadService = new PhotoUploadService();