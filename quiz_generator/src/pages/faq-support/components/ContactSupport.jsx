import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactSupport = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Support form submitted:', formData);
    setIsSubmitting(false);
    setIsExpanded(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const supportChannels = [
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@quizgenerator.com',
      color: 'text-primary'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      color: 'text-success'
    },
    {
      icon: 'Phone',
      title: 'Phone Support',
      description: 'Call us during business hours',
      action: '+1 (555) 123-4567',
      color: 'text-warning'
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-quiz-card-lg p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-card-foreground font-inter">
          Still Need Help?
        </h2>
        <p className="text-muted-foreground">
          Can't find what you're looking for? Our support team is here to help.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportChannels.map((channel, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-4 text-center space-y-3 hover:bg-muted transition-colors duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background ${channel.color}`}>
              <Icon name={channel.icon} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{channel.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
              <p className="text-sm font-medium text-primary mt-2">{channel.action}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          className="quiz-scale-hover"
        >
          {isExpanded ? 'Hide Contact Form' : 'Send us a Message'}
        </Button>
      </div>

      {/* Contact Form */}
      {isExpanded && (
        <div className="quiz-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <Input
              label="Subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What can we help you with?"
              required
              disabled={isSubmitting}
            />
            
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your issue or question in detail..."
                rows={4}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
            
            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isSubmitting}
              iconName="Send"
              iconPosition="right"
              className="quiz-scale-hover"
            >
              Send Message
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactSupport;