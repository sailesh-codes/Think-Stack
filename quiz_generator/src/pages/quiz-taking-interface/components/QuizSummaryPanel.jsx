import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizSummaryPanel = ({ 
  questions = [],
  answers = {},
  onQuestionJump,
  onReviewMode,
  isReviewMode = false,
  currentQuestion = 1
}) => {
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const getQuestionStatus = (index) => {
    const questionNumber = index + 1;
    const isAnswered = answers[questionNumber] !== undefined;
    const isCurrent = questionNumber === currentQuestion;
    
    if (isCurrent) return 'current';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-primary text-primary-foreground';
      case 'answered': return 'bg-success text-success-foreground';
      case 'unanswered': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current': return 'ArrowRight';
      case 'answered': return 'Check';
      case 'unanswered': return 'Circle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground font-inter">
          Quiz Overview
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReviewMode}
          iconName={isReviewMode ? "Eye" : "EyeOff"}
          iconPosition="left"
          className="quiz-scale-hover"
        >
          {isReviewMode ? 'Exit Review' : 'Review Mode'}
        </Button>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success font-mono">
            {answeredCount}
          </div>
          <div className="text-sm text-muted-foreground">
            Answered
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground font-mono">
            {unansweredCount}
          </div>
          <div className="text-sm text-muted-foreground">
            Remaining
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Questions ({questions.length})
        </h4>
        
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
          {questions.map((_, index) => {
            const questionNumber = index + 1;
            const status = getQuestionStatus(index);
            
            return (
              <button
                key={questionNumber}
                onClick={() => onQuestionJump(questionNumber)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                  quiz-focus-ring quiz-scale-hover flex items-center justify-center
                  ${getStatusColor(status)}
                  hover:scale-105
                `}
                title={`Question ${questionNumber} - ${status}`}
              >
                <Icon 
                  name={getStatusIcon(status)} 
                  size={16} 
                  className={status === 'current' ? 'animate-pulse' : ''}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Legend
        </h4>
        
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
              <Icon name="ArrowRight" size={10} color="white" />
            </div>
            <span className="text-muted-foreground">Current</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success rounded flex items-center justify-center">
              <Icon name="Check" size={10} color="white" />
            </div>
            <span className="text-muted-foreground">Answered</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <Icon name="Circle" size={10} />
            </div>
            <span className="text-muted-foreground">Unanswered</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const firstUnanswered = questions.findIndex((_, index) => 
                answers[index + 1] === undefined
              );
              if (firstUnanswered !== -1) {
                onQuestionJump(firstUnanswered + 1);
              }
            }}
            disabled={unansweredCount === 0}
            iconName="SkipForward"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Next Unanswered
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuestionJump(1)}
            iconName="RotateCcw"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSummaryPanel;