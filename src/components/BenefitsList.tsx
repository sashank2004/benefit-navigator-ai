import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BenefitCard } from '@/components/BenefitCard';
import { Benefit, BenefitCategory, categoryIcons } from '@/data/benefits';

interface BenefitsListProps {
  category: BenefitCategory;
  benefits: Benefit[];
  userInput: string;
  onSelectBenefit: (benefit: Benefit) => void;
  onBack: () => void;
  onRetry: () => void;
  isFallback: boolean;
  reasoning?: string;
  suggestions?: string[];
}

export function BenefitsList({
  category,
  benefits,
  userInput,
  onSelectBenefit,
  onBack,
  onRetry,
  isFallback,
  reasoning,
  suggestions,
}: BenefitsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
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
            Start over
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl"
            >
              {categoryIcons[category]}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category} Benefits</h1>
              <p className="text-muted-foreground">Based on: "{userInput}"</p>
            </div>
          </div>

          {/* AI Reasoning */}
          {reasoning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Analysis</span>
              </div>
              <p className="text-sm text-foreground">{reasoning}</p>
            </motion.div>
          )}

          {/* Related Questions */}
          {suggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-sm text-muted-foreground mb-2">You might also want to ask:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fallback Warning */}
          {isFallback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-foreground">
                We couldn't find an exact match. Here are some related benefits that might help.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="ml-auto gap-2 text-accent hover:text-accent"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={index}
              onSelect={onSelectBenefit}
            />
          ))}
        </div>

        {/* Empty State */}
        {benefits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground mb-4">No benefits found for this category.</p>
            <Button onClick={onBack}>Try a different search</Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
