import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AuthHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/home-quiz-generation" 
            className="flex items-center space-x-2 quiz-focus-ring rounded-lg"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-foreground font-inter">
            Think Stack
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/home-quiz-generation"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded px-2 py-1"
            >
              Home
            </Link>
            <Link
              to="/features-overview"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded px-2 py-1"
            >
              Features
            </Link>
            <Link
              to="/faq-support"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded px-2 py-1"
            >
              Support
            </Link>
          </nav>

          {/* Back to Home */}
          <Link
            to="/home-quiz-generation"
            className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 quiz-focus-ring rounded px-2 py-1"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;