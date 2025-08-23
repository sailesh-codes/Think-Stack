import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onGenerateQuiz, isLoading }) => {
  const motivationalQuotes = [
    "Knowledge is power. Information is liberating.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Education is the most powerful weapon which you can use to change the world.",
    "Learning never exhausts the mind.",
    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-inter leading-tight">
              Generate Your
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Perfect Quiz</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create personalized quizzes on any topic with varying difficulty levels. 
              Challenge yourself and track your progress!
            </p>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-xl shadow-quiz-card border border-border p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <blockquote className="text-lg sm:text-xl text-card-foreground font-medium italic leading-relaxed">
              "{randomQuote}"
            </blockquote>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={onGenerateQuiz}
              disabled={isLoading}
              loading={isLoading}
              iconName="Sparkles"
              iconPosition="left"
              className="quiz-scale-hover text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Generate Quiz
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto pt-8"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">10K+</div>
              <p className="text-sm text-muted-foreground mt-1">Quizzes Generated</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-secondary font-mono">50+</div>
              <p className="text-sm text-muted-foreground mt-1">Topics Available</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent font-mono">95%</div>
              <p className="text-sm text-muted-foreground mt-1">User Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;