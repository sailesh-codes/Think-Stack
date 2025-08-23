import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      label: 'Home',
      path: '/home-quiz-generation',
      icon: 'Home',
      tooltip: 'Create and generate quizzes'
    },
    {
      label: 'Features',
      path: '/features-overview',
      icon: 'Sparkles',
      tooltip: 'Discover platform capabilities'
    },
    {
      label: 'History',
      path: '/quiz-results-scoring',
      icon: 'History',
      tooltip: 'View your quiz history and results'
    },
    {
      label: 'FAQ',
      path: '/faq-support',
      icon: 'HelpCircle',
      tooltip: 'Get help and support'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const Logo = () => (
    <Link 
      to="/home-quiz-generation" 
      className="flex items-center space-x-2 quiz-focus-ring rounded-lg"
      onClick={closeMobileMenu}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
        <Icon name="Brain" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold text-foreground font-inter">
        Think Stack
      </span>
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                  quiz-focus-ring quiz-scale-hover flex items-center space-x-2
                  ${isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item.tooltip}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 quiz-focus-ring"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
            </button>
            
            <Link to="/user-authentication">
              <Button variant="default" size="sm" className="quiz-scale-hover">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 quiz-focus-ring"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
            </button>
            
            <Link to="/user-authentication">
              <Button variant="default" size="sm" className="quiz-scale-hover">
                Sign Up
              </Button>
            </Link>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 quiz-focus-ring"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border quiz-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium
                  transition-all duration-200 ease-out quiz-focus-ring quiz-touch-target
                  quiz-fade-in
                  ${isActiveRoute(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;