import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturesPreview = () => {
  const features = [
    {
      icon: 'Sparkles',
      title: 'AI-Powered Questions',
      description: 'Advanced algorithms generate unique, relevant questions tailored to your chosen topic and difficulty level.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: 'Target',
      title: 'Adaptive Difficulty',
      description: 'Four distinct difficulty levels ensure the perfect challenge for beginners to experts.',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: 'BarChart3',
      title: 'Detailed Analytics',
      description: 'Track your progress with comprehensive scoring, timing, and performance insights.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: 'History',
      title: 'Quiz History',
      description: 'Review past quizzes, retake favorites, and monitor your learning journey over time.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: 'Share2',
      title: 'Social Sharing',
      description: 'Share your achievements and challenge friends with your favorite quiz topics.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Optimized',
      description: 'Seamless experience across all devices with responsive design and touch-friendly interface.',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    }
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-inter">
              Powerful Features for Better Learning
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover why thousands of learners choose our platform for their quiz and assessment needs.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl shadow-quiz-card border border-border p-6 quiz-scale-hover"
              >
                <div className="space-y-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor}`}>
                    <Icon name={feature.icon} size={24} className={feature.color} />
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-card-foreground font-inter mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8 sm:p-12"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-inter">
                  Ready to Explore All Features?
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Dive deeper into our comprehensive feature set and discover how we can enhance your learning experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/features-overview">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="quiz-scale-hover"
                  >
                    View All Features
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
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary font-mono">99.9%</div>
              <p className="text-sm text-muted-foreground mt-2">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-secondary font-mono">&lt;2s</div>
              <p className="text-sm text-muted-foreground mt-2">Load Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-accent font-mono">24/7</div>
              <p className="text-sm text-muted-foreground mt-2">Support</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-success font-mono">Free</div>
              <p className="text-sm text-muted-foreground mt-2">Forever</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesPreview;