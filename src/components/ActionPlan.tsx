import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle2, Clock, Sparkles, Lightbulb, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Benefit, categoryColors } from '@/data/benefits';
import { generateActionPlan, ActionPlanResult } from '@/services/aiService';
import { toast } from 'sonner';

interface ActionPlanProps {
  benefit: Benefit;
  userNeed: string;
  onBack: () => void;
  onStartOver: () => void;
}

export function ActionPlan({ benefit, userNeed, onBack, onStartOver }: ActionPlanProps) {
  const [plan, setPlan] = useState<ActionPlanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      const result = await generateActionPlan(benefit, userNeed);
      setPlan(result);
    } catch (error) {
      console.error('Error generating action plan:', error);
      toast.error('Failed to generate action plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    toast.info('Generating a new action plan...');
    await fetchPlan();
    setIsRegenerating(false);
    toast.success('Action plan regenerated!');
  };

  useEffect(() => {
    fetchPlan();
  }, [benefit.id]);

  const colorClass = categoryColors[benefit.category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to benefits
          </Button>

          {/* Benefit Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card mb-8"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `hsl(var(--${colorClass.replace('benefit-', 'benefit-')}) / 0.1)` }}
              >
                {benefit.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-1">{benefit.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">{benefit.provider}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {benefit.coverage}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Plan Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Your Action Plan</h1>
                <p className="text-sm text-muted-foreground">AI-generated steps personalized for your needs</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isLoading || isRegenerating}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </motion.div>

        {/* AI Summary */}
        {!isLoading && plan?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Summary</span>
            </div>
            <p className="text-foreground">{plan.summary}</p>
          </motion.div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-muted-foreground">AI is creating your personalized action plan...</span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-muted animate-pulse-soft"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {plan?.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < (plan?.steps.length || 0) - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-border" />
                  )}

                  <div className="flex gap-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                        className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center"
                      >
                        <span className="text-lg font-bold text-primary-foreground">{index + 1}</span>
                      </motion.div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-card rounded-2xl p-5 shadow-soft border border-border/50">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{step.timeframe}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      
                      {/* Tips */}
                      {step.tips && step.tips.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-medium text-accent">Tips</span>
                          </div>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-accent">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Important Notes */}
        {!isLoading && plan?.importantNotes && plan.importantNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Important Notes</span>
            </div>
            <ul className="space-y-2">
              {plan.importantNotes.map((note, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Footer Actions */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button className="flex-1 gap-2" size="lg">
              <CheckCircle2 className="w-5 h-5" />
              Start My Plan
            </Button>
            <Button
              variant="outline"
              onClick={onStartOver}
              className="flex-1"
              size="lg"
            >
              Discover More Benefits
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
