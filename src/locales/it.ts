export default {
  // Navigazione e interfaccia generale
  common: {
    back: 'Indietro',
    next: 'Avanti',
    previous: 'Precedente',
    continue: 'Continua',
    save: 'Salva',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica',
    download: 'Scarica',
    print: 'Stampa',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
    warning: 'Attenzione',
    info: 'Informazione',
    select: 'Seleziona',
    required: 'Obbligatorio',
    optional: 'Opzionale',
    yes: 'Sì',
    no: 'No',
  },

  // Modulo principale
  form: {
    title: 'Richiesta di perizia automobilistica',
    subtitle: 'Compila questo modulo per ottenere una perizia del tuo veicolo',
    
    steps: {
      preparation: {
        title: 'Preparazione',
        heading: 'Preparazione della tua richiesta',
        subtitle: 'Assicurati di avere questi elementi:',
        timeEstimate: 'Tempo stimato: 5-10 minuti',
        documents: {
          title: 'Documenti richiesti',
          items: [
            'Foto del libretto di circolazione',
            'Foto del contachilometri',
            '4 foto degli angoli del veicolo',
            'Foto dei danni'
          ]
        }
      },

      type: {
        title: 'Tipo di richiesta',
        heading: 'Tipo di richiesta',
        subtitle: 'Scegli il servizio desiderato:',
        quote: {
          title: 'Ricevere un preventivo',
          description: 'Ottieni una stima basata sulle tue foto',
          features: [
            'Valutazione precisa dei nostri esperti',
            'Preventivo dettagliato entro 48h',
            'Servizio gratuito e senza impegno'
          ]
        },
        appointment: {
          title: 'Trasmettere foto per riparazione',
          description: 'Programma un intervento diretto',
          features: [
            'Preparazione tramite le tue foto',
            'Appuntamento secondo le tue disponibilità',
            'Perizia completa sul posto'
          ]
        },
        preferredDate: 'Data preferita',
        preferredTime: 'Ora preferita',
        selectTime: 'Seleziona un orario'
      },

      damages: {
        title: 'Danni',
        heading: 'Danni del veicolo',
        subtitle: 'Clicca sulle zone danneggiate:',
        description: 'Descrizione dei danni (opzionale)',
        placeholder: 'Descrivi le circostanze dell\'incidente e i danni osservati...'
      },

      photos: {
        documents: {
          title: 'Documenti',
          heading: 'Documenti ufficiali',
          subtitle: 'Aggiungi le foto dei tuoi documenti:',
          registration: {
            label: 'LIBRETTO',
            description: 'Documento di immatricolazione'
          },
          mileage: {
            label: 'CONTACHILOMETRI',
            description: 'Chilometraggio del veicolo'
          }
        },
        vehicle: {
          title: 'Foto veicolo',
          heading: 'Foto del veicolo',
          subtitle: 'Scatta le foto del tuo veicolo:',
          angles: {
            label: 'ANGOLI DEL VEICOLO',
            description: '4 foto d\'angolo obbligatorie'
          },
          damages: {
            label: 'FOTO DEI DANNI',
            description: 'Zone selezionate precedentemente'
          }
        }
      },

      contact: {
        title: 'Contatto',
        heading: 'I tuoi dati',
        subtitle: 'Informazioni necessarie per contattarti:',
        firstName: 'Nome',
        lastName: 'Cognome',
        email: 'Email',
        phone: 'Telefono',
        address: 'Indirizzo',
        city: 'Città',
        postalCode: 'CAP',
        placeholders: {
          firstName: 'Il tuo nome',
          lastName: 'Il tuo cognome',
          email: 'tua@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Via e numero',
          city: 'Nome della città',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Validazione',
        heading: 'Riepilogo della tua richiesta',
        subtitle: 'Verifica le tue informazioni prima dell\'invio',
        submit: 'Invia la mia richiesta',
        submitting: 'Invio in corso...',
        exportPdf: 'Esporta in PDF'
      }
    },

    validation: {
      required: 'Questo campo è obbligatorio',
      email: 'Indirizzo email non valido',
      phone: 'Numero di telefono non valido',
      minLength: 'Minimo {{min}} caratteri',
      maxLength: 'Massimo {{max}} caratteri'
    },

    messages: {
      success: {
        title: '✅ Richiesta inviata con successo!',
        description: 'Ti contatteremo al più presto.'
      },
      error: {
        title: '❌ Errore di invio',
        description: 'Si è verificato un errore. Riprova.'
      },
      pdfSuccess: {
        title: '✅ Report PDF generato!',
        description: 'Il report è stato scaricato con successo.'
      },
      pdfError: {
        title: '❌ Errore',
        description: 'Impossibile generare il report PDF.'
      }
    }
  },

  // Upload foto
  photos: {
    upload: 'Clicca per caricare',
    dragDrop: 'Trascina i tuoi file qui',
    maxFiles: 'Massimo {{max}} file',
    supportedFormats: 'Formati supportati: JPG, PNG, HEIC',
    maxSize: 'Dimensione max: {{size}}MB',
    uploading: 'Caricamento...',
    remove: 'Rimuovi',
    
    examples: {
      title: 'Esempi',
      vehicleAngles: 'Angoli di ripresa',
      documents: 'Documenti leggibili',
      damages: 'Foto dei danni',
      uploadPhotos: 'Carica foto'
    },

    guides: {
      frontLeft: 'Foto anteriore sinistra',
      rearLeft: 'Foto posteriore sinistra',
      rearRight: 'Foto posteriore destra',
      frontRight: 'Foto anteriore destra',
      frontLeftView: 'Vista anteriore-sinistra',
      rearLeftView: 'Vista posteriore-sinistra',
      rearRightView: 'Vista posteriore-destra',
      frontRightView: 'Vista anteriore-destra',
      closeUp: 'Foto ravvicinata',
      wide: 'Foto distante'
    },

    tips: {
      title: 'Consigli:',
      items: {
        readable: 'Documenti leggibili',
        noReflection: 'Nessun riflesso',
        clearKilometers: 'Chilometraggio leggibile',
        clearDashboard: 'Foto nitida del cruscotto',
        goodLighting: 'Foto nitide e ben illuminate',
        multipleAngles: 'Diversi angoli e distanze'
      }
    }
  },

  // Amministrazione
  admin: {
    title: 'Portale di Amministrazione',
    logout: 'Disconnetti',
    
    sidebar: {
      requests: 'Richieste',
      statistics: 'Statistiche'
    },

    requests: {
      title: 'Gestione delle richieste',
      subtitle: 'Consulta e gestisci tutte le richieste di perizia',
      search: 'Cerca per nome, email...',
      filters: {
        all: 'Tutte',
        pending: 'In attesa',
        inProgress: 'In corso',
        completed: 'Completate',
        quote: 'Preventivo',
        appointment: 'Appuntamento'
      },
      columns: {
        client: 'Cliente',
        type: 'Tipo',
        status: 'Stato',
        date: 'Data',
        actions: 'Azioni'
      },
      noRequests: 'Nessuna richiesta trovata',
      selectRequest: 'Seleziona una richiesta'
    },

    status: {
      pending: 'In attesa',
      inProgress: 'In corso',
      completed: 'Completata',
      cancelled: 'Annullata'
    },

    actions: {
      view: 'Visualizza',
      edit: 'Modifica',
      complete: 'Completa',
      cancel: 'Annulla',
      restore: 'Ripristina',
      markInProgress: 'Segna in corso',
      downloadZip: 'ZIP'
    }
  },

  // Dettagli richiesta
  requestDetails: {
    clientInfo: 'Informazioni complete del cliente',
    clientInfoDescription: 'Tutte le informazioni di contatto e dettagli della richiesta',
    contact: 'Contatto',
    address: 'Indirizzo',
    request: 'Richiesta',
    detailedDescription: 'Descrizione dettagliata della richiesta',
    additionalInfo: 'Informazioni aggiuntive fornite dal cliente',
    createdOn: 'Creato il',
    appointment: 'Appuntamento',
    
    damages: {
      reported: 'Danni segnalati ({{count}})',
      none: 'Nessun danno segnalato',
      damagedAreas: 'Zone danneggiate ({{count}} zona{{plural}})',
      noDamageVisible: 'Veicolo senza danni visibili',
      details: 'Dettaglio dei danni:'
    },

    photos: {
      transmitted: 'Foto trasmesse dal cliente ({{count}})',
      clickToEnlarge: 'Clicca su una foto per ingrandirla e navigare nella galleria',
      files: '{{count}} file{{plural}}',
      noPhotos: 'Nessuna foto è stata trasmessa con questa richiesta'
    }
  },

  // Tipi di foto
  photoTypes: {
    registration: 'libretto',
    mileage: 'contachilometri',
    vehicleAngles: 'angoli veicolo',
    damages: 'danni'
  },

  // Statistiche
  statistics: {
    title: 'Statistiche',
    subtitle: 'Panoramica delle prestazioni',
    totalRequests: 'Totale richieste',
    pendingRequests: 'In attesa',
    completedRequests: 'Completate',
    averageProcessingTime: 'Tempo medio di elaborazione',
    days: 'giorni',
    requestsOverTime: 'Evoluzione delle richieste',
    requestsByType: 'Ripartizione per tipo',
    requestsByStatus: 'Ripartizione per stato'
  }
};