import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FAQItem = ({ question, answer, isPopular = false, onHelpful }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHelpfulVote = (isHelpful) => {
    setHelpfulVote(isHelpful);
    onHelpful && onHelpful(isHelpful);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-quiz-card-shadow overflow-hidden">
      <button
        onClick={toggleExpanded}
        className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors duration-200 quiz-focus-ring"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {isPopular && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                <Icon name="Star" size={12} className="mr-1" />
                Popular
              </span>
            )}
            <h3 className="text-base font-semibold text-card-foreground font-inter">
              {question}
            </h3>
          </div>
          <Icon
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            size={20}
            className="text-muted-foreground transition-transform duration-200"
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 quiz-fade-in">
          <div className="pt-4 border-t border-border">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <div dangerouslySetInnerHTML={{ __html: answer }} />
            </div>

            {/* Helpful Voting */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Was this helpful?</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={helpfulVote === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleHelpfulVote(true)}
                    iconName="ThumbsUp"
                    iconPosition="left"
                    className="quiz-scale-hover"
                  >
                    Yes
                  </Button>
                  <Button
                    variant={helpfulVote === false ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleHelpfulVote(false)}
                    iconName="ThumbsDown"
                    iconPosition="left"
                    className="quiz-scale-hover"
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQItem;