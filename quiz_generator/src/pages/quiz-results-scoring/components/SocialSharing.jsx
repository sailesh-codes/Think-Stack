import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialSharing = ({ 
  score = 8, 
  totalQuestions = 10, 
  percentage = 80, 
  topic = "World Capitals",
  difficulty = "Medium"
}) => {
  const [copied, setCopied] = useState(false);

  const shareText = `I just scored ${score}/${totalQuestions} (${percentage}%) on a ${difficulty} ${topic} quiz! 🎯 Test your knowledge too!`;
  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: 'hover:bg-blue-50 hover:text-blue-600',
      action: () => handleShare('twitter')
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'hover:bg-blue-50 hover:text-blue-700',
      action: () => handleShare('facebook')
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'hover:bg-blue-50 hover:text-blue-800',
      action: () => handleShare('linkedin')
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'hover:bg-green-50 hover:text-green-600',
      action: () => handleShare('whatsapp')
    },
    {
      name: 'Telegram',
      icon: 'Send',
      color: 'hover:bg-blue-50 hover:text-blue-500',
      action: () => handleShare('telegram')
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
      <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3 mb-6">
        <Icon name="Share2" size={24} />
        Share Your Achievement
      </h2>

      {/* Share Preview */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Brain" size={24} color="white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground">Quiz Generator</h3>
            <p className="text-sm text-muted-foreground mt-1">{shareText}</p>
          </div>
        </div>
      </div>

      {/* Social Platforms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">Share on social media</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              onClick={platform.action}
              className={`p-4 rounded-lg border border-border transition-all duration-200 quiz-scale-hover quiz-focus-ring ${platform.color}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon name={platform.icon} size={24} />
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Copy Link */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">Or copy link</h3>
        <div className="flex gap-3">
          <div className="flex-1 p-3 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground truncate font-mono">
              {shareUrl}
            </p>
          </div>
          <Button
            variant={copied ? "success" : "outline"}
            onClick={handleCopyLink}
            iconName={copied ? "Check" : "Copy"}
            className="quiz-scale-hover"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Native Share (Mobile) */}
      {navigator.share && (
        <div className="mt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              navigator.share({
                title: 'Quiz Results',
                text: shareText,
                url: shareUrl
              });
            }}
            iconName="Share"
            iconPosition="left"
            className="quiz-scale-hover"
          >
            Share via device
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialSharing;