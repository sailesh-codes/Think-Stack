import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  onRetakeQuiz,
  onSaveToHistory,
  quizData = {}
}) => {
  const navigate = useNavigate();

  const handleRetakeQuiz = () => {
    if (onRetakeQuiz) {
      onRetakeQuiz();
    } else {
      navigate('/quiz-taking-interface');
    }
  };

  const handleTryNewTopic = () => {
    navigate('/home-quiz-generation');
  };

  const handleSaveToHistory = () => {
    if (onSaveToHistory) {
      onSaveToHistory(quizData);
    }
    // Mock save to localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    const newQuiz = {
      id: Date.now(),
      ...quizData,
      completedAt: new Date().toISOString()
    };
    savedQuizzes.unshift(newQuiz);
    localStorage.setItem('quizHistory', JSON.stringify(savedQuizzes.slice(0, 50))); // Keep last 50
  };

  const handleViewHistory = () => {
    navigate('/quiz-results-scoring');
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-xl font-bold text-card-foreground font-inter mb-4">
          What's Next?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="default"
            fullWidth
            onClick={handleRetakeQuiz}
            iconName="RotateCcw"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Retake This Quiz
          </Button>
          
          <Button
            variant="secondary"
            fullWidth
            onClick={handleTryNewTopic}
            iconName="Plus"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Try New Topic
          </Button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-xl font-bold text-card-foreground font-inter mb-4">
          Save & Track Progress
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={handleSaveToHistory}
            iconName="Save"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Save Results
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={handleViewHistory}
            iconName="History"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            View History
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/features-overview')}
            iconName="Sparkles"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Explore Features
          </Button>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10 p-6">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-card-foreground">
            Keep Learning & Growing! 🚀
          </h3>
          <p className="text-muted-foreground">
            Every quiz makes you smarter. Challenge yourself with different topics and difficulty levels.
          </p>
          <div className="pt-2">
            <Button
              variant="default"
              onClick={handleTryNewTopic}
              iconName="ArrowRight"
              iconPosition="right"
              className="quiz-scale-hover"
            >
              Start New Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;