export default {
  // Navigation et interface générale
  common: {
    title: 'Expert Auto',
    subtitle: 'Demande d\'expertise automobile',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    continue: 'Continuer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    download: 'Télécharger',
    print: 'Imprimer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Attention',
    info: 'Information',
    select: 'Sélectionner',
    required: 'Requis',
    optional: 'Optionnel',
    yes: 'Oui',
    no: 'Non',
  },

  // Formulaire principal
  form: {
    title: 'Demande d\'expertise automobile',
    subtitle: 'Remplissez ce formulaire pour obtenir une expertise de votre véhicule',
    
    steps: {
      preparation: {
        title: 'Préparation',
        heading: 'Préparation de votre demande',
        subtitle: 'Assurez-vous d\'avoir ces éléments :',
        timeEstimate: 'Temps estimé : 5-10 minutes',
        documents: {
          title: 'Documents requis',
          items: [
            'Photo de la carte grise',
            'Photo du compteur kilométrique',
            '4 photos des angles du véhicule',
            'Photos des dommages'
          ]
        }
      },

      type: {
        title: 'Type de demande',
        heading: 'Type de demande',
        subtitle: 'Choisissez le service souhaité :',
        quote: {
          title: 'Recevoir un devis',
          description: 'Obtenez une estimation basée sur vos photos',
          features: [
            'Évaluation précise par nos experts',
            'Devis détaillé sous 48h',
            'Service gratuit et sans engagement'
          ]
        },
        appointment: {
          title: 'Transmettre photos pour réparation',
          description: 'Planifiez une intervention directe',
          features: [
            'Préparation via vos photos',
            'Rendez-vous selon vos disponibilités',
            'Expertise complète sur place'
          ]
        },
        preferredDate: 'Date préférée',
        preferredTime: 'Heure préférée',
        selectTime: 'Sélectionnez une heure'
      },

      damages: {
        title: 'Dommages',
        heading: 'Dommages du véhicule',
        subtitle: 'Cliquez sur les zones endommagées :',
        description: 'Description des dommages (optionnel)',
        placeholder: 'Décrivez les circonstances de l\'incident et les dommages observés...'
      },

      photos: {
        documents: {
          title: 'Documents',
          heading: 'Documents officiels',
          subtitle: 'Ajoutez les photos de vos documents :',
          registration: {
            label: 'CARTE GRISE',
            description: 'Document d\'immatriculation'
          },
          mileage: {
            label: 'COMPTEUR OFFICIEL',
            description: 'Kilométrage du véhicule'
          }
        },
        vehicle: {
          title: 'Photos véhicule',
          heading: 'Photos du véhicule',
          subtitle: 'Prenez les photos de votre véhicule :',
          angles: {
            label: 'ANGLES DU VÉHICULE',
            description: '4 photos d\'angles obligatoires'
          },
          damages: {
            label: 'PHOTOS DES DOMMAGES',
            description: 'Zones sélectionnées précédemment'
          }
        }
      },

      contact: {
        title: 'Contact',
        heading: 'Vos coordonnées',
        subtitle: 'Informations nécessaires pour vous contacter :',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        city: 'Ville',
        postalCode: 'Code postal',
        placeholders: {
          firstName: 'Votre prénom',
          lastName: 'Votre nom',
          email: 'votre@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Rue et numéro',
          city: 'Nom de la ville',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Validation',
        heading: 'Récapitulatif de votre demande',
        subtitle: 'Vérifiez vos informations avant envoi',
        submit: 'Envoyer ma demande',
        submitting: 'Envoi en cours...',
        exportPdf: 'Exporter en PDF'
      }
    },

    validation: {
      required: 'Ce champ est requis',
      email: 'Adresse email invalide',
      phone: 'Numéro de téléphone invalide',
      minLength: 'Minimum {{min}} caractères',
      maxLength: 'Maximum {{max}} caractères'
    },

    messages: {
      success: {
        title: '✅ Demande envoyée avec succès !',
        description: 'Nous vous contacterons dans les plus brefs délais.'
      },
      error: {
        title: '❌ Erreur de soumission',
        description: 'Une erreur s\'est produite. Veuillez réessayer.'
      },
      pdfSuccess: {
        title: '✅ Rapport PDF généré !',
        description: 'Le rapport a été téléchargé avec succès.'
      },
      pdfError: {
        title: '❌ Erreur',
        description: 'Impossible de générer le rapport PDF.'
      }
    }
  },

  // Upload de photos
  photos: {
    upload: 'Cliquer pour uploader',
    dragDrop: 'Glissez-déposez vos fichiers ici',
    maxFiles: 'Maximum {{max}} fichier(s)',
    supportedFormats: 'Formats supportés : JPG, PNG, HEIC',
    maxSize: 'Taille max : {{size}}MB',
    uploading: 'Upload en cours...',
    remove: 'Supprimer',
    
    examples: {
      title: 'Exemples',
      vehicleAngles: 'Angles de prise de vue',
      documents: 'Documents lisibles',
      damages: 'Photos de dommages',
      uploadPhotos: 'Télécharger photos'
    },

    guides: {
      frontLeft: 'Photo de l\'avant gauche',
      rearLeft: 'Photo de l\'arrière gauche',
      rearRight: 'Photo de l\'arrière droit',
      frontRight: 'Photo de l\'avant droite',
      frontLeftView: 'Vue avant-gauche',
      rearLeftView: 'Vue arrière-gauche',
      rearRightView: 'Vue arrière-droite',
      frontRightView: 'Vue avant-droite',
      closeUp: 'Photo rapprochée',
      wide: 'Photo éloignée'
    },

    tips: {
      title: 'Conseils :',
      items: {
        readable: 'Documents lisibles',
        noReflection: 'Pas de reflets',
        clearKilometers: 'Kilométrage lisible',
        clearDashboard: 'Photo nette du tableau de bord',
        goodLighting: 'Photos nettes et bien éclairées',
        multipleAngles: 'Différents angles et distances'
      }
    }
  },

  // Administration
  admin: {
    title: 'Portail d\'Administration',
    logout: 'Déconnexion',
    
    sidebar: {
      requests: 'Demandes',
      statistics: 'Statistiques'
    },

    requests: {
      title: 'Gestion des demandes',
      subtitle: 'Consultez et gérez toutes les demandes d\'expertise',
      search: 'Rechercher par nom, email...',
      filters: {
        all: 'Toutes',
        pending: 'En attente',
        inProgress: 'En cours',
        completed: 'Terminées',
        quote: 'Devis',
        appointment: 'Rendez-vous'
      },
      columns: {
        client: 'Client',
        type: 'Type',
        status: 'Statut',
        date: 'Date',
        actions: 'Actions'
      },
      noRequests: 'Aucune demande trouvée',
      selectRequest: 'Sélectionnez une demande'
    },

    status: {
      pending: 'En attente',
      inProgress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée'
    },

    actions: {
      view: 'Voir',
      edit: 'Modifier',
      complete: 'Terminer',
      cancel: 'Annuler',
      restore: 'Restaurer',
      markInProgress: 'Marquer en cours',
      downloadZip: 'ZIP'
    }
  },

  // Détails de demande
  requestDetails: {
    clientInfo: 'Informations complètes du client',
    clientInfoDescription: 'Toutes les informations de contact et détails de la demande',
    contact: 'Contact',
    address: 'Adresse',
    request: 'Demande',
    detailedDescription: 'Description détaillée de la demande',
    additionalInfo: 'Informations complémentaires fournies par le client',
    createdOn: 'Créé le',
    appointment: 'RDV',
    
    damages: {
      reported: 'Dommages signalés ({{count}})',
      none: 'Aucun dommage signalé',
      damagedAreas: 'Zones endommagées ({{count}} zone{{plural}})',
      noDamageVisible: 'Véhicule sans dommage visible',
      details: 'Détail des dommages :'
    },

    photos: {
      transmitted: 'Photos transmises par le client ({{count}})',
      clickToEnlarge: 'Cliquez sur une photo pour l\'agrandir et naviguer dans la galerie',
      files: '{{count}} fichier{{plural}}',
      noPhotos: 'Aucune photo n\'a été transmise avec cette demande'
    }
  },

  // Types de photos
  photoTypes: {
    registration: 'carte grise',
    mileage: 'compteur',
    vehicleAngles: 'angles véhicule',
    damages: 'dommages'
  },

  // Statistiques
  statistics: {
    title: 'Statistiques',
    subtitle: 'Aperçu des performances',
    totalRequests: 'Total des demandes',
    pendingRequests: 'En attente',
    completedRequests: 'Terminées',
    averageProcessingTime: 'Temps moyen de traitement',
    days: 'jours',
    requestsOverTime: 'Évolution des demandes',
    requestsByType: 'Répartition par type',
    requestsByStatus: 'Répartition par statut'
  }
};