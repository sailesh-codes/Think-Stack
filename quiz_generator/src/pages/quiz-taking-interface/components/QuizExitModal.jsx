import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizExitModal = ({ isOpen, onClose, onConfirmExit, onSaveAndExit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 quiz-fade-in">
      <div className="bg-card rounded-xl shadow-quiz-elevation w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground font-inter">
                Exit Quiz?
              </h2>
              <p className="text-sm text-muted-foreground">
                Your progress will be lost
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-muted transition-colors duration-200 quiz-focus-ring"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-card-foreground">
              Are you sure you want to exit this quiz?
            </p>
            <p className="text-sm text-muted-foreground">
              All your current progress and answers will be lost unless you save your progress.
            </p>
          </div>

          {/* Warning Box */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Unsaved Progress
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have answered some questions. Consider saving your progress to continue later.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 quiz-scale-hover"
          >
            Continue Quiz
          </Button>
          
          <Button
            variant="secondary"
            onClick={onSaveAndExit}
            iconName="Save"
            iconPosition="left"
            className="flex-1 quiz-scale-hover"
          >
            Save & Exit
          </Button>
          
          <Button
            variant="danger"
            onClick={onConfirmExit}
            iconName="LogOut"
            iconPosition="left"
            className="flex-1 quiz-scale-hover"
          >
            Exit Without Saving
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizExitModal;