export type BenefitCategory = 'Dental' | 'Mental Health' | 'Vision' | 'OPD';

export interface Benefit {
  id: string;
  title: string;
  category: BenefitCategory;
  coverage: string;
  description: string;
  provider: string;
  icon: string;
}

export const benefits: Benefit[] = [
  {
    id: 'dental-1',
    title: 'Comprehensive Dental Care',
    category: 'Dental',
    coverage: 'Up to $2,000/year',
    description: 'Full coverage for preventive care, basic procedures, and major dental work including orthodontics.',
    provider: 'DentaCare Plus',
    icon: '🦷',
  },
  {
    id: 'dental-2',
    title: 'Emergency Dental Network',
    category: 'Dental',
    coverage: 'Up to $1,500/year',
    description: 'Access to 24/7 emergency dental services with same-day appointments at network clinics.',
    provider: 'QuickSmile Network',
    icon: '🏥',
  },
  {
    id: 'mental-1',
    title: 'Mental Wellness Program',
    category: 'Mental Health',
    coverage: '12 sessions/year',
    description: 'Confidential counseling sessions with licensed therapists, both in-person and virtual options.',
    provider: 'MindCare Partners',
    icon: '🧠',
  },
  {
    id: 'mental-2',
    title: 'Employee Assistance Program',
    category: 'Mental Health',
    coverage: 'Unlimited access',
    description: 'Free access to mental health resources, stress management tools, and crisis support line.',
    provider: 'WellBeing Corp',
    icon: '💚',
  },
  {
    id: 'vision-1',
    title: 'Vision Care Essential',
    category: 'Vision',
    coverage: 'Up to $400/year',
    description: 'Annual eye exams, prescription glasses or contacts, and discounts on LASIK procedures.',
    provider: 'ClearSight Insurance',
    icon: '👁️',
  },
  {
    id: 'vision-2',
    title: 'Premium Vision Plus',
    category: 'Vision',
    coverage: 'Up to $600/year',
    description: 'Enhanced coverage including designer frames, specialty lenses, and vision therapy.',
    provider: 'VisionFirst',
    icon: '👓',
  },
  {
    id: 'opd-1',
    title: 'Outpatient Care Coverage',
    category: 'OPD',
    coverage: 'Up to $3,000/year',
    description: 'Coverage for doctor consultations, diagnostic tests, minor procedures, and medications.',
    provider: 'HealthGuard',
    icon: '🩺',
  },
  {
    id: 'opd-2',
    title: 'Specialist Consultation Plan',
    category: 'OPD',
    coverage: 'Up to $2,500/year',
    description: 'Direct access to specialist consultations without referral requirements.',
    provider: 'MedAccess Pro',
    icon: '👨‍⚕️',
  },
];

export const categoryColors: Record<BenefitCategory, string> = {
  'Dental': 'benefit-dental',
  'Mental Health': 'benefit-mental',
  'Vision': 'benefit-vision',
  'OPD': 'benefit-opd',
};

export const categoryIcons: Record<BenefitCategory, string> = {
  'Dental': '🦷',
  'Mental Health': '🧠',
  'Vision': '👁️',
  'OPD': '🩺',
};
