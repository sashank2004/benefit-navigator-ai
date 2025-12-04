import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Benefit, categoryColors } from '@/data/benefits';

interface BenefitCardProps {
  benefit: Benefit;
  index: number;
  onSelect: (benefit: Benefit) => void;
}

export function BenefitCard({ benefit, index, onSelect }: BenefitCardProps) {
  const colorClass = categoryColors[benefit.category];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(benefit)}
      className="w-full text-left bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all border border-border/50 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-${colorClass}/10`}
          style={{ backgroundColor: `hsl(var(--${colorClass.replace('benefit-', 'benefit-')}) / 0.1)` }}
        >
          {benefit.icon}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{benefit.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Coverage</p>
          <p className="font-semibold text-primary">{benefit.coverage}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Provider</p>
          <p className="text-sm font-medium text-foreground">{benefit.provider}</p>
        </div>
      </div>
    </motion.button>
  );
}
