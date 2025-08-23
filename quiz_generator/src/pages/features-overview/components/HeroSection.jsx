import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const statistics = [
    { value: "10,000+", label: "Quizzes Generated" },
    { value: "50+", label: "Topics Available" },
    { value: "4", label: "Difficulty Levels" },
    { value: "95%", label: "User Satisfaction" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-inter leading-tight">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-3">
                Smart Learning
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover everything you need to create, take, and track quizzes with our comprehensive platform designed for learners of all levels.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statistics.map((stat, index) => (
              <div 
                key={index}
                className="text-center quiz-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary font-mono mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/home-quiz-generation">
              <Button
                variant="default"
                size="lg"
                iconName="Zap"
                iconPosition="left"
                className="quiz-scale-hover"
              >
                Start Creating Quizzes
              </Button>
            </Link>
            
            <Link to="/user-authentication">
              <Button
                variant="outline"
                size="lg"
                iconName="UserPlus"
                iconPosition="left"
                className="quiz-scale-hover"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>Secure & Private</span>
            <span className="text-border">•</span>
            <Icon name="Zap" size={16} className="text-warning" />
            <span>Lightning Fast</span>
            <span className="text-border">•</span>
            <Icon name="Users" size={16} className="text-primary" />
            <span>Trusted by Thousands</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;