import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  isAnswered = false,
  showCorrectAnswer = false,
  correctAnswer = null 
}) => {
  const getAnswerButtonVariant = (optionKey) => {
    if (showCorrectAnswer) {
      if (optionKey === correctAnswer) return 'success';
      if (optionKey === selectedAnswer && optionKey !== correctAnswer) return 'danger';
      return 'outline';
    }
    return selectedAnswer === optionKey ? 'default' : 'outline';
  };

  const getAnswerButtonIcon = (optionKey) => {
    if (showCorrectAnswer) {
      if (optionKey === correctAnswer) return 'Check';
      if (optionKey === selectedAnswer && optionKey !== correctAnswer) return 'X';
    }
    return selectedAnswer === optionKey ? 'CheckCircle' : null;
  };

  return (
    <div className="bg-card rounded-xl shadow-quiz-card border border-border p-6 sm:p-8 space-y-6 quiz-fade-in">
      {/* Question Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="HelpCircle" size={18} color="var(--color-primary)" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Question
            </span>
          </div>
          {question.difficulty && (
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${question.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                question.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                question.difficulty === 'Hard'? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
              }
            `}>
              {question.difficulty}
            </span>
          )}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground leading-relaxed font-inter">
          {question.text}
        </h2>
        
        {question.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Choose your answer:
        </h3>
        
        <div className="grid gap-3">
          {Object.entries(question.options).map(([key, value]) => (
            <Button
              key={key}
              variant={getAnswerButtonVariant(key)}
              fullWidth
              onClick={() => !showCorrectAnswer && onAnswerSelect(key)}
              disabled={showCorrectAnswer}
              iconName={getAnswerButtonIcon(key)}
              iconPosition="right"
              className={`
                justify-between text-left p-4 h-auto min-h-[60px] quiz-scale-hover
                ${selectedAnswer === key ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                  {key.toUpperCase()}
                </span>
                <span className="text-sm sm:text-base leading-relaxed">
                  {value}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Question Footer */}
      {question.hint && !isAnswered && (
        <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} color="var(--color-accent)" className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Hint:</p>
              <p className="text-sm text-muted-foreground mt-1">{question.hint}</p>
            </div>
          </div>
        </div>
      )}

      {showCorrectAnswer && (
        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">Correct Answer:</p>
              <p className="text-sm text-muted-foreground mt-1">
                {question.options[correctAnswer]} - {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;