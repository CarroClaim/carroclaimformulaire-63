import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';

interface PhotoForZip {
  id: string;
  photo_type: string;
  public_url: string;
  file_name: string;
}

export class ZipDownloadService {
  private async downloadFile(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    return await response.arrayBuffer();
  }

  private getPhotoTypePrefix(photoType: string): string {
    const typeMap: Record<string, string> = {
      'registration': 'carte_grise',
      'odometer': 'compteur_km',
      'damage': 'degats',
      'car_front': 'vehicule_avant',
      'car_rear': 'vehicule_arriere',
      'car_left': 'vehicule_gauche',
      'car_right': 'vehicule_droite',
    };
    return typeMap[photoType] || photoType;
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || 'jpg';
  }

  async createAndDownloadZip(
    photos: PhotoForZip[],
    requestId: string,
    clientName: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (photos.length === 0) {
      throw new Error('Aucune photo à télécharger');
    }

    const zip = new JSZip();
    const folder = zip.folder(`Demande_${clientName}_${requestId.slice(0, 8)}`);

    if (!folder) {
      throw new Error('Erreur lors de la création du dossier ZIP');
    }

    // Group photos by type to number them
    const photosByType: Record<string, PhotoForZip[]> = {};
    photos.forEach(photo => {
      const type = photo.photo_type;
      if (!photosByType[type]) {
        photosByType[type] = [];
      }
      photosByType[type].push(photo);
    });

    let downloadedCount = 0;
    const totalPhotos = photos.length;

    // Download and add photos to ZIP
    for (const [photoType, typePhotos] of Object.entries(photosByType)) {
      for (let i = 0; i < typePhotos.length; i++) {
        const photo = typePhotos[i];
        
        try {
          const arrayBuffer = await this.downloadFile(photo.public_url);
          const prefix = this.getPhotoTypePrefix(photoType);
          const extension = this.getFileExtension(photo.file_name);
          const fileName = typePhotos.length === 1 
            ? `${prefix}.${extension}`
            : `${prefix}_${i + 1}.${extension}`;
          
          folder.file(fileName, arrayBuffer);
          
          downloadedCount++;
          if (onProgress) {
            onProgress((downloadedCount / totalPhotos) * 100);
          }
        } catch (error) {
          console.error(`Failed to download photo ${photo.file_name}:`, error);
          // Continue with other photos even if one fails
        }
      }
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Create download link
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Demande_${clientName}_${requestId.slice(0, 8)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const zipDownloadService = new ZipDownloadService();