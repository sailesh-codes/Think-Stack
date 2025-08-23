import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ScoreDisplay from './components/ScoreDisplay';
import QuestionReview from './components/QuestionReview';
import PerformanceMetrics from './components/PerformanceMetrics';
import SocialSharing from './components/SocialSharing';
import ActionButtons from './components/ActionButtons';
import RelatedTopics from './components/RelatedTopics';

const QuizResultsScoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock quiz results data
  const mockQuizResults = {
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timeSpent: "5:30",
    averageTimePerQuestion: "33s",
    difficulty: "Medium",
    topic: "World Capitals",
    correctAnswers: 8,
    incorrectAnswers: 2,
    streak: 4,
    completedAt: new Date().toISOString(),
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        userAnswer: "Paris",
        correctAnswer: "Paris",
        isCorrect: true,
        explanation: "Paris has been the capital of France since 987 AD and is located in the north-central part of the country."
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        userAnswer: "Venus",
        correctAnswer: "Mars",
        isCorrect: false,
        explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface, giving it a reddish appearance."
      },
      {
        id: 3,
        question: "What is the largest ocean on Earth?",
        userAnswer: "Pacific Ocean",
        correctAnswer: "Pacific Ocean",
        isCorrect: true,
        explanation: "The Pacific Ocean covers about 46% of the world's water surface and about 32% of the planet's total surface area."
      },
      {
        id: 4,
        question: "Who painted the Mona Lisa?",
        userAnswer: "Leonardo da Vinci",
        correctAnswer: "Leonardo da Vinci",
        isCorrect: true,
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It's housed in the Louvre Museum in Paris."
      },
      {
        id: 5,
        question: "What is the chemical symbol for gold?",
        userAnswer: "Go",
        correctAnswer: "Au",
        isCorrect: false,
        explanation: "The symbol Au comes from the Latin word 'aurum', meaning gold. Gold is a chemical element with atomic number 79."
      }
    ]
  };

  useEffect(() => {
    // Simulate loading quiz results
    const timer = setTimeout(() => {
      const results = location.state?.quizResults || mockQuizResults;
      setQuizResults(results);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleRetakeQuiz = () => {
    navigate('/quiz-taking-interface', {
      state: {
        topic: quizResults?.topic,
        difficulty: quizResults?.difficulty
      }
    });
  };

  const handleSaveToHistory = (data) => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      const newQuiz = {
        id: Date.now(),
        ...data,
        savedAt: new Date().toISOString()
      };
      savedQuizzes.unshift(newQuiz);
      localStorage.setItem('quizHistory', JSON.stringify(savedQuizzes.slice(0, 50)));
      
      // Show success feedback (could be a toast notification)
      console.log('Quiz results saved to history');
    } catch (error) {
      console.error('Failed to save quiz results:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizResults) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">No Results Found</h1>
            <p className="text-muted-foreground">
              We couldn't find any quiz results to display.
            </p>
            <button
              onClick={() => navigate('/home-quiz-generation')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Take a Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ScoreDisplay
                score={quizResults.score}
                totalQuestions={quizResults.totalQuestions}
                percentage={quizResults.percentage}
                timeSpent={quizResults.timeSpent}
                difficulty={quizResults.difficulty}
                topic={quizResults.topic}
              />
              
              <QuestionReview questions={quizResults.questions} />
              
              <SocialSharing
                score={quizResults.score}
                totalQuestions={quizResults.totalQuestions}
                percentage={quizResults.percentage}
                topic={quizResults.topic}
                difficulty={quizResults.difficulty}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <PerformanceMetrics
                totalQuestions={quizResults.totalQuestions}
                correctAnswers={quizResults.correctAnswers}
                incorrectAnswers={quizResults.incorrectAnswers}
                timeSpent={quizResults.timeSpent}
                averageTimePerQuestion={quizResults.averageTimePerQuestion}
                streak={quizResults.streak}
                difficulty={quizResults.difficulty}
              />
              
              <ActionButtons
                onRetakeQuiz={handleRetakeQuiz}
                onSaveToHistory={handleSaveToHistory}
                quizData={quizResults}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <ScoreDisplay
              score={quizResults.score}
              totalQuestions={quizResults.totalQuestions}
              percentage={quizResults.percentage}
              timeSpent={quizResults.timeSpent}
              difficulty={quizResults.difficulty}
              topic={quizResults.topic}
            />
            
            <ActionButtons
              onRetakeQuiz={handleRetakeQuiz}
              onSaveToHistory={handleSaveToHistory}
              quizData={quizResults}
            />
            
            <PerformanceMetrics
              totalQuestions={quizResults.totalQuestions}
              correctAnswers={quizResults.correctAnswers}
              incorrectAnswers={quizResults.incorrectAnswers}
              timeSpent={quizResults.timeSpent}
              averageTimePerQuestion={quizResults.averageTimePerQuestion}
              streak={quizResults.streak}
              difficulty={quizResults.difficulty}
            />
            
            <QuestionReview questions={quizResults.questions} />
            
            <SocialSharing
              score={quizResults.score}
              totalQuestions={quizResults.totalQuestions}
              percentage={quizResults.percentage}
              topic={quizResults.topic}
              difficulty={quizResults.difficulty}
            />
          </div>

          {/* Related Topics Section */}
          <div className="mt-12">
            <RelatedTopics
              currentTopic={quizResults.topic}
              currentDifficulty={quizResults.difficulty}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResultsScoring;