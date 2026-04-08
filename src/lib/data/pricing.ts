export type PlanCycle = 'one-time' | 'quarterly' | 'monthly';

export type ServicePlan = {
  id: PlanCycle;
  name: string;
  headline: string;
  recurringText: string;
  recommendedPrice: number;
  discount?: number;
  description: string;
  includedFeatures: string[];
  badge?: string;
};

export const servicePlans: ServicePlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    headline: 'Keep your car at its best with priority scheduling and best value.',
    recurringText: 'Every month',
    recommendedPrice: 175,
    discount: 100,
    description: 'Best value plan for people who want dependable car care and best monthly savings.',
    includedFeatures: [
      '2-3 hour detail duration',
      'Interior detailing + carpet shampooing',
      'Hand wash and full wheel cleaning',
      'Interior vacuum and glass cleaning',
      'Complimentary ceramic wax'
    ],
    badge: 'Save $100 every visit'
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    headline: 'Keep your car consistently polished with scheduled care every three months.',
    recurringText: 'Every 3 months',
    recommendedPrice: 225,
    discount: 50,
    description: 'Recurring plan with savings and steady maintenance for daily drivers.',
    includedFeatures: [
      '2-3 hour detail duration',
      'Interior detailing + carpet shampooing',
      'Hand wash and full wheel cleaning',
      'Interior vacuum and glass cleaning',
      'Complimentary ceramic wax'
    ],
    badge: 'Save $50 every visit'
  },
  {
    id: 'one-time',
    name: 'One-Time',
    headline: 'One complete interior and exterior detail, no commitment required.',
    recurringText: 'One-time detail',
    recommendedPrice: 275,
    description: 'Great for people who need a deep refresh or are testing service quality first.',
    includedFeatures: [
      '2-3 hour detail duration',
      'Interior detailing + carpet shampooing',
      'Hand wash and full wheel cleaning',
      'Interior vacuum and glass cleaning',
      'Complimentary ceramic wax'
    ]
  }
];

export const baseServiceHours = '2-3 hours';
export const fallbackModelPrice = 275;
