import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FormData } from '@/types/form';

interface SubmissionData extends FormData {
  damageScreenshot?: string;
}

export const useClaimSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitClaim = async (formData: SubmissionData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Create the request
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          request_type: formData.requestType as 'quote' | 'appointment',
          first_name: formData.contact.firstName,
          last_name: formData.contact.lastName,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          city: formData.contact.city,
          postal_code: formData.contact.postalCode,
          description: formData.description || null,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
          damage_screenshot: formData.damageScreenshot || null,
          status: 'pending'
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create damage parts records
      if (formData.selectedDamages.length > 0) {
        const damageRecords = formData.selectedDamages.map(damageName => ({
          request_id: request.id,
          damage_part_id: damageName, // Using damage name as ID for now
        }));

        const { error: damageError } = await supabase
          .from('request_damages')
          .insert(damageRecords);

        if (damageError) {
          console.error('Error inserting damage records:', damageError);
        }
      }

      // Upload photos to storage and create photo records
      const photoCategories = [
        { key: 'registration', type: 'registration' },
        { key: 'mileage', type: 'mileage' },
        { key: 'vehicleAngles', type: 'vehicle_angles' },
        { key: 'damagePhotos', type: 'damage_photos' }
      ] as const;

      for (const category of photoCategories) {
        const photos = formData.photos[category.key];
        
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const fileName = `${request.id}/${category.type}_${i + 1}_${Date.now()}.${photo.name.split('.').pop()}`;
          
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('claim-photos')
            .upload(fileName, photo);

          if (uploadError) {
            console.error('Error uploading photo:', uploadError);
            continue;
          }

          // Create photo record
          const { error: photoError } = await supabase
            .from('photos')
            .insert({
              request_id: request.id,
              file_name: photo.name,
              file_path: fileName,
              file_size: photo.size,
              mime_type: photo.type,
              photo_type: category.type
            });

          if (photoError) {
            console.error('Error creating photo record:', photoError);
          }
        }
      }

      toast.success('Demande envoyée avec succès !');
      return request;
      
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la demande');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitClaim,
    isSubmitting
  };
};