import { BenefitCategory, Benefit } from '@/data/benefits';
import { supabase } from '@/integrations/supabase/client';

export interface ClassificationResult {
  category: BenefitCategory | null;
  confidence: number;
  fallback: boolean;
  reasoning?: string;
  suggestions?: string[];
}

export interface ActionStep {
  title: string;
  description: string;
  timeframe: string;
  tips?: string[];
}

export interface ActionPlanResult {
  steps: ActionStep[];
  summary?: string;
  importantNotes?: string[];
}

export async function classifyHealthNeed(userInput: string): Promise<ClassificationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('benefits-ai', {
      body: { action: 'classify', userInput }
    });

    if (error) {
      console.error('Classification error:', error);
      throw error;
    }

    if (data.error) {
      console.error('AI error:', data.error);
      throw new Error(data.error);
    }

    return {
      category: data.category as BenefitCategory | null,
      confidence: data.confidence || 0,
      fallback: data.fallback || false,
      reasoning: data.reasoning,
      suggestions: data.suggestions
    };
  } catch (error) {
    console.error('Failed to classify health need:', error);
    // Return fallback response
    return {
      category: null,
      confidence: 0,
      fallback: true
    };
  }
}

export async function generateActionPlan(benefit: Benefit, userNeed: string): Promise<ActionPlanResult> {
  try {
    const { data, error } = await supabase.functions.invoke('benefits-ai', {
      body: { 
        action: 'action-plan', 
        benefit: {
          title: benefit.title,
          category: benefit.category,
          coverage: benefit.coverage,
          provider: benefit.provider,
          description: benefit.description
        },
        userNeed 
      }
    });

    if (error) {
      console.error('Action plan error:', error);
      throw error;
    }

    if (data.error) {
      console.error('AI error:', data.error);
      throw new Error(data.error);
    }

    return {
      steps: data.steps || [],
      summary: data.summary,
      importantNotes: data.importantNotes
    };
  } catch (error) {
    console.error('Failed to generate action plan:', error);
    // Return fallback action plan
    return {
      steps: [
        {
          title: 'Contact Provider',
          description: `Reach out to ${benefit.provider} through the benefits portal or call their helpline.`,
          timeframe: 'Today',
        },
        {
          title: 'Schedule Appointment',
          description: 'Book an appointment with an in-network provider at your convenience.',
          timeframe: 'Within 1-3 days',
        },
        {
          title: 'Prepare Documents',
          description: 'Bring your employee ID and insurance card to your appointment.',
          timeframe: 'Before appointment',
        },
        {
          title: 'Complete Treatment',
          description: `Follow the recommended treatment plan. Your coverage of ${benefit.coverage} will be applied.`,
          timeframe: 'As recommended',
        },
      ],
      summary: "We're here to help you access your benefits!",
      importantNotes: ['Keep all receipts for reimbursement purposes']
    };
  }
}
