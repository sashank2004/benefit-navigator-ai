import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BenefitInput } from '@/components/BenefitInput';
import { LoadingClassification } from '@/components/LoadingClassification';
import { BenefitsList } from '@/components/BenefitsList';
import { ActionPlan } from '@/components/ActionPlan';
import { NoMatch } from '@/components/NoMatch';
import { benefits, Benefit, BenefitCategory } from '@/data/benefits';
import { classifyHealthNeed } from '@/services/aiService';

type Screen = 'input' | 'loading' | 'benefits' | 'action-plan' | 'no-match';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [userInput, setUserInput] = useState('');
  const [classifiedCategory, setClassifiedCategory] = useState<BenefitCategory | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const handleInputSubmit = async (input: string) => {
    setUserInput(input);
    setCurrentScreen('loading');

    try {
      const result = await classifyHealthNeed(input);

      if (result.category) {
        setClassifiedCategory(result.category);
        setIsFallback(result.fallback);
        setCurrentScreen('benefits');
      } else {
        setCurrentScreen('no-match');
      }
    } catch (error) {
      console.error('Classification error:', error);
      setCurrentScreen('no-match');
    }
  };

  const handleSelectBenefit = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setCurrentScreen('action-plan');
  };

  const handleBackToBenefits = () => {
    setCurrentScreen('benefits');
  };

  const handleStartOver = () => {
    setUserInput('');
    setClassifiedCategory(null);
    setSelectedBenefit(null);
    setIsFallback(false);
    setCurrentScreen('input');
  };

  const handleRetry = () => {
    handleInputSubmit(userInput);
  };

  const filteredBenefits = classifiedCategory
    ? benefits.filter((b) => b.category === classifiedCategory)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentScreen === 'input' && (
          <BenefitInput key="input" onSubmit={handleInputSubmit} />
        )}

        {currentScreen === 'loading' && (
          <LoadingClassification key="loading" userInput={userInput} />
        )}

        {currentScreen === 'benefits' && classifiedCategory && (
          <BenefitsList
            key="benefits"
            category={classifiedCategory}
            benefits={filteredBenefits}
            userInput={userInput}
            onSelectBenefit={handleSelectBenefit}
            onBack={handleStartOver}
            onRetry={handleRetry}
            isFallback={isFallback}
          />
        )}

        {currentScreen === 'action-plan' && selectedBenefit && (
          <ActionPlan
            key="action-plan"
            benefit={selectedBenefit}
            userNeed={userInput}
            onBack={handleBackToBenefits}
            onStartOver={handleStartOver}
          />
        )}

        {currentScreen === 'no-match' && (
          <NoMatch
            key="no-match"
            userInput={userInput}
            onRetry={handleRetry}
            onBack={handleStartOver}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
