export default {
  // Navigation and general interface
  common: {
    title: 'Expert Auto',
    subtitle: 'Professional Automotive Expertise',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    continue: 'Continue',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    download: 'Download',
    print: 'Print',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    select: 'Select',
    required: 'Required',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
  },

  // Main form
  form: {
    title: 'Automotive Expertise Request',
    subtitle: 'Fill out this form to get an expertise of your vehicle',
    
    steps: {
      preparation: {
        title: 'Preparation',
        heading: 'Preparing your request',
        subtitle: 'Make sure you have these elements:',
        timeEstimate: 'Estimated time: 5-10 minutes',
        documents: {
          title: 'Required documents',
          items: [
            'Photo of registration certificate',
            'Photo of odometer',
            '4 photos of vehicle angles',
            'Photos of damages'
          ]
        }
      },

      type: {
        title: 'Request type',
        heading: 'Type of request',
        subtitle: 'Choose the desired service:',
        quote: {
          title: 'Get a quote',
          description: 'Get an estimate based on your photos',
          features: [
            'Precise evaluation by our experts',
            'Detailed quote within 48h',
            'Free and non-binding service'
          ]
        },
        appointment: {
          title: 'Submit photos for repair',
          description: 'Schedule a direct intervention',
          features: [
            'Preparation via your photos',
            'Appointment according to your availability',
            'Complete expertise on site'
          ]
        },
        preferredDate: 'Preferred date',
        preferredTime: 'Preferred time',
        selectTime: 'Select a time'
      },

      damages: {
        title: 'Damages',
        heading: 'Vehicle damages',
        subtitle: 'Click on the damaged areas:',
        description: 'Damage description (optional)',
        placeholder: 'Describe the circumstances of the incident and observed damages...'
      },

      photos: {
        documents: {
          title: 'Documents',
          heading: 'Official documents',
          subtitle: 'Add photos of your documents:',
          registration: {
            label: 'REGISTRATION',
            description: 'Registration document'
          },
          mileage: {
            label: 'OFFICIAL COUNTER',
            description: 'Vehicle mileage'
          }
        },
        vehicle: {
          title: 'Vehicle photos',
          heading: 'Vehicle photos',
          subtitle: 'Take photos of your vehicle:',
          angles: {
            label: 'VEHICLE ANGLES',
            description: '4 mandatory angle photos'
          },
          damages: {
            label: 'DAMAGE PHOTOS',
            description: 'Previously selected areas'
          }
        }
      },

      contact: {
        title: 'Contact',
        heading: 'Your contact details',
        subtitle: 'Information needed to contact you:',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        postalCode: 'Postal code',
        placeholders: {
          firstName: 'Your first name',
          lastName: 'Your last name',
          email: 'your@email.com',
          phone: '+41 XX XXX XX XX',
          address: 'Street and number',
          city: 'City name',
          postalCode: '1000'
        }
      },

      review: {
        title: 'Review',
        heading: 'Summary of your request',
        subtitle: 'Check your information before sending',
        submit: 'Send my request',
        submitting: 'Sending...',
        exportPdf: 'Export to PDF'
      }
    },

    validation: {
      required: 'This field is required',
      email: 'Invalid email address',
      phone: 'Invalid phone number',
      minLength: 'Minimum {{min}} characters',
      maxLength: 'Maximum {{max}} characters'
    },

    messages: {
      success: {
        title: '✅ Request sent successfully!',
        description: 'We will contact you shortly.'
      },
      error: {
        title: '❌ Submission error',
        description: 'An error occurred. Please try again.'
      },
      pdfSuccess: {
        title: '✅ PDF report generated!',
        description: 'The report has been downloaded successfully.'
      },
      pdfError: {
        title: '❌ Error',
        description: 'Unable to generate PDF report.'
      }
    }
  },

  // Photo upload
  photos: {
    upload: 'Click to upload',
    dragDrop: 'Drag and drop your files here',
    maxFiles: 'Maximum {{max}} file(s)',
    supportedFormats: 'Supported formats: JPG, PNG, HEIC',
    maxSize: 'Max size: {{size}}MB',
    uploading: 'Uploading...',
    remove: 'Remove',
    
    examples: {
      title: 'Examples',
      vehicleAngles: 'Shooting angles',
      documents: 'Readable documents',
      damages: 'Damage photos',
      uploadPhotos: 'Upload photos'
    },

    guides: {
      frontLeft: 'Front left photo',
      rearLeft: 'Rear left photo',
      rearRight: 'Rear right photo',
      frontRight: 'Front right photo',
      frontLeftView: 'Front-left view',
      rearLeftView: 'Rear-left view',
      rearRightView: 'Rear-right view',
      frontRightView: 'Front-right view',
      closeUp: 'Close-up photo',
      wide: 'Wide photo'
    },

    tips: {
      title: 'Tips:',
      items: {
        readable: 'Readable documents',
        noReflection: 'No reflections',
        clearKilometers: 'Readable mileage',
        clearDashboard: 'Sharp photo of dashboard',
        goodLighting: 'Sharp and well-lit photos',
        multipleAngles: 'Different angles and distances'
      }
    }
  },

  // Administration
  admin: {
    title: 'Administration Portal',
    logout: 'Logout',
    
    sidebar: {
      requests: 'Requests',
      statistics: 'Statistics'
    },

    requests: {
      title: 'Request management',
      subtitle: 'View and manage all expertise requests',
      search: 'Search by name, email...',
      filters: {
        all: 'All',
        pending: 'Pending',
        inProgress: 'In progress',
        completed: 'Completed',
        quote: 'Quote',
        appointment: 'Appointment'
      },
      columns: {
        client: 'Client',
        type: 'Type',
        status: 'Status',
        date: 'Date',
        actions: 'Actions'
      },
      noRequests: 'No requests found',
      selectRequest: 'Select a request'
    },

    status: {
      pending: 'Pending',
      inProgress: 'In progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },

    actions: {
      view: 'View',
      edit: 'Edit',
      complete: 'Complete',
      cancel: 'Cancel',
      restore: 'Restore',
      markInProgress: 'Mark in progress',
      downloadZip: 'ZIP'
    }
  },

  // Request details
  requestDetails: {
    clientInfo: 'Complete client information',
    clientInfoDescription: 'All contact information and request details',
    contact: 'Contact',
    address: 'Address',
    request: 'Request',
    detailedDescription: 'Detailed request description',
    additionalInfo: 'Additional information provided by client',
    createdOn: 'Created on',
    appointment: 'Appointment',
    
    damages: {
      reported: 'Reported damages ({{count}})',
      none: 'No damage reported',
      damagedAreas: 'Damaged areas ({{count}} area{{plural}})',
      noDamageVisible: 'Vehicle with no visible damage',
      details: 'Damage details:'
    },

    photos: {
      transmitted: 'Photos transmitted by client ({{count}})',
      clickToEnlarge: 'Click on a photo to enlarge it and navigate in the gallery',
      files: '{{count}} file{{plural}}',
      noPhotos: 'No photos were transmitted with this request'
    }
  },

  // Photo types
  photoTypes: {
    registration: 'registration',
    mileage: 'counter',
    vehicleAngles: 'vehicle angles',
    damages: 'damages'
  },

  // Statistics
  statistics: {
    title: 'Statistics',
    subtitle: 'Performance overview',
    totalRequests: 'Total requests',
    pendingRequests: 'Pending',
    completedRequests: 'Completed',
    averageProcessingTime: 'Average processing time',
    days: 'days',
    requestsOverTime: 'Request evolution',
    requestsByType: 'Distribution by type',
    requestsByStatus: 'Distribution by status'
  }
};