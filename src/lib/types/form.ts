export type PlanType = 'one-time' | 'quarterly' | 'monthly';

export type LeadFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  plan: PlanType;
  preferredStartDate: string;
  preferredEndDate: string;
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
  address: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  plan: 'quarterly',
  preferredStartDate: '',
  preferredEndDate: '',
  message: '',
  bestContactTime: '',
  includeCeramicWax: true,
  includeWheelCleaning: true,
  includeCarpetShampoo: true,
  includeInteriorDetailing: true,
  includeInteriorVacuum: true
};
