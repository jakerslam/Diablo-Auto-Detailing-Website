export type PlanType = 'one-time' | 'quarterly' | 'monthly';

export type LeadFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  zip: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  plan: PlanType;
  preferredWindow: string;
  message: string;
  bestContactTime: string;
  includeCeramicWax: boolean;
  includeWheelCleaning: boolean;
  includeCarpetShampoo: boolean;
  includeInteriorDetailing: boolean;
  includeInteriorVacuum: boolean;
};

export const emptyLeadForm: LeadFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  zip: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  plan: 'one-time',
  preferredWindow: '',
  message: '',
  bestContactTime: '',
  includeCeramicWax: true,
  includeWheelCleaning: true,
  includeCarpetShampoo: true,
  includeInteriorDetailing: true,
  includeInteriorVacuum: true
};
