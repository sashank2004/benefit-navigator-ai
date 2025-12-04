import { BenefitCategory, Benefit } from '@/data/benefits';

// Simulated AI classification - in production, this would call the Lovable AI Gateway
export async function classifyHealthNeed(userInput: string): Promise<{
  category: BenefitCategory | null;
  confidence: number;
  fallback: boolean;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const input = userInput.toLowerCase();

  // Keywords for classification
  const keywords: Record<BenefitCategory, string[]> = {
    'Dental': ['tooth', 'teeth', 'dental', 'dentist', 'cavity', 'gum', 'braces', 'orthodontic', 'mouth', 'oral', 'wisdom', 'filling', 'root canal', 'crown', 'toothache'],
    'Mental Health': ['stress', 'anxiety', 'depression', 'mental', 'therapy', 'counseling', 'therapist', 'emotional', 'panic', 'mood', 'sleep', 'burnout', 'overwhelmed', 'sad', 'worried'],
    'Vision': ['eye', 'vision', 'glasses', 'contacts', 'sight', 'blind', 'optometrist', 'lens', 'lasik', 'blurry', 'seeing', 'read'],
    'OPD': ['doctor', 'checkup', 'consultation', 'sick', 'fever', 'cold', 'flu', 'infection', 'pain', 'headache', 'stomach', 'general', 'blood test', 'prescription', 'medication'],
  };

  let bestMatch: BenefitCategory | null = null;
  let maxScore = 0;

  for (const [category, words] of Object.entries(keywords) as [BenefitCategory, string[]][]) {
    const score = words.filter(word => input.includes(word)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  // If no keywords match, try to infer from general context
  if (!bestMatch) {
    if (input.includes('hurt') || input.includes('ache') || input.includes('problem')) {
      // Default to OPD for general health concerns
      bestMatch = 'OPD';
      return { category: bestMatch, confidence: 0.5, fallback: true };
    }
    return { category: null, confidence: 0, fallback: true };
  }

  const confidence = Math.min(0.95, 0.6 + maxScore * 0.15);
  return { category: bestMatch, confidence, fallback: false };
}

export async function generateActionPlan(benefit: Benefit, userNeed: string): Promise<{
  steps: { title: string; description: string; timeframe: string }[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const actionPlans: Record<BenefitCategory, { title: string; description: string; timeframe: string }[]> = {
    'Dental': [
      {
        title: 'Schedule an Appointment',
        description: `Contact ${benefit.provider} through the benefits portal or call their helpline. Mention your employee ID to verify coverage.`,
        timeframe: 'Today',
      },
      {
        title: 'Visit the Dentist',
        description: 'Bring your insurance card and ID to your appointment. The dentist will assess your condition and recommend treatment.',
        timeframe: 'Within 1-3 days',
      },
      {
        title: 'Complete Treatment',
        description: 'Follow the recommended treatment plan. Your coverage of ' + benefit.coverage + ' will be applied automatically.',
        timeframe: 'As recommended',
      },
    ],
    'Mental Health': [
      {
        title: 'Request a Counselor Match',
        description: `Use the ${benefit.provider} app or website to browse available therapists. Filter by specialty and availability.`,
        timeframe: 'Today',
      },
      {
        title: 'Book Your First Session',
        description: 'Schedule an initial consultation (virtual or in-person). Sessions are confidential and covered under your plan.',
        timeframe: 'Within 2-5 days',
      },
      {
        title: 'Begin Your Wellness Journey',
        description: `Continue regular sessions using your ${benefit.coverage}. Track progress and adjust frequency as needed.`,
        timeframe: 'Ongoing',
      },
    ],
    'Vision': [
      {
        title: 'Find a Network Provider',
        description: `Search for in-network optometrists on the ${benefit.provider} website. Check reviews and available appointment times.`,
        timeframe: 'Today',
      },
      {
        title: 'Get Your Eye Exam',
        description: 'Complete a comprehensive eye examination. Your exam is fully covered under the plan.',
        timeframe: 'Within 1 week',
      },
      {
        title: 'Order Your Eyewear',
        description: `Choose glasses or contacts using your ${benefit.coverage}. Network discounts apply to frames and lenses.`,
        timeframe: 'After exam',
      },
    ],
    'OPD': [
      {
        title: 'Book a Consultation',
        description: `Schedule with a general practitioner or specialist through ${benefit.provider}. Virtual consultations are available.`,
        timeframe: 'Today',
      },
      {
        title: 'Attend Your Appointment',
        description: 'Describe your symptoms to the doctor. Any prescribed tests or medications are covered under your plan.',
        timeframe: 'Within 1-2 days',
      },
      {
        title: 'Follow Treatment Plan',
        description: `Fill prescriptions at network pharmacies. Your ${benefit.coverage} covers consultations, tests, and medications.`,
        timeframe: 'As prescribed',
      },
    ],
  };

  return { steps: actionPlans[benefit.category] };
}
