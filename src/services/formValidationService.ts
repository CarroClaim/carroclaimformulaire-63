/**
 * SERVICE DE VALIDATION DU FORMULAIRE
 * 
 * Ce service centralise toute la logique de validation :
 * - Validation par étape avec règles spécifiques
 * - Validation complète du formulaire avant soumission
 * - Validation en temps réel des champs
 * - Règles métier personnalisées pour chaque type de données
 */

import { z } from 'zod';
import { FormData } from '@/types/form';

// SCHÉMAS DE VALIDATION ZOD

// Validation des informations de contact
const contactSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Format d\'email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide').regex(/^[0-9+\-\s()]+$/, 'Format de téléphone invalide'),
  address: z.string().min(5, 'Adresse trop courte'),
  city: z.string().min(2, 'Nom de ville invalide'),
  postalCode: z.string().min(4, 'Code postal invalide').max(10, 'Code postal invalide')
});

// Validation des photos par catégorie
const photosSchema = z.object({
  registration: z.array(z.any()).min(1, 'Photo de la carte grise requise'),
  mileage: z.array(z.any()).min(1, 'Photo du compteur kilométrique requise'),
  vehicleAngles: z.array(z.any()).min(4, 'Les 4 photos des angles du véhicule sont requises'),
  damagePhotosClose: z.array(z.any()).optional(),
  damagePhotosFar: z.array(z.any()).optional()
});

// Validation complète du formulaire
const completeFormSchema = z.object({
  requestType: z.enum(['quote', 'appointment'], { required_error: 'Type de demande requis' }),
  selectedDamages: z.array(z.string()).min(1, 'Au moins une zone endommagée doit être sélectionnée'),
  photos: photosSchema,
  contact: contactSchema,
  description: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional()
});

class FormValidationService {
  /**
   * VALIDATION PAR ÉTAPE
   * Valide les données spécifiques à chaque étape du formulaire
   */
  validateStep(stepIndex: number, formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Préparation - pas de validation requise
        break;

      case 1: // Type de demande
        if (!formData.requestType) {
          errors.requestType = 'Veuillez sélectionner un type de demande';
        }
        
        // Si rendez-vous sélectionné, valider la date
        if (formData.requestType === 'appointment' && !formData.preferredDate) {
          errors.preferredDate = 'Date préférée requise pour un rendez-vous';
        }
        break;

      case 2: // Sélection des dommages
        if (formData.selectedDamages.length === 0) {
          errors.selectedDamages = 'Sélectionnez au moins une zone endommagée';
        }
        break;

      case 3: // Photos documents
        if (formData.photos.registration.length === 0) {
          errors.registrationPhoto = 'Photo de la carte grise requise';
        }
        if (formData.photos.mileage.length === 0) {
          errors.mileagePhoto = 'Photo du compteur kilométrique requise';
        }
        break;

      case 4: // Photos véhicule
        if (formData.photos.vehicleAngles.length < 4) {
          errors.vehicleAngles = 'Les 4 photos des angles du véhicule sont requises';
        }
        // Photos de dommages optionnelles mais recommandées si des dommages sont sélectionnés
        if (formData.selectedDamages.length > 0 && 
            formData.photos.damagePhotosClose.length === 0 && 
            formData.photos.damagePhotosFar.length === 0) {
          errors.damagePhotos = 'Photos des dommages recommandées pour les zones sélectionnées';
        }
        break;

      case 5: // Contact
        try {
          contactSchema.parse(formData.contact);
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach(err => {
              if (err.path.length > 0) {
                errors[`contact.${err.path[0]}`] = err.message;
              }
            });
          }
        }
        break;

      case 6: // Validation finale - validation complète
        return this.validateCompleteForm(formData);
    }

    return errors;
  }

  /**
   * VÉRIFICATION DE POSSIBILITÉ DE PASSAGE À L'ÉTAPE SUIVANTE
   * Détermine si l'utilisateur peut passer à l'étape suivante
   */
  canProceedFromStep(stepIndex: number, formData: FormData): boolean {
    const errors = this.validateStep(stepIndex, formData);
    return Object.keys(errors).length === 0;
  }

  /**
   * VÉRIFICATION DE VALIDITÉ D'UNE ÉTAPE
   * Vérifie si une étape donnée est complétée et valide
   */
  isStepValid(stepIndex: number, formData: FormData): boolean {
    switch (stepIndex) {
      case 0: return true; // Préparation toujours valide
      case 1: return !!formData.requestType;
      case 2: return formData.selectedDamages.length > 0;
      case 3: return formData.photos.registration.length > 0 && formData.photos.mileage.length > 0;
      case 4: return formData.photos.vehicleAngles.length >= 4;
      case 5: 
        try {
          contactSchema.parse(formData.contact);
          return true;
        } catch {
          return false;
        }
      case 6: return this.isCompleteFormValid(formData);
      default: return false;
    }
  }

  /**
   * VALIDATION COMPLÈTE DU FORMULAIRE
   * Effectue une validation exhaustive avant soumission
   */
  validateCompleteForm(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};

    try {
      completeFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
    }

    // Validations métier supplémentaires
    this.performBusinessValidations(formData, errors);

    return errors;
  }

  /**
   * VÉRIFICATION DE VALIDITÉ COMPLÈTE DU FORMULAIRE
   * Vérifie rapidement si le formulaire complet est valide
   */
  isCompleteFormValid(formData: FormData): boolean {
    const errors = this.validateCompleteForm(formData);
    return Object.keys(errors).length === 0;
  }

  /**
   * VALIDATION EN TEMPS RÉEL D'UN CHAMP
   * Valide un champ spécifique pendant la saisie
   */
  validateField(fieldPath: string, value: any): string | null {
    try {
      switch (fieldPath) {
        case 'contact.email':
          z.string().email().parse(value);
          break;
        case 'contact.phone':
          z.string().min(10).regex(/^[0-9+\-\s()]+$/).parse(value);
          break;
        case 'contact.firstName':
        case 'contact.lastName':
          z.string().min(2).parse(value);
          break;
        case 'contact.postalCode':
          z.string().min(4).max(10).parse(value);
          break;
        default:
          return null;
      }
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Valeur invalide';
      }
      return 'Erreur de validation';
    }
  }

  /**
   * VALIDATIONS MÉTIER PERSONNALISÉES
   * Règles de validation spécifiques au domaine métier
   */
  private performBusinessValidations(formData: FormData, errors: Record<string, string>): void {
    // Validation de cohérence entre type de demande et date
    if (formData.requestType === 'appointment' && !formData.preferredDate) {
      errors.appointmentDate = 'Date requise pour les rendez-vous';
    }

    // Validation de la date (pas dans le passé)
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.preferredDate = 'La date ne peut pas être dans le passé';
      }
    }

    // Validation du nombre de photos selon les dommages
    if (formData.selectedDamages.length > 3 && 
        formData.photos.damagePhotosClose.length + formData.photos.damagePhotosFar.length < 2) {
      errors.damagePhotosCount = 'Photos de dommages insuffisantes pour le nombre de zones sélectionnées';
    }

    // Validation de la taille maximum de description
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'La description ne peut pas dépasser 1000 caractères';
    }
  }

  /**
   * OBTENTION DU POURCENTAGE DE COMPLETION
   * Calcule le pourcentage de completion du formulaire
   */
  getCompletionPercentage(formData: FormData): number {
    const totalSteps = 7;
    let completedSteps = 0;

    // Étape 0 : toujours complétée (préparation)
    completedSteps++;

    // Étape 1 : type de demande
    if (formData.requestType) completedSteps++;

    // Étape 2 : dommages
    if (formData.selectedDamages.length > 0) completedSteps++;

    // Étape 3 : photos documents
    if (formData.photos.registration.length > 0 && formData.photos.mileage.length > 0) {
      completedSteps++;
    }

    // Étape 4 : photos véhicule
    if (formData.photos.vehicleAngles.length >= 4) completedSteps++;

    // Étape 5 : contact
    if (this.isStepValid(5, formData)) completedSteps++;

    // Étape 6 : validation finale
    if (this.isCompleteFormValid(formData)) completedSteps++;

    return (completedSteps / totalSteps) * 100;
  }
}

// Export de l'instance unique du service
export const formValidationService = new FormValidationService();