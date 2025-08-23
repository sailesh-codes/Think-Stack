import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TopicInputSection = ({ onTopicSubmit, isVisible, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const suggestedTopics = [
    { name: "Science", icon: "Atom", color: "text-blue-500" },
    { name: "World Capitals", icon: "Globe", color: "text-green-500" },
    { name: "Mythology", icon: "Crown", color: "text-purple-500" },
    { name: "History", icon: "Clock", color: "text-orange-500" },
    { name: "Literature", icon: "Book", color: "text-red-500" },
    { name: "Mathematics", icon: "Calculator", color: "text-indigo-500" },
    { name: "Sports", icon: "Trophy", color: "text-yellow-500" },
    { name: "Technology", icon: "Cpu", color: "text-cyan-500" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a quiz topic');
      return;
    }
    if (topic.trim().length < 2) {
      setError('Topic must be at least 2 characters long');
      return;
    }
    setError('');
    onTopicSubmit(topic.trim());
  };

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
    setError('');
    onTopicSubmit(selectedTopic);
  };

  const handleInputChange = (e) => {
    setTopic(e.target.value);
    if (error) setError('');
  };

  if (!isVisible) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-surface"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Section Header */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-inter">
              Choose Your Quiz Topic
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter any topic you'd like to be quizzed on, or select from our popular suggestions below.
            </p>
          </div>

          {/* Topic Input Form */}
          <div className="bg-card rounded-xl shadow-quiz-card border border-border p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="max-w-md mx-auto">
                <Input
                  label="Quiz Topic"
                  type="text"
                  value={topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Science, World Capitals, Mythology..."
                  error={error}
                  disabled={isLoading}
                  className="text-center"
                />
              </div>
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isLoading || !topic.trim()}
                loading={isLoading}
                iconName="ArrowRight"
                iconPosition="right"
                className="quiz-scale-hover"
              >
                Continue to Difficulty
              </Button>
            </form>
          </div>

          {/* Suggested Topics */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex-1 border-t border-border"></div>
              <span className="text-sm text-muted-foreground px-4">Or choose from popular topics</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {suggestedTopics.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleTopicSelect(item.name)}
                  disabled={isLoading}
                  className="bg-card hover:bg-muted border border-border rounded-lg p-4 transition-all duration-200 quiz-scale-hover quiz-focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon name={item.icon} size={24} className={item.color} />
                    <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Pro Tip:</strong> Be specific with your topics for better questions. 
                  Instead of "Science", try "Biology" or "Physics". Instead of "History", try "World War II" or "Ancient Rome".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TopicInputSection;