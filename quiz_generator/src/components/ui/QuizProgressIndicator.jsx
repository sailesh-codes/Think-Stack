import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuizProgressIndicator = ({ 
  currentQuestion = 1, 
  totalQuestions = 10, 
  onPrevious, 
  onNext, 
  onSubmit,
  onExit,
  canGoPrevious = true,
  canGoNext = true,
  isLastQuestion = false,
  timeRemaining = null,
  quizTitle = "Quiz in Progress"
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Quiz Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 quiz-focus-ring"
              title="Exit quiz"
            >
              <Icon name="X" size={20} />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground font-inter">
                {quizTitle}
              </h1>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground font-mono">
                {currentQuestion} of {totalQuestions}
              </span>
              {timeRemaining && (
                <span className="text-sm font-medium text-warning font-mono">
                  {formatTime(timeRemaining)}
                </span>
              )}
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              iconName="ChevronLeft"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              iconName="ChevronLeft"
              className="sm:hidden quiz-touch-target"
              title="Previous question"
            />

            {isLastQuestion ? (
              <Button
                variant="default"
                size="sm"
                onClick={onSubmit}
                iconName="Check"
                iconPosition="right"
                className="quiz-scale-hover"
              >
                <span className="hidden sm:inline">Submit Quiz</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={onNext}
                  disabled={!canGoNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                  className="hidden sm:flex quiz-scale-hover"
                >
                  Next
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={onNext}
                  disabled={!canGoNext}
                  iconName="ChevronRight"
                  className="sm:hidden quiz-touch-target"
                  title="Next question"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuizProgressIndicator;