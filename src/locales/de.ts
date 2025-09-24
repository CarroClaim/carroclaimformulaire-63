export default {
  // Navigation und allgemeine Benutzeroberfläche
  common: {
    title: 'Expert Auto',
    subtitle: 'Professionelle Kfz-Gutachten',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    continue: 'Fortfahren',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    download: 'Herunterladen',
    print: 'Drucken',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
    warning: 'Warnung',
    info: 'Information',
    select: 'Auswählen',
    required: 'Erforderlich',
    optional: 'Optional',
    yes: 'Ja',
    no: 'Nein',
  },

  // Hauptformular
  form: {
    title: 'Antrag für Kfz-Gutachten',
    subtitle: 'Füllen Sie dieses Formular aus, um ein Gutachten für Ihr Fahrzeug zu erhalten',
    
    steps: {
      preparation: {
        title: 'Vorbereitung',
        heading: 'Vorbereitung Ihres Antrags',
        subtitle: 'Stellen Sie sicher, dass Sie diese Elemente haben:',
        timeEstimate: 'Geschätzte Zeit: 5-10 Minuten',
        documents: {
          title: 'Erforderliche Dokumente',
          items: [
            'Foto des Fahrzeugscheins',
            'Foto des Kilometerzählers',
            '4 Fotos der Fahrzeugwinkel',
            'Fotos der Schäden'
          ]
        }
      },

      type: {
        title: 'Antragsart',
        heading: 'Art des Antrags',
        subtitle: 'Wählen Sie den gewünschten Service:',
        quote: {
          title: 'Kostenvoranschlag erhalten',
          description: 'Erhalten Sie eine Schätzung basierend auf Ihren Fotos',
          features: [
            'Präzise Bewertung durch unsere Experten',
            'Detaillierter Kostenvoranschlag innerhalb von 48h',
            'Kostenloser und unverbindlicher Service'
          ]
        },
        appointment: {
          title: 'Fotos für Reparatur übermitteln',
          description: 'Planen Sie eine direkte Intervention',
          features: [
            'Vorbereitung über Ihre Fotos',
            'Termin nach Ihrer Verfügbarkeit',
            'Vollständiges Gutachten vor Ort'
          ]
        },
        preferredDate: 'Bevorzugtes Datum',
        preferredTime: 'Bevorzugte Zeit',
        selectTime: 'Zeit auswählen'
      },

      damages: {
        title: 'Schäden',
        heading: 'Fahrzeugschäden',
        subtitle: 'Klicken Sie auf die beschädigten Bereiche:',
        description: 'Beschreibung der Schäden (optional)',
        placeholder: 'Beschreiben Sie die Umstände des Vorfalls und die beobachteten Schäden...'
      },

      photos: {
        documents: {
          title: 'Dokumente',
          heading: 'Offizielle Dokumente',
          subtitle: 'Fügen Sie Fotos Ihrer Dokumente hinzu:',
          registration: {
            label: 'FAHRZEUGSCHEIN',
            description: 'Zulassungsdokument'
          },
          mileage: {
            label: 'OFFIZIELLER ZÄHLER',
            description: 'Kilometerstand des Fahrzeugs'
          }
        },
        vehicle: {
          title: 'Fahrzeugfotos',
          heading: 'Fotos des Fahrzeugs',
          subtitle: 'Machen Sie Fotos von Ihrem Fahrzeug:',
          angles: {
            label: 'FAHRZEUGWINKEL',
            description: '4 obligatorische Winkelfotos'
          },
          damages: {
            label: 'SCHADENFOTOS',
            description: 'Zuvor ausgewählte Bereiche'
          }
        }
      },

      contact: {
        title: 'Kontakt',
        heading: 'Ihre Kontaktdaten',
        subtitle: 'Erforderliche Informationen für die Kontaktaufnahme:',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail',
        phone: 'Telefon',
        address: 'Adresse',
        city: 'Stadt',
        postalCode: 'Postleitzahl',
        placeholders: {
          firstName: 'Ihr Vorname',
          lastName: 'Ihr Nachname',
          email: 'ihre@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Straße und Nummer',
          city: 'Stadtname',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Überprüfung',
        heading: 'Zusammenfassung Ihres Antrags',
        subtitle: 'Überprüfen Sie Ihre Informationen vor dem Senden',
        submit: 'Meinen Antrag senden',
        submitting: 'Wird gesendet...',
        exportPdf: 'Als PDF exportieren'
      }
    },

    validation: {
      required: 'Dieses Feld ist erforderlich',
      email: 'Ungültige E-Mail-Adresse',
      phone: 'Ungültige Telefonnummer',
      minLength: 'Mindestens {{min}} Zeichen',
      maxLength: 'Maximal {{max}} Zeichen'
    },

    messages: {
      success: {
        title: '✅ Antrag erfolgreich gesendet!',
        description: 'Wir werden Sie in Kürze kontaktieren.'
      },
      error: {
        title: '❌ Übertragungsfehler',
        description: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
      },
      pdfSuccess: {
        title: '✅ PDF-Bericht erstellt!',
        description: 'Der Bericht wurde erfolgreich heruntergeladen.'
      },
      pdfError: {
        title: '❌ Fehler',
        description: 'PDF-Bericht konnte nicht erstellt werden.'
      }
    }
  },

  // Foto-Upload
  photos: {
    upload: 'Zum Hochladen klicken',
    dragDrop: 'Dateien hier hineinziehen und ablegen',
    maxFiles: 'Maximal {{max}} Datei(en)',
    supportedFormats: 'Unterstützte Formate: JPG, PNG, HEIC',
    maxSize: 'Max. Größe: {{size}}MB',
    uploading: 'Upload läuft...',
    remove: 'Entfernen',
    
    examples: {
      title: 'Beispiele',
      vehicleAngles: 'Aufnahmewinkel',
      documents: 'Lesbare Dokumente',
      damages: 'Schadenfotos',
      uploadPhotos: 'Fotos hochladen'
    },

    guides: {
      frontLeft: 'Foto von vorne links',
      rearLeft: 'Foto von hinten links',
      rearRight: 'Foto von hinten rechts',
      frontRight: 'Foto von vorne rechts',
      frontLeftView: 'Ansicht vorne-links',
      rearLeftView: 'Ansicht hinten-links',
      rearRightView: 'Ansicht hinten-rechts',
      frontRightView: 'Ansicht vorne-rechts',
      closeUp: 'Nahaufnahme',
      wide: 'Weitwinkelaufnahme'
    },

    tips: {
      title: 'Tipps:',
      items: {
        readable: 'Lesbare Dokumente',
        noReflection: 'Keine Reflexionen',
        clearKilometers: 'Lesbarer Kilometerstand',
        clearDashboard: 'Scharfes Foto des Armaturenbretts',
        goodLighting: 'Scharfe und gut beleuchtete Fotos',
        multipleAngles: 'Verschiedene Winkel und Entfernungen'
      }
    }
  },

  // Verwaltung
  admin: {
    title: 'Verwaltungsportal',
    logout: 'Abmelden',
    
    sidebar: {
      requests: 'Anträge',
      statistics: 'Statistiken'
    },

    requests: {
      title: 'Antragsverwaltung',
      subtitle: 'Alle Gutachtenanträge einsehen und verwalten',
      search: 'Nach Name, E-Mail suchen...',
      filters: {
        all: 'Alle',
        pending: 'Ausstehend',
        inProgress: 'In Bearbeitung',
        completed: 'Abgeschlossen',
        quote: 'Kostenvoranschlag',
        appointment: 'Termin'
      },
      columns: {
        client: 'Kunde',
        type: 'Typ',
        status: 'Status',
        date: 'Datum',
        actions: 'Aktionen'
      },
      noRequests: 'Keine Anträge gefunden',
      selectRequest: 'Antrag auswählen'
    },

    status: {
      pending: 'Ausstehend',
      inProgress: 'In Bearbeitung',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert'
    },

    actions: {
      view: 'Anzeigen',
      edit: 'Bearbeiten',
      complete: 'Abschließen',
      cancel: 'Stornieren',
      restore: 'Wiederherstellen',
      markInProgress: 'Als in Bearbeitung markieren',
      downloadZip: 'ZIP'
    }
  },

  // Antragsdetails
  requestDetails: {
    clientInfo: 'Vollständige Kundeninformationen',
    clientInfoDescription: 'Alle Kontaktinformationen und Antragsdetails',
    contact: 'Kontakt',
    address: 'Adresse',
    request: 'Antrag',
    detailedDescription: 'Detaillierte Beschreibung des Antrags',
    additionalInfo: 'Zusätzliche Informationen vom Kunden',
    createdOn: 'Erstellt am',
    appointment: 'Termin',
    
    damages: {
      reported: 'Gemeldete Schäden ({{count}})',
      none: 'Keine Schäden gemeldet',
      damagedAreas: 'Beschädigte Bereiche ({{count}} Bereich{{plural}})',
      noDamageVisible: 'Fahrzeug ohne sichtbare Schäden',
      details: 'Schadendetails:'
    },

    photos: {
      transmitted: 'Vom Kunden übermittelte Fotos ({{count}})',
      clickToEnlarge: 'Klicken Sie auf ein Foto, um es zu vergrößern und in der Galerie zu navigieren',
      files: '{{count}} Datei{{plural}}',
      noPhotos: 'Keine Fotos wurden mit diesem Antrag übermittelt'
    }
  },

  // Fototypen
  photoTypes: {
    registration: 'Fahrzeugschein',
    mileage: 'Zähler',
    vehicleAngles: 'Fahrzeugwinkel',
    damages: 'Schäden'
  },

  // Statistiken
  statistics: {
    title: 'Statistiken',
    subtitle: 'Leistungsübersicht',
    totalRequests: 'Gesamte Anträge',
    pendingRequests: 'Ausstehend',
    completedRequests: 'Abgeschlossen',
    averageProcessingTime: 'Durchschnittliche Bearbeitungszeit',
    days: 'Tage',
    requestsOverTime: 'Antragsentwicklung',
    requestsByType: 'Verteilung nach Typ',
    requestsByStatus: 'Verteilung nach Status'
  }
};