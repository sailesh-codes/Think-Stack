import React from 'react';
import Icon from '../../../components/AppIcon';

const IntegrationShowcase = () => {
  const integrationFlow = [
    {
      step: 1,
      title: "Generate Quiz",
      description: "Create personalized quizzes on any topic with AI-powered question generation",
      icon: "Sparkles",
      color: "text-primary"
    },
    {
      step: 2,
      title: "Take Quiz",
      description: "Engage with interactive questions in a distraction-free environment",
      icon: "Play",
      color: "text-secondary"
    },
    {
      step: 3,
      title: "View Results",
      description: "Get instant feedback with detailed scoring and performance insights",
      icon: "BarChart3",
      color: "text-accent"
    },
    {
      step: 4,
      title: "Track Progress",
      description: "Monitor your learning journey with comprehensive history and analytics",
      icon: "TrendingUp",
      color: "text-success"
    }
  ];

  const connectingFeatures = [
    {
      title: "Smart Recommendations",
      description: "Based on your quiz history, we suggest topics and difficulty levels that match your learning pace",
      icon: "Brain"
    },
    {
      title: "Adaptive Difficulty",
      description: "Our system learns from your performance and automatically adjusts question difficulty",
      icon: "Target"
    },
    {
      title: "Learning Insights",
      description: "Detailed analytics help identify knowledge gaps and suggest areas for improvement",
      icon: "Lightbulb"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
            Seamlessly Connected Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our features work together to create a comprehensive learning ecosystem that adapts to your needs and grows with your knowledge.
          </p>
        </div>

        {/* Integration Flow */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationFlow.map((item, index) => (
              <div key={index} className="relative">
                {/* Connecting Line */}
                {index < integrationFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-6 h-0.5 bg-border z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
                
                <div className="bg-card rounded-xl shadow-quiz-card border border-border p-6 text-center relative z-10 h-full">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                    <Icon name={item.icon} size={24} />
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      STEP {item.step}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-card-foreground font-inter mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {connectingFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl shadow-quiz-card border border-border p-6 quiz-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature.icon} size={20} className="text-primary" />
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

        {/* Integration Benefits */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-8">
            <h3 className="text-2xl font-bold text-card-foreground font-inter mb-4">
              Why Integration Matters
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              When features work together seamlessly, your learning becomes more effective. Our integrated approach means less time managing tools and more time focused on what matters most - expanding your knowledge and achieving your learning goals.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-success font-mono mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Faster Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono mb-1">92%</div>
                <div className="text-sm text-muted-foreground">Better Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent font-mono mb-1">78%</div>
                <div className="text-sm text-muted-foreground">More Engagement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationShowcase;