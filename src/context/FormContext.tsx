/**
 * CONTEXTE DE GESTION D'ÉTAT DU FORMULAIRE MULTI-ÉTAPES
 * 
 * Ce contexte centralise toute la logique métier du formulaire :
 * - État global des données du formulaire
 * - Navigation entre étapes avec validation
 * - Gestion des photos et uploads
 * - Validation des données en temps réel
 * - Soumission finale avec gestion d'erreurs
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormData, Step } from '@/types/form';
import { formValidationService } from '@/services/formValidationService';
import { photoUploadService } from '@/services/photoUploadService';
import { formSubmissionService } from '@/services/formSubmissionService';

// Interface pour les actions du reducer
type FormAction = 
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: { field: keyof FormData; value: any } }
  | { type: 'UPDATE_PHOTOS'; payload: { category: keyof FormData['photos']; photos: File[] } }
  | { type: 'UPDATE_CONTACT'; payload: { field: keyof FormData['contact']; value: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VALIDATION_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_FORM' };

// État complet du formulaire
interface FormState {
  currentStep: number;
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
}

// Interface du contexte
interface FormContextType extends FormState {
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Mise à jour des données
  updateFormData: (field: keyof FormData, value: any) => void;
  updatePhotos: (category: keyof FormData['photos'], photos: File[]) => void;
  updateContact: (field: keyof FormData['contact'], value: string) => void;
  
  // Validation et soumission
  validateCurrentStep: () => boolean;
  canProceedToNextStep: () => boolean;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
  
  // Gestion des photos
  uploadPhotos: (category: keyof FormData['photos'], files: File[]) => Promise<void>;
  
  // Utilitaires
  getStepProgress: () => number;
  isStepValid: (stepIndex: number) => boolean;
}

// État initial du formulaire
const initialFormData: FormData = {
  requestType: '',
  selectedDamages: [],
  photos: {
    registration: [],
    mileage: [],
    vehicleAngles: [],
    damagePhotosClose: [],
    damagePhotosFar: []
  },
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  },
  description: '',
  preferredDate: '',
  preferredTime: ''
};

const initialState: FormState = {
  currentStep: 0,
  formData: initialFormData,
  isLoading: false,
  error: null,
  validationErrors: {},
  isSubmitting: false
};

// Reducer pour gérer les actions de l'état
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload, error: null };
    
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.field]: action.payload.value },
        validationErrors: { ...state.validationErrors, [action.payload.field]: '' }
      };
    
    case 'UPDATE_PHOTOS':
      return {
        ...state,
        formData: {
          ...state.formData,
          photos: { ...state.formData.photos, [action.payload.category]: action.payload.photos }
        }
      };
    
    case 'UPDATE_CONTACT':
      return {
        ...state,
        formData: {
          ...state.formData,
          contact: { ...state.formData.contact, [action.payload.field]: action.payload.value }
        },
        validationErrors: { ...state.validationErrors, [`contact.${action.payload.field}`]: '' }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    
    case 'RESET_FORM':
      return { ...initialState };
    
    default:
      return state;
  }
}

// Création du contexte
const FormContext = createContext<FormContextType | null>(null);

// Provider du contexte
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Définition des étapes du formulaire
  const steps: Step[] = [
    { id: 'preparation', title: 'Préparation', icon: () => null },
    { id: 'type', title: 'Type de demande', icon: () => null },
    { id: 'damages', title: 'Dommages', icon: () => null },
    { id: 'photos-docs', title: 'Documents', icon: () => null },
    { id: 'photos-vehicle', title: 'Photos véhicule', icon: () => null },
    { id: 'contact', title: 'Contact', icon: () => null },
    { id: 'review', title: 'Validation', icon: () => null }
  ];

  // NAVIGATION ENTRE ÉTAPES
  const nextStep = () => {
    if (canProceedToNextStep() && state.currentStep < steps.length - 1) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: step });
    }
  };

  // MISE À JOUR DES DONNÉES
  const updateFormData = (field: keyof FormData, value: any) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { field, value } });
  };

  const updatePhotos = (category: keyof FormData['photos'], photos: File[]) => {
    dispatch({ type: 'UPDATE_PHOTOS', payload: { category, photos } });
  };

  const updateContact = (field: keyof FormData['contact'], value: string) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: { field, value } });
  };

  // VALIDATION DES ÉTAPES
  const validateCurrentStep = (): boolean => {
    const errors = formValidationService.validateStep(state.currentStep, state.formData);
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const canProceedToNextStep = (): boolean => {
    return formValidationService.canProceedFromStep(state.currentStep, state.formData);
  };

  const isStepValid = (stepIndex: number): boolean => {
    return formValidationService.isStepValid(stepIndex, state.formData);
  };

  // GESTION DES PHOTOS AVEC UPLOAD SUPABASE
  const uploadPhotos = async (category: keyof FormData['photos'], files: File[]): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validation des fichiers
      const validationResult = photoUploadService.validateFiles(files);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      // Upload vers Supabase
      const uploadedFiles = await photoUploadService.uploadToSupabase(files, category);
      
      // Mise à jour du state avec les fichiers uploadés
      dispatch({ type: 'UPDATE_PHOTOS', payload: { category, photos: uploadedFiles } });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload des photos';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // SOUMISSION DU FORMULAIRE
  const submitForm = async (): Promise<boolean> => {
    try {
      // Validation complète du formulaire
      const validationErrors = formValidationService.validateCompleteForm(state.formData);
      if (Object.keys(validationErrors).length > 0) {
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: validationErrors });
        return false;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Soumission via le service dédié
      const success = await formSubmissionService.submitFormData(state.formData);
      
      if (success) {
        // Reset du formulaire en cas de succès
        dispatch({ type: 'RESET_FORM' });
        return true;
      } else {
        throw new Error('Erreur lors de la soumission du formulaire');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la soumission';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // RESET DU FORMULAIRE
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // UTILITAIRES
  const getStepProgress = (): number => {
    return ((state.currentStep + 1) / steps.length) * 100;
  };

  // Valeur du contexte
  const contextValue: FormContextType = {
    ...state,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    updatePhotos,
    updateContact,
    validateCurrentStep,
    canProceedToNextStep,
    submitForm,
    resetForm,
    uploadPhotos,
    getStepProgress,
    isStepValid
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};