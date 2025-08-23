import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DifficultySelection = ({ onDifficultySelect, isVisible, selectedTopic, isLoading }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const difficultyLevels = [
    {
      level: 'Easy',
      icon: 'Smile',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      description: 'Perfect for beginners',
      features: ['Basic concepts', '5-10 questions', 'Multiple choice'],
      estimatedTime: '3-5 min'
    },
    {
      level: 'Medium',
      icon: 'Zap',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      hoverColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      description: 'Good challenge level',
      features: ['Intermediate topics', '10-15 questions', 'Mixed formats'],
      estimatedTime: '5-8 min'
    },
    {
      level: 'Hard',
      icon: 'Flame',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
      description: 'For experienced learners',
      features: ['Advanced concepts', '15-20 questions', 'Complex scenarios'],
      estimatedTime: '8-12 min'
    },
    {
      level: 'Expert',
      icon: 'Crown',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      description: 'Ultimate challenge',
      features: ['Expert level', '20+ questions', 'Critical thinking'],
      estimatedTime: '12-15 min'
    }
  ];

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty.level);
    onDifficultySelect(difficulty.level, selectedTopic);
  };

  if (!isVisible) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Section Header */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-inter">
              Select Difficulty Level
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect challenge level for your 
              <span className="font-semibold text-primary"> {selectedTopic}</span> quiz.
            </p>
          </div>

          {/* Difficulty Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {difficultyLevels.map((difficulty, index) => (
              <motion.div
                key={difficulty.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`
                  relative bg-card border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
                  quiz-scale-hover quiz-focus-ring
                  ${selectedDifficulty === difficulty.level 
                    ? `${difficulty.borderColor} shadow-lg` 
                    : 'border-border hover:border-muted-foreground/30'
                  }
                  ${difficulty.hoverColor}
                `}
                onClick={() => handleDifficultySelect(difficulty)}
              >
                {/* Difficulty Icon & Level */}
                <div className="text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${difficulty.bgColor}`}>
                    <Icon name={difficulty.icon} size={32} className={difficulty.color} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground font-inter">
                      {difficulty.level}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {difficulty.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  {difficulty.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Estimated Time */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">
                      {difficulty.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedDifficulty === difficulty.level && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                  >
                    <Icon name="Check" size={16} color="white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Generate Button */}
          {selectedDifficulty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-8"
            >
              <Button
                variant="default"
                size="lg"
                disabled={isLoading}
                loading={isLoading}
                iconName="Play"
                iconPosition="left"
                className="quiz-scale-hover text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
              </Button>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Not sure which level?</strong> Start with Medium difficulty. 
                  You can always try different levels later to find your perfect challenge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DifficultySelection;