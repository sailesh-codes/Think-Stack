import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthBenefits = ({ mode }) => {
  const benefits = [
    {
      icon: 'BookOpen',
      title: 'Personalized Learning',
      description: 'Get quizzes tailored to your interests and skill level for optimal learning outcomes.'
    },
    {
      icon: 'TrendingUp',
      title: 'Track Your Progress',
      description: 'Monitor your improvement over time with detailed analytics and performance insights.'
    },
    {
      icon: 'Trophy',
      title: 'Earn Achievements',
      description: 'Unlock badges and milestones as you complete quizzes and reach new learning goals.'
    },
    {
      icon: 'Users',
      title: 'Join Community',
      description: 'Connect with fellow learners and share your quiz results with friends and colleagues.'
    },
    {
      icon: 'Clock',
      title: 'Learn Anytime',
      description: 'Access your quiz history and continue learning from any device, anywhere, anytime.'
    },
    {
      icon: 'Zap',
      title: 'Instant Feedback',
      description: 'Get immediate results and explanations to help you understand and remember better.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Medical Student',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      quote: "Think Stack helped me ace my anatomy exams. The personalized difficulty levels are perfect!"
    },
    {
      name: 'Michael Chen',
      role: 'High School Teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      quote: "I use this platform to create engaging quizzes for my students. It saves me hours of preparation time."
    },
    {
      name: 'Emily Rodriguez',
      role: 'Software Developer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      quote: "Great for staying sharp on technical concepts. The variety of topics keeps learning interesting."
    }
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-8 lg:py-12 bg-gradient-to-br from-primary/5 to-secondary/5 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Brain" size={32} color="white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-inter mb-2">
            {mode === 'signup' ? 'Start Your Learning Journey' : 'Welcome Back, Learner!'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'signup' ?'Join thousands of learners who are already improving their knowledge with personalized quizzes.' :'Continue where you left off and keep building your knowledge with engaging quizzes.'
            }
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4 mb-8">
          {benefits.slice(0, mode === 'signup' ? 6 : 4).map((benefit, index) => (
            <div 
              key={benefit.title}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors duration-200 quiz-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={benefit.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        {mode === 'signup' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground font-inter text-center mb-4">
              What Our Users Say
            </h3>
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50 quiz-fade-in"
                style={{ animationDelay: `${(index + 6) * 100}ms` }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="quiz-fade-in" style={{ animationDelay: '900ms' }}>
            <div className="text-2xl font-bold text-primary font-mono">50K+</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>
          <div className="quiz-fade-in" style={{ animationDelay: '1000ms' }}>
            <div className="text-2xl font-bold text-primary font-mono">1M+</div>
            <div className="text-xs text-muted-foreground">Quizzes Taken</div>
          </div>
          <div className="quiz-fade-in" style={{ animationDelay: '1100ms' }}>
            <div className="text-2xl font-bold text-primary font-mono">95%</div>
            <div className="text-xs text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBenefits;