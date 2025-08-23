import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuizTimer = ({ 
  initialTime = 600, // 10 minutes in seconds
  onTimeUp,
  isActive = true,
  showWarning = true,
  warningThreshold = 60 // Show warning when 1 minute left
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        
        if (showWarning && newTime <= warningThreshold && !isWarning) {
          setIsWarning(true);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp, showWarning, warningThreshold, isWarning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= warningThreshold) return 'text-error';
    if (timeLeft <= warningThreshold * 2) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressPercentage = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  if (!isActive) return null;

  return (
    <div className={`
      bg-card rounded-lg border p-4 space-y-3 quiz-transition
      ${isWarning ? 'border-error/50 bg-error/5 quiz-pulse' : 'border-border'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={isWarning ? "AlertTriangle" : "Clock"} 
            size={18} 
            color={isWarning ? "var(--color-error)" : "var(--color-muted-foreground)"} 
          />
          <span className="text-sm font-medium text-card-foreground">
            Time Remaining
          </span>
        </div>
        
        <div className={`text-lg font-mono font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`
            h-2 rounded-full transition-all duration-1000 ease-linear
            ${timeLeft <= warningThreshold ? 'bg-error' : 
              timeLeft <= warningThreshold * 2 ? 'bg-warning' : 'bg-primary'}
          `}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {isWarning && (
        <div className="flex items-center space-x-2 text-error">
          <Icon name="AlertTriangle" size={14} />
          <span className="text-xs font-medium">
            Time is running out! Hurry up!
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizTimer;