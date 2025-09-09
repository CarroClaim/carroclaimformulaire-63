export interface FormData {
  requestType: 'quote' | 'appointment' | '';
  selectedDamages: string[];
  photos: {
    registration: File[];
    mileage: File[];
    vehicleAngles: File[];
    damagePhotosClose: File[];
    damagePhotosFar: File[];
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  description: string;
  preferredDate?: string;
  preferredTime?: string;
}

export interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}