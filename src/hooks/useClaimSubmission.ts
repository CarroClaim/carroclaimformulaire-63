import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/form';
import { toast } from 'sonner';

interface SubmissionResult {
  success: boolean;
  requestId?: string;
  error?: string;
}

export const useClaimSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitClaim = async (formData: FormData): Promise<SubmissionResult> => {
    setIsSubmitting(true);
    
    try {
      // 1. Create the main request
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          request_type: formData.requestType as 'quote' | 'appointment',
          first_name: formData.contact.firstName,
          last_name: formData.contact.lastName,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          city: formData.contact.city,
          postal_code: formData.contact.postalCode,
          description: formData.description,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
        })
        .select()
        .single();

      if (requestError) {
        console.error('Error creating request:', requestError);
        return { success: false, error: requestError.message };
      }

      const requestId = request.id;

      // 2. Get damage part IDs for selected damages
      if (formData.selectedDamages.length > 0) {
        const { data: damageParts, error: damagePartsError } = await supabase
          .from('damage_parts')
          .select('id, name')
          .in('name', formData.selectedDamages);

        if (damagePartsError) {
          console.error('Error fetching damage parts:', damagePartsError);
          return { success: false, error: damagePartsError.message };
        }

        // 3. Create request_damages relations
        const requestDamages = damageParts.map(part => ({
          request_id: requestId,
          damage_part_id: part.id
        }));

        const { error: requestDamagesError } = await supabase
          .from('request_damages')
          .insert(requestDamages);

        if (requestDamagesError) {
          console.error('Error creating request damages:', requestDamagesError);
          return { success: false, error: requestDamagesError.message };
        }
      }

      // 4. Upload photos if any
      await uploadPhotosForRequest(requestId, formData.photos);

      toast.success(
        formData.requestType === 'quote' 
          ? 'Demande de devis envoyée avec succès!'
          : 'Demande de rendez-vous envoyée avec succès!'
      );

      return { success: true, requestId };

    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadPhotosForRequest = async (requestId: string, photos: FormData['photos']) => {
    const photoTypes: (keyof typeof photos)[] = ['registration', 'mileage', 'vehicleAngles', 'damagePhotos'];
    
    for (const photoType of photoTypes) {
      const files = photos[photoType];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${requestId}/${photoType}_${Date.now()}_${i}_${file.name}`;
        
        try {
          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('claim-photos')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          // Save photo record in database
          const { error: photoRecordError } = await supabase
            .from('photos')
            .insert({
              request_id: requestId,
              photo_type: photoType === 'vehicleAngles' ? 'vehicle_angles' : 
                         photoType === 'damagePhotos' ? 'damage_photos' : 
                         photoType as 'registration' | 'mileage',
              file_name: file.name,
              file_path: uploadData.path,
              file_size: file.size,
              mime_type: file.type,
            });

          if (photoRecordError) {
            console.error('Error saving photo record:', photoRecordError);
          }
        } catch (error) {
          console.error('Error processing photo:', error);
        }
      }
    }
  };

  return {
    submitClaim,
    isSubmitting,
  };
};