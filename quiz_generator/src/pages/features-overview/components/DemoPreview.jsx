import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DemoPreview = () => {
  const [activeDemo, setActiveDemo] = useState('generation');

  const demoTabs = [
    {
      id: 'generation',
      label: 'Quiz Generation',
      icon: 'Plus',
      description: 'See how easy it is to create a quiz'
    },
    {
      id: 'taking',
      label: 'Quiz Taking',
      icon: 'Play',
      description: 'Experience our interactive quiz interface'
    },
    {
      id: 'results',
      label: 'Results & Analytics',
      icon: 'BarChart3',
      description: 'View detailed performance insights'
    }
  ];

  const demoContent = {
    generation: {
      title: "Create Quiz in Seconds",
      steps: [
        "Enter your desired topic (e.g., 'World History')",
        "Select difficulty level (Easy, Medium, Hard, Expert)",
        "Choose number of questions (5-50)",
        "Click \'Generate Quiz\' and we\'ll create it instantly"
      ],
      mockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    taking: {
      title: "Engaging Quiz Experience",
      steps: [
        "Clean, distraction-free interface",
        "Progress tracking with visual indicators",
        "Timed questions with countdown",
        "Instant feedback on each answer"
      ],
      mockup: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
    },
    results: {
      title: "Comprehensive Analytics",
      steps: [
        "Detailed score breakdown and percentage",
        "Question-by-question review",
        "Performance trends over time",
        "Personalized improvement suggestions"
      ],
      mockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    }
  };

  const currentDemo = demoContent[activeDemo];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
            See It In Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive demos to understand how each feature works and how they can enhance your learning experience.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 space-y-2 sm:space-y-0 sm:space-x-2">
          {demoTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDemo(tab.id)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                quiz-focus-ring quiz-scale-hover
                ${activeDemo === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={tab.icon} size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-card-foreground font-inter mb-6">
                {currentDemo.title}
              </h3>
              
              <div className="space-y-4 mb-8">
                {currentDemo.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 quiz-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  variant="default"
                  iconName="Play"
                  iconPosition="left"
                  className="quiz-scale-hover"
                >
                  Try Interactive Demo
                </Button>
                <Button
                  variant="outline"
                  iconName="ExternalLink"
                  iconPosition="right"
                  className="quiz-scale-hover"
                >
                  View Full Tutorial
                </Button>
              </div>
            </div>

            {/* Right Side - Mockup */}
            <div className="bg-muted/30 p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="bg-background rounded-lg shadow-quiz-card border border-border overflow-hidden">
                  <div className="h-3 bg-muted flex items-center justify-start px-3 space-x-1">
                    <div className="w-2 h-2 bg-error rounded-full"></div>
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Icon name={demoTabs.find(tab => tab.id === activeDemo)?.icon} size={48} className="text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Interactive Demo Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoPreview;