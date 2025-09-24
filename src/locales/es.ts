export default {
  // Navegación e interfaz general
  common: {
    title: 'Expert Auto',
    subtitle: 'Peritajes Automovilísticos Profesionales',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    continue: 'Continuar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    download: 'Descargar',
    print: 'Imprimir',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    select: 'Seleccionar',
    required: 'Requerido',
    optional: 'Opcional',
    yes: 'Sí',
    no: 'No',
  },

  // Formulario principal
  form: {
    title: 'Solicitud de peritaje automovilístico',
    subtitle: 'Complete este formulario para obtener un peritaje de su vehículo',
    
    steps: {
      preparation: {
        title: 'Preparación',
        heading: 'Preparación de su solicitud',
        subtitle: 'Asegúrese de tener estos elementos:',
        timeEstimate: 'Tiempo estimado: 5-10 minutos',
        documents: {
          title: 'Documentos requeridos',
          items: [
            'Foto del permiso de circulación',
            'Foto del cuentakilómetros',
            '4 fotos de los ángulos del vehículo',
            'Fotos de los daños'
          ]
        }
      },

      type: {
        title: 'Tipo de solicitud',
        heading: 'Tipo de solicitud',
        subtitle: 'Elija el servicio deseado:',
        quote: {
          title: 'Recibir un presupuesto',
          description: 'Obtenga una estimación basada en sus fotos',
          features: [
            'Evaluación precisa por nuestros expertos',
            'Presupuesto detallado en 48h',
            'Servicio gratuito y sin compromiso'
          ]
        },
        appointment: {
          title: 'Enviar fotos para reparación',
          description: 'Programe una intervención directa',
          features: [
            'Preparación a través de sus fotos',
            'Cita según su disponibilidad',
            'Peritaje completo en el lugar'
          ]
        },
        preferredDate: 'Fecha preferida',
        preferredTime: 'Hora preferida',
        selectTime: 'Seleccione una hora'
      },

      damages: {
        title: 'Daños',
        heading: 'Daños del vehículo',
        subtitle: 'Haga clic en las zonas dañadas:',
        description: 'Descripción de los daños (opcional)',
        placeholder: 'Describa las circunstancias del incidente y los daños observados...'
      },

      photos: {
        documents: {
          title: 'Documentos',
          heading: 'Documentos oficiales',
          subtitle: 'Agregue las fotos de sus documentos:',
          registration: {
            label: 'PERMISO',
            description: 'Documento de matriculación'
          },
          mileage: {
            label: 'CONTADOR OFICIAL',
            description: 'Kilometraje del vehículo'
          }
        },
        vehicle: {
          title: 'Fotos del vehículo',
          heading: 'Fotos del vehículo',
          subtitle: 'Tome fotos de su vehículo:',
          angles: {
            label: 'ÁNGULOS DEL VEHÍCULO',
            description: '4 fotos de ángulos obligatorias'
          },
          damages: {
            label: 'FOTOS DE LOS DAÑOS',
            description: 'Zonas seleccionadas anteriormente'
          }
        }
      },

      contact: {
        title: 'Contacto',
        heading: 'Sus datos de contacto',
        subtitle: 'Información necesaria para contactarle:',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Email',
        phone: 'Teléfono',
        address: 'Dirección',
        city: 'Ciudad',
        postalCode: 'Código postal',
        placeholders: {
          firstName: 'Su nombre',
          lastName: 'Su apellido',
          email: 'su@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Calle y número',
          city: 'Nombre de la ciudad',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Validación',
        heading: 'Resumen de su solicitud',
        subtitle: 'Verifique su información antes del envío',
        submit: 'Enviar mi solicitud',
        submitting: 'Enviando...',
        exportPdf: 'Exportar a PDF'
      }
    },

    validation: {
      required: 'Este campo es obligatorio',
      email: 'Dirección de email inválida',
      phone: 'Número de teléfono inválido',
      minLength: 'Mínimo {{min}} caracteres',
      maxLength: 'Máximo {{max}} caracteres'
    },

    messages: {
      success: {
        title: '✅ ¡Solicitud enviada con éxito!',
        description: 'Nos pondremos en contacto con usted pronto.'
      },
      error: {
        title: '❌ Error de envío',
        description: 'Se produjo un error. Inténtelo de nuevo.'
      },
      pdfSuccess: {
        title: '✅ ¡Informe PDF generado!',
        description: 'El informe se descargó correctamente.'
      },
      pdfError: {
        title: '❌ Error',
        description: 'No se pudo generar el informe PDF.'
      }
    }
  },

  // Subida de fotos
  photos: {
    upload: 'Haga clic para subir',
    dragDrop: 'Arrastre y suelte sus archivos aquí',
    maxFiles: 'Máximo {{max}} archivo(s)',
    supportedFormats: 'Formatos compatibles: JPG, PNG, HEIC',
    maxSize: 'Tamaño máx: {{size}}MB',
    uploading: 'Subiendo...',
    remove: 'Eliminar',
    
    examples: {
      title: 'Ejemplos',
      vehicleAngles: 'Ángulos de fotografía',
      documents: 'Documentos legibles',
      damages: 'Fotos de daños',
      uploadPhotos: 'Subir fotos'
    },

    guides: {
      frontLeft: 'Foto frontal izquierda',
      rearLeft: 'Foto trasera izquierda',
      rearRight: 'Foto trasera derecha',
      frontRight: 'Foto frontal derecha',
      frontLeftView: 'Vista frontal-izquierda',
      rearLeftView: 'Vista trasera-izquierda',
      rearRightView: 'Vista trasera-derecha',
      frontRightView: 'Vista frontal-derecha',
      closeUp: 'Foto cercana',
      wide: 'Foto lejana'
    },

    tips: {
      title: 'Consejos:',
      items: {
        readable: 'Documentos legibles',
        noReflection: 'Sin reflejos',
        clearKilometers: 'Kilometraje legible',
        clearDashboard: 'Foto nítida del tablero',
        goodLighting: 'Fotos nítidas y bien iluminadas',
        multipleAngles: 'Diferentes ángulos y distancias'
      }
    }
  },

  // Administración
  admin: {
    title: 'Portal de Administración',
    logout: 'Cerrar sesión',
    
    sidebar: {
      requests: 'Solicitudes',
      statistics: 'Estadísticas'
    },

    requests: {
      title: 'Gestión de solicitudes',
      subtitle: 'Consulte y gestione todas las solicitudes de peritaje',
      search: 'Buscar por nombre, email...',
      filters: {
        all: 'Todas',
        pending: 'Pendientes',
        inProgress: 'En curso',
        completed: 'Completadas',
        quote: 'Presupuesto',
        appointment: 'Cita'
      },
      columns: {
        client: 'Cliente',
        type: 'Tipo',
        status: 'Estado',
        date: 'Fecha',
        actions: 'Acciones'
      },
      noRequests: 'No se encontraron solicitudes',
      selectRequest: 'Seleccione una solicitud'
    },

    status: {
      pending: 'Pendiente',
      inProgress: 'En curso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    },

    actions: {
      view: 'Ver',
      edit: 'Editar',
      complete: 'Completar',
      cancel: 'Cancelar',
      restore: 'Restaurar',
      markInProgress: 'Marcar en curso',
      downloadZip: 'ZIP'
    }
  },

  // Detalles de la solicitud
  requestDetails: {
    clientInfo: 'Información completa del cliente',
    clientInfoDescription: 'Toda la información de contacto y detalles de la solicitud',
    contact: 'Contacto',
    address: 'Dirección',
    request: 'Solicitud',
    detailedDescription: 'Descripción detallada de la solicitud',
    additionalInfo: 'Información adicional proporcionada por el cliente',
    createdOn: 'Creado el',
    appointment: 'Cita',
    
    damages: {
      reported: 'Daños reportados ({{count}})',
      none: 'No se reportaron daños',
      damagedAreas: 'Zonas dañadas ({{count}} zona{{plural}})',
      noDamageVisible: 'Vehículo sin daños visibles',
      details: 'Detalle de los daños:'
    },

    photos: {
      transmitted: 'Fotos transmitidas por el cliente ({{count}})',
      clickToEnlarge: 'Haga clic en una foto para ampliarla y navegar en la galería',
      files: '{{count}} archivo{{plural}}',
      noPhotos: 'No se transmitieron fotos con esta solicitud'
    }
  },

  // Tipos de fotos
  photoTypes: {
    registration: 'permiso',
    mileage: 'contador',
    vehicleAngles: 'ángulos del vehículo',
    damages: 'daños'
  },

  // Estadísticas
  statistics: {
    title: 'Estadísticas',
    subtitle: 'Resumen del rendimiento',
    totalRequests: 'Total de solicitudes',
    pendingRequests: 'Pendientes',
    completedRequests: 'Completadas',
    averageProcessingTime: 'Tiempo promedio de procesamiento',
    days: 'días',
    requestsOverTime: 'Evolución de las solicitudes',
    requestsByType: 'Distribución por tipo',
    requestsByStatus: 'Distribución por estado'
  }
};