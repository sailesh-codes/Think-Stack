import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreDisplay = ({ 
  score = 8, 
  totalQuestions = 10, 
  percentage = 80, 
  timeSpent = "5:30",
  difficulty = "Medium",
  topic = "World Capitals"
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
    <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6 lg:p-8">
      {/* Celebratory Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-card-foreground font-inter">
            Quiz Complete!
          </h1>
          <p className="text-lg text-muted-foreground">
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Main Score Display */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-8">
          <div className="text-center">
            <div className={`text-5xl lg:text-6xl font-bold font-mono ${getScoreColor()}`}>
              {score}/{totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Questions Correct</p>
          </div>
          
          <div className="text-center">
            <div className={`text-5xl lg:text-6xl font-bold font-mono ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className={`text-5xl lg:text-6xl font-bold font-mono ${getScoreColor()}`}>
              {getGradeLevel()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Grade</p>
          </div>
        </div>
      </div>

      {/* Quiz Details */}
      <div className="bg-muted rounded-lg p-4 lg:p-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between sm:flex-col sm:text-center">
            <span className="text-muted-foreground flex items-center gap-2">
              <Icon name="BookOpen" size={16} />
              Topic
            </span>
            <span className="font-medium text-card-foreground">{topic}</span>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:text-center">
            <span className="text-muted-foreground flex items-center gap-2">
              <Icon name="Target" size={16} />
              Difficulty
            </span>
            <span className="font-medium text-card-foreground">{difficulty}</span>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:text-center">
            <span className="text-muted-foreground flex items-center gap-2">
              <Icon name="Clock" size={16} />
              Time Spent
            </span>
            <span className="font-medium text-card-foreground font-mono">{timeSpent}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 space-y-2">
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
    </div>
  );
};

export default ScoreDisplay;