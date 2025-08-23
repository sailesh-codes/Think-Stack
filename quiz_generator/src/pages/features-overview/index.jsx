import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FeatureCard from './components/FeatureCard';
import HeroSection from './components/HeroSection';
import FeatureComparison from './components/FeatureComparison';
import DemoPreview from './components/DemoPreview';
import IntegrationShowcase from './components/IntegrationShowcase';

const FeaturesOverview = () => {
  useEffect(() => {
    document.title = 'Features Overview - Quiz Generator';
    window.scrollTo(0, 0);
  }, []);

  const coreFeatures = [
    {
      icon: "Infinity",
      title: "Unlimited Topics",
      description: "Generate quizzes on any subject imaginable - from science and history to pop culture and specialized fields.",
      details: `Our AI-powered system can create questions on virtually any topic you can think of. Whether you're studying for exams, testing your knowledge, or just having fun, we've got you covered with unlimited topic possibilities.`,
      isHighlighted: true
    },
    {
      icon: "Layers",
      title: "Four Difficulty Levels",
      description: "Choose from Easy, Medium, Hard, or Expert levels to match your current knowledge and challenge yourself appropriately.",
      details: `Each difficulty level is carefully calibrated to provide the right amount of challenge. Easy questions build confidence, while Expert level pushes even the most knowledgeable users to their limits.`
    },
    {
      icon: "Zap",
      title: "Instant Results",
      description: "Get immediate feedback on your performance with detailed scoring, explanations, and improvement suggestions.",
      details: `No waiting around - see your results instantly after completing each quiz. Our system provides comprehensive feedback including correct answers, explanations, and personalized recommendations for improvement.`
    },
    {
      icon: "BarChart3",
      title: "Progress Tracking",
      description: "Monitor your learning journey with comprehensive analytics, performance trends, and achievement tracking.",
      details: `Track your progress over time with detailed analytics. See which topics you excel in, identify areas for improvement, and celebrate your achievements with our comprehensive tracking system.`
    },
    {
      icon: "Clock",
      title: "Flexible Timing",
      description: "Take quizzes at your own pace or challenge yourself with timed sessions for exam preparation.",
      details: `Choose between relaxed, self-paced learning or intense timed challenges. Perfect for both casual learning and serious exam preparation with customizable time limits.`
    },
    {
      icon: "Share2",
      title: "Easy Sharing",
      description: "Share your quiz results with friends, teachers, or on social media to celebrate your achievements.",
      details: `Easily share your quiz results and achievements. Generate shareable links, export results as PDFs, or post directly to social media to showcase your knowledge and inspire others.`
    }
  ];

  const additionalFeatures = [
    {
      icon: "History",
      title: "Complete Quiz History",
      description: "Access all your past quizzes with detailed results and performance analytics."
    },
    {
      icon: "Download",
      title: "Export Results",
      description: "Download your quiz results in multiple formats for offline review or sharing."
    },
    {
      icon: "Smartphone",
      title: "Mobile Optimized",
      description: "Take quizzes anywhere with our fully responsive mobile-friendly design."
    },
    {
      icon: "Shield",
      title: "Privacy Focused",
      description: "Your data is secure with enterprise-grade privacy protection and encryption."
    },
    {
      icon: "Headphones",
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated customer support team."
    },
    {
      icon: "Palette",
      title: "Customizable Themes",
      description: "Personalize your experience with light and dark themes plus custom color options."
    }
  ];

  const handleDemoAction = (featureType) => {
    console.log(`Demo requested for: ${featureType}`);
    // In a real app, this would trigger a demo modal or redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Core Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
                Core Features
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create, take, and master quizzes with our comprehensive feature set designed for optimal learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  details={feature.details}
                  demoAction={() => handleDemoAction(feature.title)}
                  isHighlighted={feature.isHighlighted}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Demo Preview Section */}
        <DemoPreview />

        {/* Integration Showcase */}
        <IntegrationShowcase />

        {/* Additional Features */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
                Additional Features
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover more ways our platform enhances your learning experience with these powerful additional features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card rounded-xl shadow-quiz-card border border-border p-6 quiz-transition quiz-scale-hover quiz-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={feature.icon} size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground font-inter mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <FeatureComparison />

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground font-inter">
                Ready to Experience These Features?
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of learners who are already using our platform to enhance their knowledge and achieve their learning goals.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/home-quiz-generation">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="Rocket"
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

              <div className="pt-8">
                <p className="text-sm text-muted-foreground">
                  No credit card required • Free forever plan available • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/home-quiz-generation" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={20} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-card-foreground font-inter">
                  Quiz Generator
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering learners worldwide with AI-powered quiz generation and comprehensive learning analytics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/home-quiz-generation" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Home
                </Link>
                <Link to="/features-overview" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Features
                </Link>
                <Link to="/quiz-results-scoring" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  History
                </Link>
                <Link to="/faq-support" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Contact Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Connect</h3>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted/80 transition-colors duration-200">
                  <Icon name="Twitter" size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted/80 transition-colors duration-200">
                  <Icon name="Facebook" size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted/80 transition-colors duration-200">
                  <Icon name="Instagram" size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted/80 transition-colors duration-200">
                  <Icon name="Linkedin" size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Think Stack. All rights reserved. Built with ❤️ for learners everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesOverview;