import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickLinks = () => {
  const quickLinks = [
    {
      title: 'Getting Started',
      description: 'Learn how to create your first quiz',
      icon: 'Play',
      link: '/home-quiz-generation',
      color: 'text-success'
    },
    {
      title: 'View Features',
      description: 'Explore all available features',
      icon: 'Sparkles',
      link: '/features-overview',
      color: 'text-primary'
    },
    {
      title: 'Quiz History',
      description: 'Check your past quiz results',
      icon: 'History',
      link: '/quiz-results-scoring',
      color: 'text-warning'
    },
    {
      title: 'User Account',
      description: 'Manage your account settings',
      icon: 'User',
      link: '/user-authentication',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-quiz-card-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-card-foreground font-inter">
          Quick Links
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Jump to the most commonly accessed sections
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.link}
            className="group block p-4 bg-muted/30 hover:bg-muted/60 rounded-lg border border-border/50 hover:border-border transition-all duration-200 quiz-scale-hover quiz-focus-ring"
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={link.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {link.description}
                </p>
              </div>
              <Icon
                name="ArrowRight"
                size={16}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Need immediate assistance?
        </p>
        <Button
          variant="outline"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          className="quiz-scale-hover"
        >
          Start Live Chat
        </Button>
      </div>
    </div>
  );
};

export default QuickLinks;