import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuizProgressIndicator from '../../components/ui/QuizProgressIndicator';
import QuestionCard from './components/QuestionCard';
import QuizTimer from './components/QuizTimer';
import QuizNavigation from './components/QuizNavigation';
import QuizExitModal from './components/QuizExitModal';
import QuizSummaryPanel from './components/QuizSummaryPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const QuizTakingInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get quiz data from navigation state or use mock data
  const quizData = location.state?.quizData || {
    topic: "World Geography",
    difficulty: "Medium",
    timeLimit: 600, // 10 minutes
    questions: [
      {
        id: 1,
        text: "What is the capital city of Australia?",
        options: {
          a: "Sydney",
          b: "Melbourne", 
          c: "Canberra",
          d: "Perth"
        },
        correctAnswer: "c",
        difficulty: "Medium",
        hint: "It's not the largest city in Australia.",
        explanation: "Canberra is the capital city of Australia, located in the Australian Capital Territory."
      },
      {
        id: 2,
        text: "Which river is the longest in the world?",
        options: {
          a: "Amazon River",
          b: "Nile River",
          c: "Yangtze River", 
          d: "Mississippi River"
        },
        correctAnswer: "b",
        difficulty: "Easy",
        explanation: "The Nile River in Africa is generally considered the longest river in the world at approximately 6,650 kilometers."
      },
      {
        id: 3,
        text: "Mount Everest is located on the border between which two countries?",
        options: {
          a: "India and China",
          b: "Nepal and India",
          c: "Nepal and China",
          d: "Bhutan and China"
        },
        correctAnswer: "c",
        difficulty: "Medium",
        hint: "One country is known for Sherpas, the other is the most populous country in the world.",
        explanation: "Mount Everest sits on the border between Nepal and China (Tibet Autonomous Region)."
      },
      {
        id: 4,
        text: "Which desert is the largest in the world by area?",
        options: {
          a: "Sahara Desert",
          b: "Arabian Desert",
          c: "Gobi Desert",
          d: "Antarctica"
        },
        correctAnswer: "d",
        difficulty: "Hard",
        explanation: "Antarctica is technically the world's largest desert, as it receives very little precipitation and is classified as a polar desert."
      },
      {
        id: 5,
        text: "The Great Barrier Reef is located off the coast of which country?",
        options: {
          a: "New Zealand",
          b: "Australia", 
          c: "Philippines",
          d: "Indonesia"
        },
        correctAnswer: "b",
        difficulty: "Easy",
        explanation: "The Great Barrier Reef is located in the Coral Sea, off the coast of Queensland, Australia."
      }
    ]
  };

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const totalQuestions = quizData.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const selectedAnswer = answers[currentQuestionNumber];

  // Auto-save progress to localStorage
  useEffect(() => {
    const progressData = {
      quizData,
      currentQuestionIndex,
      answers,
      timeRemaining,
      timestamp: Date.now()
    };
    localStorage.setItem('quiz-progress', JSON.stringify(progressData));
  }, [currentQuestionIndex, answers, timeRemaining, quizData]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('quiz-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        // Only restore if it's the same quiz and within 24 hours
        if (progress.quizData.topic === quizData.topic && 
            Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
          setCurrentQuestionIndex(progress.currentQuestionIndex);
          setAnswers(progress.answers);
          setTimeRemaining(progress.timeRemaining);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  const handleAnswerSelect = (answerKey) => {
    if (isReviewMode) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestionNumber]: answerKey
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuestionJump = (questionNumber) => {
    setCurrentQuestionIndex(questionNumber - 1);
    setShowSummaryPanel(false);
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setIsTimerActive(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate results
      const results = {
        answers,
        quizData,
        score: Object.entries(answers).reduce((score, [questionNum, answer]) => {
          const question = quizData.questions[parseInt(questionNum) - 1];
          return score + (question.correctAnswer === answer ? 1 : 0);
        }, 0),
        totalQuestions,
        timeSpent: quizData.timeLimit - timeRemaining,
        completedAt: new Date().toISOString()
      };
      
      // Clear saved progress
      localStorage.removeItem('quiz-progress');
      
      // Navigate to results
      navigate('/quiz-results-scoring', { 
        state: { results },
        replace: true 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      setIsTimerActive(true);
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    handleSubmitQuiz();
  };

  const handleExitQuiz = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    localStorage.removeItem('quiz-progress');
    navigate('/home-quiz-generation');
  };

  const handleSaveAndExit = () => {
    // Progress is already auto-saved
    navigate('/home-quiz-generation');
  };

  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = selectedAnswer !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Quiz Progress Header */}
      <QuizProgressIndicator
        currentQuestion={currentQuestionNumber}
        totalQuestions={totalQuestions}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmitQuiz}
        onExit={handleExitQuiz}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isLastQuestion={isLastQuestion}
        timeRemaining={timeRemaining}
        quizTitle={`${quizData.topic} Quiz`}
      />

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quiz Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quiz Info Bar */}
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="BookOpen" size={18} color="var(--color-primary)" />
                      <span className="font-medium text-card-foreground">
                        {quizData.topic}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Target" size={18} color="var(--color-secondary)" />
                      <span className="text-sm text-muted-foreground">
                        {quizData.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSummaryPanel(!showSummaryPanel)}
                      iconName="BarChart3"
                      iconPosition="left"
                      className="quiz-scale-hover"
                    >
                      <span className="hidden sm:inline">Overview</span>
                      <span className="sm:hidden">Stats</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onAnswerSelect={handleAnswerSelect}
                    isAnswered={selectedAnswer !== null}
                    showCorrectAnswer={isReviewMode}
                    correctAnswer={currentQuestion.correctAnswer}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <QuizNavigation
                currentQuestion={currentQuestionNumber}
                totalQuestions={totalQuestions}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmitQuiz}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                isLastQuestion={isLastQuestion}
                isLoading={isSubmitting}
                selectedAnswer={selectedAnswer}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Timer */}
              <QuizTimer
                initialTime={quizData.timeLimit}
                onTimeUp={handleTimeUp}
                isActive={isTimerActive}
                showWarning={true}
                warningThreshold={60}
              />

              {/* Summary Panel */}
              {showSummaryPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuizSummaryPanel
                    questions={quizData.questions}
                    answers={answers}
                    onQuestionJump={handleQuestionJump}
                    onReviewMode={() => setIsReviewMode(!isReviewMode)}
                    isReviewMode={isReviewMode}
                    currentQuestion={currentQuestionNumber}
                  />
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h4 className="font-medium text-card-foreground">Quick Stats</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Answered:</span>
                    <span className="font-medium text-success">
                      {Object.keys(answers).length}/{totalQuestions}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium text-primary">
                      {Math.round((currentQuestionNumber / totalQuestions) * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Used:</span>
                    <span className="font-medium text-warning font-mono">
                      {Math.floor((quizData.timeLimit - timeRemaining) / 60)}:
                      {((quizData.timeLimit - timeRemaining) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      <QuizExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
        onSaveAndExit={handleSaveAndExit}
      />
    </div>
  );
};

export default QuizTakingInterface;