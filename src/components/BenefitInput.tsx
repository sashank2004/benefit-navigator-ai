import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Brain, Eye, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BenefitInputProps {
  onSubmit: (input: string) => void;
}

const suggestions = [
  { text: 'I have a toothache', icon: '🦷' },
  { text: 'Feeling stressed lately', icon: '😰' },
  { text: 'Need new glasses', icon: '👓' },
  { text: 'Schedule a checkup', icon: '🩺' },
];

export function BenefitInput({ onSubmit }: BenefitInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    onSubmit(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Benefits Discovery</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          How can we help you today?
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Describe your health concern and we'll find the perfect benefits for you.
        </p>
      </motion.div>

      {/* Category Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-6 mb-10"
      >
        {[
          { icon: Heart, color: 'text-benefit-dental', bg: 'bg-benefit-dental/10' },
          { icon: Brain, color: 'text-benefit-mental', bg: 'bg-benefit-mental/10' },
          { icon: Eye, color: 'text-benefit-vision', bg: 'bg-benefit-vision/10' },
          { icon: Stethoscope, color: 'text-benefit-opd', bg: 'bg-benefit-opd/10' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
            className={`p-3 rounded-2xl ${item.bg}`}
          >
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl"
      >
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I have tooth pain, what can I do?"
            className="min-h-[140px] text-lg p-6 pr-24 resize-none rounded-2xl shadow-card border-2 border-transparent focus:border-primary/30 transition-all"
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="absolute bottom-4 right-4 rounded-xl px-6 gap-2"
            size="lg"
          >
            Discover
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.form>

      {/* Quick Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick suggestions</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card shadow-soft hover:shadow-card transition-all border border-border/50"
            >
              <span>{suggestion.icon}</span>
              <span className="text-sm font-medium text-foreground">{suggestion.text}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
