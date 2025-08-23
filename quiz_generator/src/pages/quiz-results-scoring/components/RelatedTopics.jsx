import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedTopics = ({ currentTopic = "World Capitals", currentDifficulty = "Medium" }) => {
  const navigate = useNavigate();

  const relatedTopics = [
    {
      title: "World Geography",
      description: "Test your knowledge of countries, continents, and landmarks",
      icon: "Globe",
      difficulty: "Medium",
      estimatedTime: "8-10 min",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "European History",
      description: "Explore major events and figures in European history",
      icon: "BookOpen",
      difficulty: "Hard",
      estimatedTime: "10-12 min",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Science Basics",
      description: "Fundamental concepts in physics, chemistry, and biology",
      icon: "Atom",
      difficulty: "Easy",
      estimatedTime: "5-7 min",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "World Literature",
      description: "Famous authors, books, and literary movements",
      icon: "Book",
      difficulty: "Medium",
      estimatedTime: "8-10 min",
      color: "from-orange-500 to-red-500"
    }
  ];

  const difficultyProgression = [
    {
      level: "Easy",
      description: "Build confidence with simpler questions",
      icon: "TrendingUp",
      recommended: currentDifficulty === "Medium" || currentDifficulty === "Hard"
    },
    {
      level: "Hard",
      description: "Challenge yourself with advanced questions",
      icon: "Target",
      recommended: currentDifficulty === "Easy" || currentDifficulty === "Medium"
    },
    {
      level: "Expert",
      description: "Master level questions for true experts",
      icon: "Award",
      recommended: currentDifficulty === "Hard"
    }
  ];

  const handleTopicSelect = (topic) => {
    // Navigate to quiz generation with pre-selected topic
    navigate('/home-quiz-generation', { 
      state: { 
        selectedTopic: topic.title,
        selectedDifficulty: topic.difficulty 
      }
    });
  };

  const handleDifficultySelect = (difficulty) => {
    navigate('/home-quiz-generation', { 
      state: { 
        selectedTopic: currentTopic,
        selectedDifficulty: difficulty.level 
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Related Topics */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3 mb-6">
          <Icon name="Compass" size={24} />
          Explore Related Topics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedTopics.map((topic, index) => (
            <div
              key={topic.title}
              className="group p-4 rounded-lg border border-border hover:shadow-quiz-card transition-all duration-200 cursor-pointer quiz-scale-hover"
              onClick={() => handleTopicSelect(topic)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${topic.color} text-white`}>
                  <Icon name={topic.icon} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Target" size={12} />
                      {topic.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {topic.estimatedTime}
                    </span>
                  </div>
                </div>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Progression */}
      <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3 mb-6">
          <Icon name="TrendingUp" size={24} />
          Try Different Difficulty Levels
        </h2>

        <div className="space-y-3">
          {difficultyProgression.map((difficulty, index) => (
            <div
              key={difficulty.level}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer quiz-scale-hover ${
                difficulty.recommended
                  ? 'border-primary/20 bg-primary/5 hover:bg-primary/10' :'border-border hover:bg-muted'
              }`}
              onClick={() => handleDifficultySelect(difficulty)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    difficulty.recommended 
                      ? 'bg-primary/20 text-primary' :'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={difficulty.icon} size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">
                        {difficulty.level} - {currentTopic}
                      </h3>
                      {difficulty.recommended && (
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {difficulty.description}
                    </p>
                  </div>
                </div>
                <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => navigate('/home-quiz-generation')}
          iconName="Shuffle"
          iconPosition="left"
          className="quiz-scale-hover"
        >
          Surprise Me with Random Topic
        </Button>
      </div>
    </div>
  );
};

export default RelatedTopics;