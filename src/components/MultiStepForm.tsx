import React, { useState } from 'react';
import { AlertCircle, Calendar, Camera, Car, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, Image, Mail, MapPin, Phone, Settings, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CarDamageSelector from '@/components/CarDamageSelector';
import { PhotoUpload } from '@/components/PhotoUpload';
import { StepProgress } from '@/components/StepProgress';
import { FormData, Step } from '@/types/form';
import { useToast } from '@/hooks/use-toast';
export const MultiStepForm: React.FC = () => {
  const {
    toast
  } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    requestType: '',
    selectedDamages: [],
    photos: {
      registration: [],
      mileage: [],
      vehicleAngles: [],
      damagePhotos: []
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
  });
  const steps: Step[] = [{
    id: 'preparation',
    title: 'Préparation',
    icon: FileText
  }, {
    id: 'type',
    title: 'Type de demande',
    icon: Settings
  }, {
    id: 'damages',
    title: 'Dommages',
    icon: Car
  }, {
    id: 'photos-docs',
    title: 'Documents',
    icon: Image
  }, {
    id: 'photos-vehicle',
    title: 'Photos véhicule',
    icon: Camera
  }, {
    id: 'contact',
    title: 'Contact',
    icon: User
  }, {
    id: 'review',
    title: 'Validation',
    icon: CheckCircle
  }];
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const updatePhotos = (category: keyof FormData['photos'], photos: File[]) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [category]: photos
      }
    }));
  };
  const updateContact = (field: keyof FormData['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };
  const handleDamageSelect = (areaId: string) => {
    const selectedDamages = formData.selectedDamages.includes(areaId) ? formData.selectedDamages.filter(id => id !== areaId) : [...formData.selectedDamages, areaId];
    updateFormData('selectedDamages', selectedDamages);
  };
  const submitForm = () => {
    toast({
      title: "Demande envoyée avec succès !",
      description: "Nous vous contacterons dans les plus brefs délais."
    });

    // Reset form
    setCurrentStep(0);
    setFormData({
      requestType: '',
      selectedDamages: [],
      photos: {
        registration: [],
        mileage: [],
        vehicleAngles: [],
        damagePhotos: []
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
    });
  };
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Type selection
        return formData.requestType !== '';
      case 5:
        // Contact
        return formData.contact.firstName && formData.contact.lastName && formData.contact.email && formData.contact.phone;
      default:
        return true;
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Préparation
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <FileText className="w-20 h-20 text-primary mx-auto mb-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Préparation de votre demande</h2>
              <p className="text-lg text-muted-foreground mb-8">Assurez-vous d'avoir ces éléments :</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-card border border-border">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Documents requis</h3>
              </div>
              <ul className="space-y-3">
                {["Photo de la carte grise", "Photo du compteur kilométrique", "4 photos des angles du véhicule", "Photos des dommages"].map((item, index) => <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-success flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>)}
              </ul>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-2" />
                Temps estimé : 5-10 minutes
              </p>
            </div>
          </div>;
      case 1:
        // Type de demande
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Settings className="w-20 h-20 text-primary mx-auto mb-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Type de demande</h2>
              <p className="text-lg text-muted-foreground mb-8">Choisissez le service souhaité :</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div onClick={() => updateFormData('requestType', 'quote')} className={`
                  p-4 sm:p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300
                  ${formData.requestType === 'quote' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary hover:shadow-md'}
                `}>
                <div className="text-center">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">Recevoir un devis</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Obtenez une estimation basée sur vos photos
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2 text-left">
                    {["Évaluation précise par nos experts", "Devis détaillé sous 48h", "Service gratuit et sans engagement"].map((item, index) => <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>)}
                  </ul>
                </div>
              </div>

              <div onClick={() => updateFormData('requestType', 'appointment')} className={`
                  p-4 sm:p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300
                  ${formData.requestType === 'appointment' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary hover:shadow-md'}
                `}>
                <div className="text-center">
                  <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">Transmettre photos pour réparation</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Planifiez une intervention directe
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2 text-left">
                    {["Préparation via vos photos", "Rendez-vous selon vos disponibilités", "Expertise complète sur place"].map((item, index) => <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>

            {formData.requestType === 'appointment' && <div className="grid md:grid-cols-2 gap-6 bg-card p-6 rounded-xl border border-border">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Date préférée
                  </label>
                  <input type="date" value={formData.preferredDate} onChange={e => updateFormData('preferredDate', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Heure préférée
                  </label>
                  <select value={formData.preferredTime} onChange={e => updateFormData('preferredTime', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
                    <option value="">Sélectionnez une heure</option>
                    {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>}
          </div>;
      case 2:
        // Sélection des dommages
        return <div className="space-y-8">
            <div className="text-center mx-0 px-0 py-0 my-0">
              <div className="relative inline-block my-0 py-[7px] px-0">
                <Car className="w-20 h-20 text-primary mb-6 mx-0 px-[14px]" />
              </div>
              <h2 className="font-bold text-foreground mb-4 text-xl">Dommages du véhicule</h2>
              <p className="text-muted-foreground text-sm">Cliquez sur les zones endommagées :</p>
            </div>

            <CarDamageSelector selectedAreas={formData.selectedDamages} onAreaSelect={handleDamageSelect} />

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Description des dommages (optionnel)
              </label>
              <textarea value={formData.description} onChange={e => updateFormData('description', e.target.value)} rows={4} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" placeholder="Décrivez les circonstances de l'incident et les dommages observés..." />
            </div>
          </div>;
      case 3:
        // Photos documents
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Image className="w-20 h-20 text-primary mx-auto mb-6" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">4</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Documents officiels</h2>
              <p className="text-lg text-muted-foreground">Ajoutez les photos de vos documents :</p>
            </div>

            <div className="space-y-8">
              <PhotoUpload label="Carte grise" description="1 photo claire de votre carte grise (recto)" photos={formData.photos.registration} onPhotosChange={photos => updatePhotos('registration', photos)} maxFiles={1} />

              <PhotoUpload label="Compteur kilométrique" description="1 photo du tableau de bord montrant le kilométrage actuel" photos={formData.photos.mileage} onPhotosChange={photos => updatePhotos('mileage', photos)} maxFiles={1} />
            </div>

          </div>;
      case 4:
        // Photos véhicule
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Camera className="w-20 h-20 text-primary mx-auto mb-6" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">5</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Photos du véhicule</h2>
              <p className="text-lg text-muted-foreground">Prenez les photos de votre véhicule :</p>
            </div>

            <div className="space-y-8">
              <PhotoUpload label="4 angles du véhicule" description="1 photo de chaque angle : avant, arrière, gauche, droite" photos={formData.photos.vehicleAngles} onPhotosChange={photos => updatePhotos('vehicleAngles', photos)} maxFiles={4} showGuide={true} />

              <PhotoUpload label="Photos des dommages" description="Photos détaillées de chaque zone endommagée (rapprochées et éloignées)" photos={formData.photos.damagePhotos} onPhotosChange={photos => updatePhotos('damagePhotos', photos)} maxFiles={10} />
            </div>

          </div>;
      case 5:
        // Contact
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <User className="w-20 h-20 text-primary mx-auto mb-6" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">6</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Informations de contact</h2>
              <p className="text-lg text-muted-foreground">Renseignez vos coordonnées :</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Prénom *
                </label>
                <input type="text" required value={formData.contact.firstName} onChange={e => updateContact('firstName', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nom *
                </label>
                <input type="text" required value={formData.contact.lastName} onChange={e => updateContact('lastName', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email *
                </label>
                <input type="email" required value={formData.contact.email} onChange={e => updateContact('email', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Téléphone *
                </label>
                <input type="tel" required value={formData.contact.phone} onChange={e => updateContact('phone', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center mx-[5px] my-px">
                  <MapPin className="w-4 h-4 mr-2" />
                  Adresse
                </label>
                <input type="text" value={formData.contact.address} onChange={e => updateContact('address', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ville
                </label>
                <input type="text" value={formData.contact.city} onChange={e => updateContact('city', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Code postal
                </label>
                <input type="text" value={formData.contact.postalCode} onChange={e => updateContact('postalCode', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>
            </div>
          </div>;
      case 6:
        // Récapitulatif
        return <div className="space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">7</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Récapitulatif de votre demande</h2>
              <p className="text-lg text-muted-foreground">Vérifiez vos informations avant envoi :</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-card p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">Type de demande</h3>
                <p className="text-muted-foreground">
                  {formData.requestType === 'quote' ? 'Demande de devis' : 'Prise de rendez-vous'}
                </p>
                {formData.requestType === 'appointment' && formData.preferredDate && <p className="text-sm text-muted-foreground mt-2">
                    Date souhaitée : {formData.preferredDate} {formData.preferredTime && `à ${formData.preferredTime}`}
                  </p>}
              </div>

              <div className="bg-gradient-card p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">Contact</h3>
                <p className="text-muted-foreground">
                  {formData.contact.firstName} {formData.contact.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{formData.contact.email}</p>
                <p className="text-sm text-muted-foreground">{formData.contact.phone}</p>
              </div>

              <div className="bg-gradient-card p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">Dommages sélectionnés</h3>
                <p className="text-muted-foreground">
                  {formData.selectedDamages.length > 0 ? `${formData.selectedDamages.length} zone(s) sélectionnée(s)` : 'Aucune zone spécifique sélectionnée'}
                </p>
              </div>

              <div className="bg-gradient-card p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">Photos ajoutées</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      Documents : {formData.photos.registration.length + formData.photos.mileage.length} photo(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Véhicule : {formData.photos.vehicleAngles.length + formData.photos.damagePhotos.length} photo(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={submitForm} variant="accent" size="lg" className="px-12">
                <Send className="w-5 h-5 mr-2" />
                Envoyer ma demande
              </Button>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-elegant border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-hero p-8 text-center mx-0 px-[24px] py-[9px]">
            <h1 className="font-bold text-white mb-2 py-0 text-lg">Demande d'expertise automobile</h1>
            <p className="text-white/90 text-xs">Transmettez vos photos pour obtenir un devis ou prendre rendez-vous</p>
          </div>

          {/* Progress */}
          <div className="px-[11px]">
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* Content */}
          <div className="p-8 px-[8px] py-0">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-4 sm:p-6 bg-muted/30 border-t border-border/50">
            <Button onClick={prevStep} variant="outline" disabled={currentStep === 0} className="min-w-32 py-0 mx-[5px] px-[3px]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </div>

            {currentStep < steps.length - 1 ? <Button onClick={nextStep} disabled={!canProceed()} className="min-w-32 mx-[30px]">
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button> : <div className="min-w-32" />}
          </div>
        </div>
      </div>
    </div>;
};