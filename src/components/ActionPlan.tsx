import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Benefit, categoryColors } from '@/data/benefits';
import { generateActionPlan } from '@/services/aiService';

interface ActionPlanProps {
  benefit: Benefit;
  userNeed: string;
  onBack: () => void;
  onStartOver: () => void;
}

interface Step {
  title: string;
  description: string;
  timeframe: string;
}

export function ActionPlan({ benefit, userNeed, onBack, onStartOver }: ActionPlanProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      const result = await generateActionPlan(benefit, userNeed);
      setSteps(result.steps);
    } catch (error) {
      console.error('Error generating action plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await fetchPlan();
    setIsRegenerating(false);
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
                <p className="text-sm text-muted-foreground">AI-generated steps to get started</p>
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
              {[1, 2, 3].map((i) => (
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
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
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
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
