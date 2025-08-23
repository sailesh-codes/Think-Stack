import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingState = ({ isVisible, selectedTopic, selectedDifficulty }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const loadingMessages = [
    `Analyzing "${selectedTopic}" topic...`,
    `Generating ${selectedDifficulty?.toLowerCase()} level questions...`,
    'Crafting engaging multiple choice options...',
    'Adding detailed explanations...',
    'Finalizing your personalized quiz...'
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => 
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [isVisible, loadingMessages.length]);

  if (!isVisible) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="relative">
            {/* Spinning Circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto border-4 border-primary/20 border-t-primary rounded-full"
            />
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Brain" size={32} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-foreground font-inter"
          >
            Generating Your Quiz
          </motion.h2>

          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl shadow-quiz-card border border-border p-6"
          >
            <p className="text-lg text-card-foreground">
              {loadingMessages[currentMessageIndex]}{dots}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: index <= currentMessageIndex ? 1 : 0.8,
                  opacity: index <= currentMessageIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                className={`w-3 h-3 rounded-full ${
                  index <= currentMessageIndex 
                    ? 'bg-primary' :'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-muted/50 rounded-lg p-4 max-w-lg mx-auto"
          >
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Did you know?</strong> AI-generated quizzes are personalized 
                  to match your chosen topic and difficulty level, ensuring an optimal learning experience!
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-sm text-muted-foreground"
          >
            This usually takes 10-30 seconds. Thanks for your patience!
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default LoadingState;