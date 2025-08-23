import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureComparison = () => {
  const comparisonData = [
    {
      feature: "Quiz Topics",
      basic: "Limited Selection",
      premium: "Unlimited Topics",
      enterprise: "Custom Categories"
    },
    {
      feature: "Difficulty Levels",
      basic: "Easy & Medium",
      premium: "All 4 Levels",
      enterprise: "Custom Difficulty"
    },
    {
      feature: "Question Count",
      basic: "Up to 10",
      premium: "Up to 50",
      enterprise: "Unlimited"
    },
    {
      feature: "Progress Tracking",
      basic: "Basic Stats",
      premium: "Detailed Analytics",
      enterprise: "Advanced Reports"
    },
    {
      feature: "Quiz History",
      basic: "Last 10 Quizzes",
      premium: "Complete History",
      enterprise: "Unlimited Storage"
    },
    {
      feature: "Export Results",
      basic: "❌",
      premium: "PDF Export",
      enterprise: "Multiple Formats"
    }
  ];

  const plans = [
    { name: "Basic", price: "Free", popular: false },
    { name: "Premium", price: "$9/month", popular: true },
    { name: "Enterprise", price: "Custom", popular: false }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground font-inter mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare features across our different plans to find the one that best fits your learning needs.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-muted/50">
            <div className="p-4 font-semibold text-card-foreground">
              Features
            </div>
            {plans.map((plan, index) => (
              <div key={index} className="p-4 text-center relative">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="font-semibold text-card-foreground">{plan.name}</div>
                <div className="text-sm text-primary font-mono mt-1">{plan.price}</div>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          {comparisonData.map((row, index) => (
            <div 
              key={index}
              className={`grid grid-cols-4 border-t border-border ${
                index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
              }`}
            >
              <div className="p-4 font-medium text-card-foreground">
                {row.feature}
              </div>
              <div className="p-4 text-center text-muted-foreground">
                {row.basic}
              </div>
              <div className="p-4 text-center text-card-foreground font-medium">
                {row.premium}
              </div>
              <div className="p-4 text-center text-card-foreground font-medium">
                {row.enterprise}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include our core quiz generation features and 24/7 support
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;