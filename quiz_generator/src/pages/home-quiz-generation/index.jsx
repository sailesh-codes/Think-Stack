import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import TopicInputSection from './components/TopicInputSection';
import DifficultySelection from './components/DifficultySelection';
import LoadingState from './components/LoadingState';
import FeaturesPreview from './components/FeaturesPreview';
import ToastNotification from '../../components/ui/ToastNotification';
import useToast from '../../hooks/useToast';
import { generateQuizWithOpenAI, isValidTopic, moderateContent } from '../../services/quizService';

const HomeQuizGeneration = () => {
  const navigate = useNavigate();
  const { toasts, hideToast, success, error, info } = useToast();
  const [currentStep, setCurrentStep] = useState('hero');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleGenerateQuiz = () => {
    setCurrentStep('topic');
  };

  const handleTopicSubmit = async (topic) => {
    // Validate topic
    if (!isValidTopic(topic)) {
      error('Please enter a valid topic (2-100 characters)');
      return;
    }

    // Moderate content
    const isSafe = await moderateContent(topic);
    if (!isSafe) {
      error('This topic contains inappropriate content. Please choose a different topic.');
      return;
    }

    setSelectedTopic(topic);
    setCurrentStep('difficulty');
    info(`Topic selected: ${topic}`);
  };

  const handleDifficultySelect = async (difficulty, topic) => {
    setSelectedDifficulty(difficulty);
    setIsLoading(true);
    setCurrentStep('loading');
    
    info('Generating your personalized quiz...');

    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_vite_openai_api_key') {
        error('OpenAI API key is not configured. Please add your API key to the .env file.');
        setIsLoading(false);
        setCurrentStep('difficulty');
        return;
      }

      // Generate quiz using OpenAI
      const quizData = await generateQuizWithOpenAI(topic, difficulty);
      
      // Check if fallback was used
      if (quizData.isFallback) {
        warning('Using sample questions due to technical issues. Please try again later for AI-generated content.');
      } else {
        success('Quiz generated successfully!');
      }
      
      // Store quiz data in sessionStorage for the quiz interface
      sessionStorage.setItem('currentQuiz', JSON.stringify(quizData));
      
      // Navigate to quiz taking interface
      setTimeout(() => {
        navigate('/quiz-taking-interface');
      }, 1500);
      
    } catch (error) {
      console.error('Error generating quiz:', error);
      setIsLoading(false);
      setCurrentStep('difficulty');
      
      if (error.message && error.message.includes('API key')) {
        error('Invalid OpenAI API key. Please check your API key configuration.');
      } else if (error.message && error.message.includes('quota')) {
        error('OpenAI API quota exceeded. Please check your usage limits.');
      } else {
        error('Failed to generate quiz. Please try again.');
      }
    }
  };

  const resetQuizGeneration = () => {
    setCurrentStep('hero');
    setSelectedTopic('');
    setSelectedDifficulty('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {/* Hero Section */}
          {currentStep === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection 
                onGenerateQuiz={handleGenerateQuiz}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* Topic Input Section */}
          {currentStep === 'topic' && (
            <motion.div
              key="topic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TopicInputSection
                onTopicSubmit={handleTopicSubmit}
                isVisible={currentStep === 'topic'}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* Difficulty Selection */}
          {currentStep === 'difficulty' && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DifficultySelection
                onDifficultySelect={handleDifficultySelect}
                isVisible={currentStep === 'difficulty'}
                selectedTopic={selectedTopic}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* Loading State */}
          {currentStep === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingState
                isVisible={currentStep === 'loading'}
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Preview - Always visible */}
        {currentStep === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <FeaturesPreview />
          </motion.div>
        )}

        {/* Back to Start Button - Show on non-hero steps */}
        {currentStep !== 'hero' && currentStep !== 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 left-6 z-50"
          >
            <button
              onClick={resetQuizGeneration}
              className="bg-card hover:bg-muted border border-border rounded-full p-3 shadow-lg transition-all duration-200 quiz-scale-hover quiz-focus-ring"
              title="Back to start"
            >
              <svg
                className="w-6 h-6 text-card-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </main>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5 2A7.5 7.5 0 0 0 2 9.5c0 5.5 7.5 13.5 7.5 13.5s7.5-8 7.5-13.5A7.5 7.5 0 0 0 9.5 2zm0 10.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-card-foreground font-inter">
                Think Stack
              </span>
            </div>
            
            <p className="text-muted-foreground">
              Empowering learners worldwide with AI-powered, personalized quiz experiences.
            </p>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Think Stack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeQuizGeneration;