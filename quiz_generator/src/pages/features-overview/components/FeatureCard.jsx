import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  details, 
  demoAction,
  isHighlighted = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`
      bg-card rounded-xl shadow-quiz-card border border-border p-6 
      quiz-transition quiz-scale-hover h-full flex flex-col
      ${isHighlighted ? 'ring-2 ring-primary/20 bg-primary/5' : ''}
    `}>
      {/* Icon and Title */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
          ${isHighlighted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
        `}>
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground font-inter mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Expandable Details */}
      {details && (
        <div className="mt-auto">
          <button
            onClick={toggleExpanded}
            className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-muted transition-colors duration-200 quiz-focus-ring"
          >
            <span className="text-sm font-medium text-card-foreground">
              Learn More
            </span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-muted rounded-lg quiz-fade-in">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {details}
              </p>
              {demoAction && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={demoAction}
                    iconName="Play"
                    iconPosition="left"
                    className="quiz-scale-hover"
                  >
                    Try Demo
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeatureCard;