export default {
  // Navigimi dhe ndërfaqja e përgjithshme
  common: {
    back: 'Prapa',
    next: 'Përpara',
    previous: 'E mëparshme',
    continue: 'Vazhdo',
    save: 'Ruaj',
    cancel: 'Anulo',
    delete: 'Fshi',
    edit: 'Redakto',
    download: 'Shkarko',
    print: 'Printo',
    loading: 'Duke ngarkuar...',
    error: 'Gabim',
    success: 'Sukses',
    warning: 'Paralajmërim',
    info: 'Informacion',
    select: 'Zgjidh',
    required: 'I detyrueshëm',
    optional: 'Opsional',
    yes: 'Po',
    no: 'Jo',
  },

  // Formulari kryesor
  form: {
    title: 'Kërkesë për ekspertizë automobilistike',
    subtitle: 'Plotësoni këtë formular për të marrë një ekspertizë të automjetit tuaj',
    
    steps: {
      preparation: {
        title: 'Përgatitja',
        heading: 'Përgatitja e kërkesës tuaj',
        subtitle: 'Sigurohuni që keni këto elemente:',
        timeEstimate: 'Koha e vlerësuar: 5-10 minuta',
        documents: {
          title: 'Dokumentet e kërkuara',
          items: [
            'Fotoja e librezës së makinës',
            'Fotoja e kilometrazhit',
            '4 foto të këndeve të automjetit',
            'Foto të dëmtimeve'
          ]
        }
      },

      type: {
        title: 'Lloji i kërkesës',
        heading: 'Lloji i kërkesës',
        subtitle: 'Zgjidhni shërbimin e dëshiruar:',
        quote: {
          title: 'Merrni një kuotë',
          description: 'Merrni një vlerësim bazuar në fotografitë tuaja',
          features: [
            'Vlerësim i saktë nga ekspertët tanë',
            'Kuotë e detajuar brenda 48 orësh',
            'Shërbim falas dhe pa angazhime'
          ]
        },
        appointment: {
          title: 'Dërgoni foto për riparim',
          description: 'Planifikoni një ndërhyrje të drejtpërdrejtë',
          features: [
            'Përgatitje përmes fotografive tuaja',
            'Takim sipas disponueshmërisë suaj',
            'Ekspertizë e plotë në vend'
          ]
        },
        preferredDate: 'Data e preferuar',
        preferredTime: 'Ora e preferuar',
        selectTime: 'Zgjidhni një orë'
      },

      damages: {
        title: 'Dëmtimet',
        heading: 'Dëmtimet e automjetit',
        subtitle: 'Klikoni në zonat e dëmtuara:',
        description: 'Përshkrimi i dëmtimeve (opsional)',
        placeholder: 'Përshkruani rrethanat e incidentit dhe dëmtimet e vërejtura...'
      },

      photos: {
        documents: {
          title: 'Dokumentet',
          heading: 'Dokumentet zyrtare',
          subtitle: 'Shtoni fotografitë e dokumenteve tuaja:',
          registration: {
            label: 'LIBREZA',
            description: 'Dokumenti i regjistrimit'
          },
          mileage: {
            label: 'NUMËRUESI ZYRTAR',
            description: 'Kilometrazhi i automjetit'
          }
        },
        vehicle: {
          title: 'Fotografitë e automjetit',
          heading: 'Fotografitë e automjetit',
          subtitle: 'Bëni fotografitë e automjetit tuaj:',
          angles: {
            label: 'KËNDET E AUTOMJETIT',
            description: '4 foto të detyrueshme këndesh'
          },
          damages: {
            label: 'FOTOGRAFITË E DËMTIMEVE',
            description: 'Zonat e zgjedhura më parë'
          }
        }
      },

      contact: {
        title: 'Kontakti',
        heading: 'Të dhënat tuaja të kontaktit',
        subtitle: 'Informacioni i nevojshëm për t\'ju kontaktuar:',
        firstName: 'Emri',
        lastName: 'Mbiemri',
        email: 'Email-i',
        phone: 'Telefoni',
        address: 'Adresa',
        city: 'Qyteti',
        postalCode: 'Kodi postar',
        placeholders: {
          firstName: 'Emri juaj',
          lastName: 'Mbiemri juaj',
          email: 'juaj@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Rruga dhe numri',
          city: 'Emri i qytetit',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Verifikimi',
        heading: 'Përmbledhje e kërkesës suaj',
        subtitle: 'Kontrolloni informacionin tuaj para dërgimit',
        submit: 'Dërgo kërkesën time',
        submitting: 'Duke dërguar...',
        exportPdf: 'Eksporto në PDF'
      }
    },

    validation: {
      required: 'Ky fushë është e detyrueshme',
      email: 'Adresa e email-it është e pavlefshme',
      phone: 'Numri i telefonit është i pavlefshëm',
      minLength: 'Minimumi {{min}} karaktere',
      maxLength: 'Maksimumi {{max}} karaktere'
    },

    messages: {
      success: {
        title: '✅ Kërkesa u dërgua me sukses!',
        description: 'Ne do t\'ju kontaktojmë së shpejti.'
      },
      error: {
        title: '❌ Gabim në dërgim',
        description: 'Ndodhi një gabim. Ju lutemi provoni përsëri.'
      },
      pdfSuccess: {
        title: '✅ Raporti PDF u gjenerua!',
        description: 'Raporti u shkarkua me sukses.'
      },
      pdfError: {
        title: '❌ Gabim',
        description: 'Nuk mund të gjeneroj raportin PDF.'
      }
    }
  },

  // Ngarkimi i fotografive
  photos: {
    upload: 'Kliko për të ngarkuar',
    dragDrop: 'Tërhiqni dhe lëshoni skedarët tuaj këtu',
    maxFiles: 'Maksimumi {{max}} skedar(ë)',
    supportedFormats: 'Formatet e mbështetura: JPG, PNG, HEIC',
    maxSize: 'Madhësia maks: {{size}}MB',
    uploading: 'Duke ngarkuar...',
    remove: 'Hiq',
    
    examples: {
      title: 'Shembuj',
      vehicleAngles: 'Këndet e fotografimit',
      documents: 'Dokumente të lexueshme',
      damages: 'Fotografitë e dëmtimeve',
      uploadPhotos: 'Ngarko fotografitë'
    },

    guides: {
      frontLeft: 'Fotoja e përparmë majtas',
      rearLeft: 'Fotoja e pasme majtas',
      rearRight: 'Fotoja e pasme djathtas',
      frontRight: 'Fotoja e përparmë djathtas',
      frontLeftView: 'Pamja përpara-majtas',
      rearLeftView: 'Pamja pas-majtas',
      rearRightView: 'Pamja pas-djathtas',
      frontRightView: 'Pamja përpara-djathtas',
      closeUp: 'Foto e afërt',
      wide: 'Foto e largët'
    },

    tips: {
      title: 'Këshilla:',
      items: {
        readable: 'Dokumente të lexueshme',
        noReflection: 'Pa refleksione',
        clearKilometers: 'Kilometrazh i lexueshëm',
        clearDashboard: 'Foto e qartë e panelit',
        goodLighting: 'Fotografitë e qarta dhe të ndriçuara mirë',
        multipleAngles: 'Kënde dhe distanca të ndryshme'
      }
    }
  },

  // Administrimi
  admin: {
    title: 'Portali i Administrimit',
    logout: 'Dalje',
    
    sidebar: {
      requests: 'Kërkesat',
      statistics: 'Statistikat'
    },

    requests: {
      title: 'Menaxhimi i kërkesave',
      subtitle: 'Shikoni dhe menaxhoni të gjitha kërkesat e ekspertizës',
      search: 'Kërko sipas emrit, email-it...',
      filters: {
        all: 'Të gjitha',
        pending: 'Në pritje',
        inProgress: 'Në proces',
        completed: 'Të përfunduara',
        quote: 'Kuotë',
        appointment: 'Takim'
      },
      columns: {
        client: 'Klienti',
        type: 'Lloji',
        status: 'Statusi',
        date: 'Data',
        actions: 'Veprimet'
      },
      noRequests: 'Nuk u gjetën kërkesa',
      selectRequest: 'Zgjidhni një kërkesë'
    },

    status: {
      pending: 'Në pritje',
      inProgress: 'Në proces',
      completed: 'E përfunduar',
      cancelled: 'E anuluar'
    },

    actions: {
      view: 'Shiko',
      edit: 'Redakto',
      complete: 'Përfundo',
      cancel: 'Anulo',
      restore: 'Rikthe',
      markInProgress: 'Shëno në proces',
      downloadZip: 'ZIP'
    }
  },

  // Detajet e kërkesës
  requestDetails: {
    clientInfo: 'Informacioni i plotë i klientit',
    clientInfoDescription: 'Të gjitha informacionet e kontaktit dhe detajet e kërkesës',
    contact: 'Kontakti',
    address: 'Adresa',
    request: 'Kërkesa',
    detailedDescription: 'Përshkrimi i detajuar i kërkesës',
    additionalInfo: 'Informacion shtesë i dhënë nga klienti',
    createdOn: 'Krijuar më',
    appointment: 'Takimi',
    
    damages: {
      reported: 'Dëmtime të raportuara ({{count}})',
      none: 'Nuk ka dëmtime të raportuara',
      damagedAreas: 'Zonat e dëmtuara ({{count}} zonë{{plural}})',
      noDamageVisible: 'Automjet pa dëmtime të dukshme',
      details: 'Detajet e dëmtimeve:'
    },

    photos: {
      transmitted: 'Fotografitë e transmetuara nga klienti ({{count}})',
      clickToEnlarge: 'Klikoni në një foto për ta zmadhuar dhe për të lundruar në galeri',
      files: '{{count}} skedar{{plural}}',
      noPhotos: 'Nuk janë transmetuar fotografitë me këtë kërkesë'
    }
  },

  // Llojet e fotografive
  photoTypes: {
    registration: 'libreza',
    mileage: 'numëruesi',
    vehicleAngles: 'këndet e automjetit',
    damages: 'dëmtimet'
  },

  // Statistikat
  statistics: {
    title: 'Statistikat',
    subtitle: 'Përmbledhja e performancës',
    totalRequests: 'Totali i kërkesave',
    pendingRequests: 'Në pritje',
    completedRequests: 'Të përfunduara',
    averageProcessingTime: 'Koha mesatare e procesimit',
    days: 'ditë',
    requestsOverTime: 'Evolucioni i kërkesave',
    requestsByType: 'Shpërndarja sipas llojit',
    requestsByStatus: 'Shpërndarja sipas statusit'
  }
};