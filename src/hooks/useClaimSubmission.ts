import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/form';
import { useToast } from '@/hooks/use-toast';

export const useClaimSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitClaim = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentification requise",
          description: "Vous devez être connecté pour soumettre une demande.",
          variant: "destructive"
        });
        return { success: false, error: 'Authentication required' };
      }

      // Create the request record
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          request_type: formData.requestType === 'quote' ? 'quote' : 'appointment',
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
        throw requestError;
      }

      // Insert selected damages
      if (formData.selectedDamages.length > 0) {
        // Get damage part IDs from their names
        const { data: damageParts } = await supabase
          .from('damage_parts')
          .select('id, name')
          .in('name', formData.selectedDamages);

        if (damageParts && damageParts.length > 0) {
          const damageRecords = damageParts.map(part => ({
            request_id: request.id,
            damage_part_id: part.id
          }));

          const { error: damagesError } = await supabase
            .from('request_damages')
            .insert(damageRecords);

          if (damagesError) {
            console.error('Error inserting damages:', damagesError);
          }
        }
      }

      // Upload photos
      const photoUploads = [];
      
      // Registration photos
      for (const photo of formData.photos.registration) {
        photoUploads.push(uploadPhoto(photo, request.id, 'registration'));
      }
      
      // Mileage photos
      for (const photo of formData.photos.mileage) {
        photoUploads.push(uploadPhoto(photo, request.id, 'mileage'));
      }
      
      // Vehicle angle photos
      for (const photo of formData.photos.vehicleAngles) {
        photoUploads.push(uploadPhoto(photo, request.id, 'vehicle_angles'));
      }
      
      // Damage photos
      for (const photo of formData.photos.damagePhotos) {
        photoUploads.push(uploadPhoto(photo, request.id, 'damage_photos'));
      }

      // Wait for all photo uploads
      await Promise.all(photoUploads);

      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous vous contacterons dans les plus brefs délais."
      });

      return { success: true, data: request };

    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: error.message || "Une erreur s'est produite lors de l'envoi de votre demande.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadPhoto = async (file: File, requestId: string, photoType: 'registration' | 'mileage' | 'vehicle_angles' | 'damage_photos') => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${requestId}/${photoType}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('claim-photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Insert photo record
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          request_id: requestId,
          photo_type: photoType,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        });

      if (insertError) {
        throw insertError;
      }

    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  return {
    submitClaim,
    isSubmitting
  };
};