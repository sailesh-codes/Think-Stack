import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const QuestionReview = ({ questions = [] }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const mockQuestions = [
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
  ];

  const questionsToShow = questions.length > 0 ? questions : mockQuestions;

  const toggleExpanded = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="bg-card rounded-xl shadow-quiz-card-lg border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-card-foreground font-inter flex items-center gap-3">
          <Icon name="FileText" size={24} />
          Question Review
        </h2>
        <p className="text-muted-foreground mt-2">
          Review your answers and learn from explanations
        </p>
      </div>

      <div className="divide-y divide-border">
        {questionsToShow.map((question, index) => (
          <div key={question.id} className="p-6">
            {/* Question Header */}
            <div 
              className="flex items-start justify-between cursor-pointer"
              onClick={() => toggleExpanded(question.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {index + 1}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    question.isCorrect 
                      ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                  }`}>
                    <Icon 
                      name={question.isCorrect ? "Check" : "X"} 
                      size={12} 
                    />
                    {question.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-3">
                  {question.question}
                </h3>
              </div>
              <Icon 
                name={expandedQuestion === question.id ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground ml-4 flex-shrink-0"
              />
            </div>

            {/* Expanded Content */}
            {expandedQuestion === question.id && (
              <div className="mt-4 space-y-4 quiz-fade-in">
                {/* Answers Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Your Answer</p>
                    <div className={`p-3 rounded-lg border ${
                      question.isCorrect 
                        ? 'bg-success/5 border-success/20 text-success' :'bg-error/5 border-error/20 text-error'
                    }`}>
                      {question.userAnswer}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Correct Answer</p>
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-success">
                      {question.correctAnswer}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Icon name="Lightbulb" size={16} />
                      Explanation
                    </p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-card-foreground">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionReview;