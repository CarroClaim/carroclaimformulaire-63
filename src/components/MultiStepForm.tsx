import React, { useRef } from 'react';
import { AlertCircle, Calendar, Camera, Car, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, Image, Mail, MapPin, Phone, Settings, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider, useFormContext } from '@/context/FormContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import CarDamageSelector from '@/components/CarDamageSelector';
import { PhotoUpload } from '@/components/PhotoUpload';
import { StepProgress } from '@/components/StepProgress';
import { Step } from '@/types/form';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
/**
 * COMPOSANT PRINCIPAL DU FORMULAIRE MULTI-ÉTAPES
 * 
 * Ce composant orchestre l'ensemble du formulaire avec :
 * - Gestion d'état centralisée via FormContext
 * - Intégration du thème corporate DaisyUI
 * - Validation automatique et navigation intelligente
 * - Upload et gestion des photos via Supabase
 */

// Composant interne utilisant le contexte
const MultiStepFormContent: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const carSelectorRef = useRef<any>(null);
  const {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    updatePhotos,
    updateContact,
    canProceedToNextStep,
    submitForm,
    error,
    isLoading,
    validationErrors
  } = useFormContext();
  // Définition des étapes avec icônes et traductions
  const steps: Step[] = [{
    id: 'preparation',
    title: t('form.steps.preparation.title'),
    icon: FileText
  }, {
    id: 'type',
    title: t('form.steps.type.title'),
    icon: Settings
  }, {
    id: 'damages',
    title: t('form.steps.damages.title'),
    icon: Car
  }, {
    id: 'photos-docs',
    title: t('form.steps.photos.documents.title'),
    icon: Image
  }, {
    id: 'photos-vehicle',
    title: t('form.steps.photos.vehicle.title'),
    icon: Camera
  }, {
    id: 'contact',
    title: t('form.steps.contact.title'),
    icon: User
  }, {
    id: 'review',
    title: t('form.steps.review.title'),
    icon: CheckCircle
  }];

  /**
   * GESTION DE LA SÉLECTION DES DOMMAGES
   * Logique pour sélectionner/désélectionner les zones endommagées
   */
  const handleDamageSelect = (areaId: string) => {
    const selectedDamages = formData.selectedDamages.includes(areaId) 
      ? formData.selectedDamages.filter(id => id !== areaId) 
      : [...formData.selectedDamages, areaId];
    updateFormData('selectedDamages', selectedDamages);
  };

  /**
   * SOUMISSION DU FORMULAIRE AVEC GESTION D'ERREURS
   * Utilise le service de soumission via le contexte
   */
  const handleSubmit = async () => {
    if (isLoading) return; // Empêcher les double-clics
    
    try {
      console.log('Début de soumission du formulaire...');
      const success = await submitForm();
      if (success) {
      toast({
        title: t('form.messages.success.title'),
        description: t('form.messages.success.description'),
        duration: 5000
      });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: t('form.messages.error.title'),
        description: error instanceof Error ? error.message : t('form.messages.error.description'),
        variant: "destructive",
        duration: 5000
      });
    }
  };

  /**
   * GÉNÉRATION ET EXPORT DU RAPPORT PDF
   * Génère un PDF avec les informations et le schéma des dommages
   */
  const exportReportPDF = async () => {
    console.log('Tentative d\'export PDF...');
    console.log('Ref actuelle:', carSelectorRef.current);
    console.log('Dommages sélectionnés:', formData.selectedDamages);
    
    try {
      // Référence au composant de sélection des dommages
      if (!carSelectorRef.current?.exportPNG) {
        console.error('Référence au composant CarDamageSelector manquante');
        toast({
          title: t('common.error'),
          description: t('form.messages.pdfError.componentUnavailable'),
          variant: "destructive",
          duration: 5000
        });
        return;
      }

      console.log('Export PNG en cours...');
      // Génération du PNG via l'API du composant
      const pngBlob = await carSelectorRef.current.exportPNG({ scale: 2, background: '#ffffff' });
      const pngArrayBuffer = await pngBlob.arrayBuffer();

      // Création du document PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
      const { width: pw, height: ph } = page.getSize();

      // Ajout du titre et des informations
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const title = t('form.pdf.title');
      page.drawText(title, { x: 40, y: ph - 60, size: 16, font, color: rgb(0,0,0) });

      // Informations du contact et de la demande
      const lines = [
        `${t('form.pdf.name')}: ${formData.contact.firstName || ''} ${formData.contact.lastName || ''}`.trim(),
        `${t('form.pdf.email')}: ${formData.contact.email || '-'}`,
        `${t('form.pdf.phone')}: ${formData.contact.phone || '-'}`,
        `${t('form.pdf.type')}: ${formData.requestType === 'appointment' ? t('form.requestType.appointment') : t('form.requestType.quote')}`,
        formData.preferredDate ? `${t('form.pdf.preferredDate')}: ${formData.preferredDate}${formData.preferredTime ? ` ${formData.preferredTime}` : ''}` : null,
        `${t('form.pdf.zones')}: ${formData.selectedDamages.length > 0 ? formData.selectedDamages.join(', ') : t('form.pdf.noZones')}`
      ].filter(Boolean) as string[];

      let y = ph - 90;
      lines.forEach((l) => {
        page.drawText(l, { x: 40, y, size: 10, font, color: rgb(0.1,0.1,0.1) });
        y -= 14;
      });

      // Intégration de l'image du schéma
      const pngImage = await pdfDoc.embedPng(pngArrayBuffer);
      const maxImgWidth = pw - 80;
      const maxImgHeight = ph / 2;
      const imgRatio = pngImage.width / pngImage.height;

      let imgW = maxImgWidth;
      let imgH = imgW / imgRatio;
      if (imgH > maxImgHeight) {
        imgH = maxImgHeight;
        imgW = imgH * imgRatio;
      }

      page.drawImage(pngImage, {
        x: 40,
        y: y - imgH - 20,
        width: imgW,
        height: imgH,
      });

      // Téléchargement du PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `rapport-expertise-${Date.now()}.pdf`);

      toast({
        title: t('form.messages.pdfSuccess.title'),
        description: t('form.messages.pdfSuccess.description'),
        duration: 3000
      });

    } catch (e) {
      console.error(e);
      toast({
        title: t('common.error'),
        description: t('form.messages.pdfError.generation'),
        variant: "destructive",
        duration: 5000
      });
    }
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
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="relative inline-block">
                <FileText className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.preparation.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8">{t('form.steps.preparation.subtitle')}</p>
            </div>

            <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-card border border-border">
              <div className="flex items-center mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-3" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground">{t('form.steps.preparation.documents.title')}</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {(t('form.steps.preparation.documents.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 text-success flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-base text-muted-foreground">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                {t('form.steps.preparation.timeEstimate')}
              </p>
            </div>
          </div>;
      case 1:
        // Type de demande
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Settings className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.type.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-8">{t('form.steps.type.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
              <div onClick={() => updateFormData('requestType', 'quote')} className={`
                  p-3 sm:p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300
                  ${formData.requestType === 'quote' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary hover:shadow-md'}
                `}>
                <div className="text-center">
                  <FileText className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 text-primary" />
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3 text-foreground">{t('form.steps.type.quote.title')}</h3>
                  <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4">
                    {t('form.steps.type.quote.description')}
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2 text-left">
                    {(t('form.steps.type.quote.features', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div onClick={() => updateFormData('requestType', 'appointment')} className={`
                  p-3 sm:p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300
                  ${formData.requestType === 'appointment' ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary hover:shadow-md'}
                `}>
                <div className="text-center">
                  <Camera className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 text-primary" />
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3 text-foreground">{t('form.steps.type.appointment.title')}</h3>
                  <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4">
                    {t('form.steps.type.appointment.description')}
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2 text-left">
                    {(t('form.steps.type.appointment.features', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {formData.requestType === 'appointment' && <div className="grid md:grid-cols-2 gap-4 sm:gap-6 bg-card p-4 sm:p-6 rounded-xl border border-border">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('form.steps.type.preferredDate')}
                  </label>
                  <input type="date" value={formData.preferredDate} onChange={e => updateFormData('preferredDate', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('form.steps.type.preferredTime')}
                  </label>
                  <select value={formData.preferredTime} onChange={e => updateFormData('preferredTime', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
                    <option value="">{t('form.steps.type.selectTime')}</option>
                    {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>}
          </div>;
      case 2:
        // Sélection des dommages
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Car className="w-12 h-12 sm:w-20 sm:h-20 text-primary mb-4 sm:mb-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.damages.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">{t('form.steps.damages.subtitle')}</p>
            </div>

            <CarDamageSelector 
              ref={carSelectorRef}
              selectedAreas={formData.selectedDamages} 
              onAreaSelect={handleDamageSelect} 
            />

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                {t('form.steps.damages.description')}
              </label>
              <textarea value={formData.description} onChange={e => updateFormData('description', e.target.value)} rows={4} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none" placeholder={t('form.steps.damages.placeholder')} />
            </div>
          </div>;
      case 3:
        // Photos documents
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Image className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">4</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.photos.documents.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">{t('form.steps.photos.documents.subtitle')}</p>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <PhotoUpload 
                label={t('form.steps.photos.documents.registration.label')} 
                description={t('form.steps.photos.documents.registration.description')} 
                photos={formData.photos.registration} 
                onPhotosChange={photos => updatePhotos('registration', photos)} 
                maxFiles={1} 
                showDocumentExamples={true} 
                documentType="carte-grise" 
              />

              <PhotoUpload 
                label={t('form.steps.photos.documents.mileage.label')} 
                description={t('form.steps.photos.documents.mileage.description')} 
                photos={formData.photos.mileage} 
                onPhotosChange={photos => updatePhotos('mileage', photos)} 
                maxFiles={1} 
                showDocumentExamples={true} 
                documentType="compteur" 
              />
            </div>

          </div>;
      case 4:
        // Photos véhicule
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <Camera className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">5</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.photos.vehicle.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">{t('form.steps.photos.vehicle.subtitle')}</p>
            </div>

            <div className="space-y-4 sm:space-y-8">
              <PhotoUpload label={t('form.steps.photos.vehicle.angles.label')} description={t('form.steps.photos.vehicle.angles.description')} photos={formData.photos.vehicleAngles} onPhotosChange={photos => updatePhotos('vehicleAngles', photos)} maxFiles={4} showGuide={true} />

              <PhotoUpload label={t('form.steps.photos.vehicle.damages.label')} description={t('form.steps.photos.vehicle.damages.description')} photos={[...formData.photos.damagePhotosClose, ...formData.photos.damagePhotosFar]} onPhotosChange={photos => {
              const half = Math.ceil(photos.length / 2);
              updatePhotos('damagePhotosClose', photos.slice(0, half));
              updatePhotos('damagePhotosFar', photos.slice(half));
            }} maxFiles={10} showDamageExamples={true} />
            </div>

          </div>;
      case 5:
        // Contact
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <User className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">6</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.contact.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">{t('form.steps.contact.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.steps.contact.firstName')} *
                </label>
                <input type="text" required value={formData.contact.firstName} onChange={e => updateContact('firstName', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.steps.contact.lastName')} *
                </label>
                <input type="text" required value={formData.contact.lastName} onChange={e => updateContact('lastName', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div className="my-0 py-0 px-0 mx-[8px]">
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('form.steps.contact.email')} *
                </label>
                <input type="email" required value={formData.contact.email} onChange={e => updateContact('email', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('form.steps.contact.phone')} *
                </label>
                <input type="tel" required value={formData.contact.phone} onChange={e => updateContact('phone', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t('form.steps.contact.address')}
                </label>
                <input type="text" value={formData.contact.address} onChange={e => updateContact('address', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.steps.contact.city')}
                </label>
                <input type="text" value={formData.contact.city} onChange={e => updateContact('city', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('form.steps.contact.postalCode')}
                </label>
                <input type="text" value={formData.contact.postalCode} onChange={e => updateContact('postalCode', e.target.value)} className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200" />
              </div>
            </div>
          </div>;
      case 6:
        // Récapitulatif
        return <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <div className="relative inline-block">
                <CheckCircle className="w-12 h-12 sm:w-20 sm:h-20 text-primary mx-auto mb-4 sm:mb-6" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">7</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">{t('form.steps.review.heading')}</h2>
              <p className="text-sm sm:text-lg text-muted-foreground">{t('form.steps.review.subtitle')}</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-card p-4 sm:p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('form.review.requestType')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {formData.requestType === 'quote' ? t('form.requestType.quote') : t('form.requestType.appointment')}
                </p>
                {formData.requestType === 'appointment' && formData.preferredDate && <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {t('form.review.preferredDate')}: {formData.preferredDate} {formData.preferredTime && `${t('form.review.at')} ${formData.preferredTime}`}
                  </p>}
              </div>

              <div className="bg-gradient-card p-4 sm:p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('form.review.contact')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {formData.contact.firstName} {formData.contact.lastName}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{formData.contact.email}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{formData.contact.phone}</p>
              </div>

              <div className="bg-gradient-card p-4 sm:p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('form.review.selectedDamages')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {formData.selectedDamages.length > 0 ? t('form.review.damagesCount', { count: formData.selectedDamages.length }) : t('form.review.noDamages')}
                </p>
              </div>

              <div className="bg-gradient-card p-4 sm:p-6 rounded-2xl shadow-card border border-border/50">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{t('form.review.photosAdded')}</h3>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {t('form.review.documents')}: {formData.photos.registration.length + formData.photos.mileage.length} {t('form.review.photos')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t('form.review.vehicle')}: {formData.photos.vehicleAngles.length + formData.photos.damagePhotosClose.length + formData.photos.damagePhotosFar.length} {t('form.review.photos')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={exportReportPDF} 
                variant="outline" 
                size="lg" 
                className="px-8 sm:px-12 mr-4"
                disabled={false}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t('form.steps.review.exportPdf')}
              </Button>

              <Button onClick={handleSubmit} variant="accent" size="lg" className="px-8 sm:px-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('form.steps.review.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('form.steps.review.submit')}
                  </>
                )}
              </Button>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-elegant border border-border/50 overflow-hidden">
          
          {/* Progress */}
          <div className="px-[11px] bg-slate-100">
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* Content */}
          <div className="p-8 px-[8px] py-0 bg-slate-100">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-3 sm:p-4 bg-muted/30 border-t border-border/50">
            <Button onClick={prevStep} variant="outline" disabled={currentStep === 0} className="text-xs sm:text-sm px-3 py-2 min-w-0">
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {t('common.previous')}
            </Button>
            
            <div className="text-xs sm:text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </div>

            {currentStep < steps.length - 1 ? <Button onClick={nextStep} disabled={!canProceedToNextStep()} className="text-xs sm:text-sm px-3 py-2 min-w-0">
                {t('common.next')}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button> : <div className="min-w-0" />}
          </div>
        </div>
      </div>
    </div>;
};

// Composant principal avec Provider - Version finale fonctionnelle
export const MultiStepForm: React.FC = () => {
  return (
    <FormProvider>
      <div data-theme="corporate" className="min-h-screen">
        <MultiStepFormContent />
      </div>
    </FormProvider>
  );
};