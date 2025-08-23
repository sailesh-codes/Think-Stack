import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ 
  totalQuestions = 10,
  correctAnswers = 8,
  incorrectAnswers = 2,
  timeSpent = "5:30",
  averageTimePerQuestion = "33s",
  streak = 4,
  difficulty = "Medium"
}) => {
  const metrics = [
    {
      label: "Total Questions",
      value: totalQuestions,
      icon: "FileText",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Correct Answers",
      value: correctAnswers,
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Incorrect Answers",
      value: incorrectAnswers,
      icon: "XCircle",
      color: "text-error",
      bgColor: "bg-error/10"
    },
    {
      label: "Time Spent",
      value: timeSpent,
      icon: "Clock",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      label: "Avg. Time/Question",
      value: averageTimePerQuestion,
      icon: "Timer",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: "Best Streak",
      value: `${streak} in a row`,
      icon: "Zap",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const achievements = [
    {
      title: "Quick Learner",
      description: "Completed quiz in under 6 minutes",
      icon: "Zap",
      earned: true
    },
    {
      title: "Accuracy Expert",
      description: "Scored 80% or higher",
      icon: "Target",
      earned: true
    },
    {
      title: "Streak Master",
      description: "Got 4+ questions correct in a row",
      icon: "TrendingUp",
      earned: true
    },
    {
      title: "Perfect Score",
      description: "Answer all questions correctly",
      icon: "Award",
      earned: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3 mb-6">
          <Icon name="BarChart3" size={24} />
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="p-4 rounded-lg border border-border hover:shadow-quiz-card transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon name={metric.icon} size={20} className={metric.color} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-bold text-card-foreground font-mono">
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3 mb-6">
          <Icon name="Award" size={24} />
          Achievement Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.title}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                achievement.earned
                  ? 'border-success/20 bg-success/5 hover:bg-success/10' :'border-border bg-muted/50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  achievement.earned 
                    ? 'bg-success/20 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={achievement.icon} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">
                      {achievement.title}
                    </h3>
                    {achievement.earned && (
                      <Icon name="Check" size={16} className="text-success" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;