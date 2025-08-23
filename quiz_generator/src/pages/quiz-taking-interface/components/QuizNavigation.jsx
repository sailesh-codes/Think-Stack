import React from 'react';
import Button from '../../../components/ui/Button';

const QuizNavigation = ({
  currentQuestion = 1,
  totalQuestions = 10,
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious = true,
  canGoNext = false,
  isLastQuestion = false,
  isLoading = false,
  selectedAnswer = null
}) => {
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      {/* Question Counter */}
      <div className="text-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
          iconName="ChevronLeft"
          iconPosition="left"
          className="flex-1 quiz-scale-hover"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={!isAnswered || isLoading}
            loading={isLoading}
            iconName="Check"
            iconPosition="right"
            className="flex-1 quiz-scale-hover"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNext}
            disabled={!isAnswered || isLoading}
            loading={isLoading}
            iconName="ChevronRight"
            iconPosition="right"
            className="flex-1 quiz-scale-hover"
          >
            Next Question
          </Button>
        )}
      </div>

      {/* Answer Status */}
      <div className="text-center">
        {isAnswered ? (
          <p className="text-sm text-success flex items-center justify-center space-x-1">
            <span>✓</span>
            <span>Answer selected</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Please select an answer to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation;