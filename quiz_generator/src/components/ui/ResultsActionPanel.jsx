import React from 'react';

import Button from './Button';

const ResultsActionPanel = ({
  score = 0,
  totalQuestions = 10,
  percentage = 0,
  onRetakeQuiz,
  onTryNewTopic,
  onSaveToHistory,
  onShareResults,
  onViewDetailedResults,
  quizTopic = "General Knowledge",
  difficulty = "Medium",
  timeSpent = "5:30",
  isLoading = false
}) => {
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent work! Keep it up! 🌟";
    if (percentage >= 70) return "Great job! You're doing well! 👏";
    if (percentage >= 60) return "Good effort! Room for improvement! 💪";
    return "Keep practicing! You'll get better! 📚";
  };

  const getGradeLevel = () => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6 space-y-6">
      {/* Score Display */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-card-foreground font-inter">
            Quiz Complete!
          </h2>
          <p className="text-muted-foreground">
            {getPerformanceMessage()}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className={`text-4xl font-bold font-mono ${getScoreColor()}`}>
              {score}/{totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Score</p>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold font-mono ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold font-mono ${getScoreColor()}`}>
              {getGradeLevel()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Grade</p>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Topic:</span>
            <span className="font-medium text-card-foreground">{quizTopic}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Difficulty:</span>
            <span className="font-medium text-card-foreground">{difficulty}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Time Spent:</span>
            <span className="font-medium text-card-foreground font-mono">{timeSpent}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="default"
            fullWidth
            onClick={onRetakeQuiz}
            disabled={isLoading}
            iconName="RotateCcw"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Retake Quiz
          </Button>
          
          <Button
            variant="secondary"
            fullWidth
            onClick={onTryNewTopic}
            disabled={isLoading}
            iconName="Plus"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Try New Topic
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onViewDetailedResults}
            disabled={isLoading}
            iconName="BarChart3"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={onSaveToHistory}
            disabled={isLoading}
            iconName="Save"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            <span className="hidden sm:inline">Save to History</span>
            <span className="sm:hidden">Save</span>
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={onShareResults}
            disabled={isLoading}
            iconName="Share2"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            <span className="hidden sm:inline">Share Results</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-card-foreground">{score} of {totalQuestions} correct</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${
              percentage >= 80 ? 'bg-success' : 
              percentage >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {percentage >= 80 
            ? "Ready for a harder challenge? Try increasing the difficulty!" 
            : "Practice makes perfect! Keep learning and improving!"
          }
        </p>
      </div>
    </div>
  );
};

export default ResultsActionPanel;