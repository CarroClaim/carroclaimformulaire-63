export default {
  // Navegação e interface geral
  common: {
    back: 'Voltar',
    next: 'Seguinte',
    previous: 'Anterior',
    continue: 'Continuar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    download: 'Descarregar',
    print: 'Imprimir',
    loading: 'A carregar...',
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Aviso',
    info: 'Informação',
    select: 'Selecionar',
    required: 'Obrigatório',
    optional: 'Opcional',
    yes: 'Sim',
    no: 'Não',
  },

  // Formulário principal
  form: {
    title: 'Pedido de perícia automóvel',
    subtitle: 'Preencha este formulário para obter uma perícia do seu veículo',
    
    steps: {
      preparation: {
        title: 'Preparação',
        heading: 'Preparação do seu pedido',
        subtitle: 'Certifique-se de ter estes elementos:',
        timeEstimate: 'Tempo estimado: 5-10 minutos',
        documents: {
          title: 'Documentos necessários',
          items: [
            'Foto do documento de registo',
            'Foto do conta-quilómetros',
            '4 fotos dos ângulos do veículo',
            'Fotos dos danos'
          ]
        }
      },

      type: {
        title: 'Tipo de pedido',
        heading: 'Tipo de pedido',
        subtitle: 'Escolha o serviço desejado:',
        quote: {
          title: 'Receber um orçamento',
          description: 'Obtenha uma estimativa baseada nas suas fotos',
          features: [
            'Avaliação precisa pelos nossos peritos',
            'Orçamento detalhado em 48h',
            'Serviço gratuito e sem compromisso'
          ]
        },
        appointment: {
          title: 'Enviar fotos para reparação',
          description: 'Agende uma intervenção direta',
          features: [
            'Preparação através das suas fotos',
            'Marcação segundo a sua disponibilidade',
            'Perícia completa no local'
          ]
        },
        preferredDate: 'Data preferida',
        preferredTime: 'Hora preferida',
        selectTime: 'Selecione uma hora'
      },

      damages: {
        title: 'Danos',
        heading: 'Danos do veículo',
        subtitle: 'Clique nas zonas danificadas:',
        description: 'Descrição dos danos (opcional)',
        placeholder: 'Descreva as circunstâncias do incidente e os danos observados...'
      },

      photos: {
        documents: {
          title: 'Documentos',
          heading: 'Documentos oficiais',
          subtitle: 'Adicione as fotos dos seus documentos:',
          registration: {
            label: 'REGISTO',
            description: 'Documento de matrícula'
          },
          mileage: {
            label: 'CONTADOR OFICIAL',
            description: 'Quilometragem do veículo'
          }
        },
        vehicle: {
          title: 'Fotos do veículo',
          heading: 'Fotos do veículo',
          subtitle: 'Tire fotos do seu veículo:',
          angles: {
            label: 'ÂNGULOS DO VEÍCULO',
            description: '4 fotos de ângulos obrigatórias'
          },
          damages: {
            label: 'FOTOS DOS DANOS',
            description: 'Zonas selecionadas anteriormente'
          }
        }
      },

      contact: {
        title: 'Contacto',
        heading: 'Os seus dados',
        subtitle: 'Informações necessárias para o contactar:',
        firstName: 'Nome próprio',
        lastName: 'Apelido',
        email: 'Email',
        phone: 'Telefone',
        address: 'Morada',
        city: 'Cidade',
        postalCode: 'Código postal',
        placeholders: {
          firstName: 'O seu nome próprio',
          lastName: 'O seu apelido',
          email: 'seu@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Rua e número',
          city: 'Nome da cidade',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Validação',
        heading: 'Resumo do seu pedido',
        subtitle: 'Verifique as suas informações antes de enviar',
        submit: 'Enviar o meu pedido',
        submitting: 'A enviar...',
        exportPdf: 'Exportar para PDF'
      }
    },

    validation: {
      required: 'Este campo é obrigatório',
      email: 'Endereço de email inválido',
      phone: 'Número de telefone inválido',
      minLength: 'Mínimo {{min}} caracteres',
      maxLength: 'Máximo {{max}} caracteres'
    },

    messages: {
      success: {
        title: '✅ Pedido enviado com sucesso!',
        description: 'Entraremos em contacto consigo brevemente.'
      },
      error: {
        title: '❌ Erro de envio',
        description: 'Ocorreu um erro. Tente novamente.'
      },
      pdfSuccess: {
        title: '✅ Relatório PDF gerado!',
        description: 'O relatório foi descarregado com sucesso.'
      },
      pdfError: {
        title: '❌ Erro',
        description: 'Impossível gerar o relatório PDF.'
      }
    }
  },

  // Upload de fotos
  photos: {
    upload: 'Clique para carregar',
    dragDrop: 'Arraste e largue os seus ficheiros aqui',
    maxFiles: 'Máximo {{max}} ficheiro(s)',
    supportedFormats: 'Formatos suportados: JPG, PNG, HEIC',
    maxSize: 'Tamanho máx: {{size}}MB',
    uploading: 'A carregar...',
    remove: 'Remover',
    
    examples: {
      title: 'Exemplos',
      vehicleAngles: 'Ângulos de fotografia',
      documents: 'Documentos legíveis',
      damages: 'Fotos dos danos',
      uploadPhotos: 'Carregar fotos'
    },

    guides: {
      frontLeft: 'Foto da frente esquerda',
      rearLeft: 'Foto de trás esquerda',
      rearRight: 'Foto de trás direita',
      frontRight: 'Foto da frente direita',
      frontLeftView: 'Vista frente-esquerda',
      rearLeftView: 'Vista trás-esquerda',
      rearRightView: 'Vista trás-direita',
      frontRightView: 'Vista frente-direita',
      closeUp: 'Foto próxima',
      wide: 'Foto distante'
    },

    tips: {
      title: 'Conselhos:',
      items: {
        readable: 'Documentos legíveis',
        noReflection: 'Sem reflexos',
        clearKilometers: 'Quilometragem legível',
        clearDashboard: 'Foto nítida do painel',
        goodLighting: 'Fotos nítidas e bem iluminadas',
        multipleAngles: 'Diferentes ângulos e distâncias'
      }
    }
  },

  // Administração
  admin: {
    title: 'Portal de Administração',
    logout: 'Sair',
    
    sidebar: {
      requests: 'Pedidos',
      statistics: 'Estatísticas'
    },

    requests: {
      title: 'Gestão de pedidos',
      subtitle: 'Consulte e gira todos os pedidos de perícia',
      search: 'Procurar por nome, email...',
      filters: {
        all: 'Todos',
        pending: 'Pendentes',
        inProgress: 'Em curso',
        completed: 'Concluídos',
        quote: 'Orçamento',
        appointment: 'Marcação'
      },
      columns: {
        client: 'Cliente',
        type: 'Tipo',
        status: 'Estado',
        date: 'Data',
        actions: 'Ações'
      },
      noRequests: 'Nenhum pedido encontrado',
      selectRequest: 'Selecione um pedido'
    },

    status: {
      pending: 'Pendente',
      inProgress: 'Em curso',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    },

    actions: {
      view: 'Ver',
      edit: 'Editar',
      complete: 'Concluir',
      cancel: 'Cancelar',
      restore: 'Restaurar',
      markInProgress: 'Marcar em curso',
      downloadZip: 'ZIP'
    }
  },

  // Detalhes do pedido
  requestDetails: {
    clientInfo: 'Informações completas do cliente',
    clientInfoDescription: 'Todas as informações de contacto e detalhes do pedido',
    contact: 'Contacto',
    address: 'Morada',
    request: 'Pedido',
    detailedDescription: 'Descrição detalhada do pedido',
    additionalInfo: 'Informações adicionais fornecidas pelo cliente',
    createdOn: 'Criado em',
    appointment: 'Marcação',
    
    damages: {
      reported: 'Danos reportados ({{count}})',
      none: 'Nenhum dano reportado',
      damagedAreas: 'Zonas danificadas ({{count}} zona{{plural}})',
      noDamageVisible: 'Veículo sem danos visíveis',
      details: 'Detalhe dos danos:'
    },

    photos: {
      transmitted: 'Fotos transmitidas pelo cliente ({{count}})',
      clickToEnlarge: 'Clique numa foto para a ampliar e navegar na galeria',
      files: '{{count}} ficheiro{{plural}}',
      noPhotos: 'Nenhuma foto foi transmitida com este pedido'
    }
  },

  // Tipos de fotos
  photoTypes: {
    registration: 'registo',
    mileage: 'contador',
    vehicleAngles: 'ângulos do veículo',
    damages: 'danos'
  },

  // Estatísticas
  statistics: {
    title: 'Estatísticas',
    subtitle: 'Visão geral do desempenho',
    totalRequests: 'Total de pedidos',
    pendingRequests: 'Pendentes',
    completedRequests: 'Concluídos',
    averageProcessingTime: 'Tempo médio de processamento',
    days: 'dias',
    requestsOverTime: 'Evolução dos pedidos',
    requestsByType: 'Distribuição por tipo',
    requestsByStatus: 'Distribuição por estado'
  }
};