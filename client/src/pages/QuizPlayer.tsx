import { useQuiz } from "@/hooks/use-quizzes";
import { useRoute } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Sparkles, Target, Trophy } from "lucide-react";
import { Link } from "wouter";
import { gsap } from "@/lib/gsap";

export default function QuizPlayer() {
  const [, params] = useRoute("/quiz/:id");
  const quizId = params?.id || "";
  const { data: quiz, isLoading, error } = useQuiz(quizId);

  console.log('QuizPlayer - quizId:', quizId);
  console.log('QuizPlayer - isLoading:', isLoading);
  console.log('QuizPlayer - quiz:', quiz);
  console.log('QuizPlayer - error:', error);
  
  // Add additional debugging
  if (quizId && !isLoading && !quiz && !error) {
    console.log('QuizPlayer - Quiz not found but no error - this might indicate a database issue');
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // GSAP animations for question transitions
  useEffect(() => {
    if (questionRef.current && !isAnswered) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentIndex, isAnswered]);

  // GSAP animations for options
  useEffect(() => {
    if (optionsRef.current) {
      const optionElements = optionsRef.current.children;
      gsap.set(optionElements, { opacity: 0, y: 20 });
      gsap.to(optionElements, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });
    }
  }, [currentIndex]);

  // GSAP animation for explanation
  useEffect(() => {
    if (explanationRef.current && isAnswered) {
      gsap.fromTo(explanationRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isAnswered]);

  // GSAP animation for result screen
  useEffect(() => {
    if (showResult && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [showResult]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if it's an authentication error
    if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this quiz.</p>
            <Link href="/login">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load quiz. Please try again.'}</p>
          <div className="space-x-4">
            <Link href="/quiz">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Create New Quiz
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist or has been removed.</p>
          
          {/* Debug information */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-bold text-sm mb-2">Debug Information:</h3>
            <p className="text-xs text-gray-600">Quiz ID: {quizId}</p>
            <p className="text-xs text-gray-600">Loading: {isLoading.toString()}</p>
            <p className="text-xs text-gray-600">Error: {error ? (error as Error).message : 'None'}</p>
            <p className="text-xs text-gray-600">Quiz Data: {quiz ? 'Present' : 'Null'}</p>
          </div>
          
          <div className="mt-4 space-x-4">
            <Link href="/quiz">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Create New Quiz
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const questions = quiz.questions as any[];
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    // Handle both field names: answer or correctAnswer
    const correctAnswer = currentQuestion.answer || currentQuestion.correctAnswer;
    if (option === correctAnswer) {
      setScore(s => s + 1);
    }

    // Add GSAP animation for selected option
    const selectedButton = document.querySelector(`[data-option="${option}"]`);
    if (selectedButton) {
      gsap.to(selectedButton, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <Card
          ref={resultRef}
          className="w-full max-w-md p-8 text-center shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Quiz Completed!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold text-blue-600">{questions.length}</span> correct on <span className="font-semibold text-blue-600">{quiz.topic}</span>.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25" size="lg">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/20"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-white pt-24"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
          <Button
            variant="ghost"
            asChild
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 transition-all duration-300"
          >
            <Link href="/dashboard">Exit Quiz</Link>
          </Button>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Score: <span className="font-bold text-blue-600">{score}/{questions.length}</span>
            </div>
          </div>
        </div>

        <Progress
          value={progress}
          className="h-3 mb-8 bg-blue-100 dark:bg-blue-900/30"
        />

        <div ref={questionRef}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight text-gray-800 dark:text-white">
            {currentQuestion.question || currentQuestion.questionText}
          </h2>

          <div ref={optionsRef} className="space-y-4">
            {currentQuestion.options.map((option: string, idx: number) => {
              const isSelected = selectedOption === option;
              const correctAnswer = currentQuestion.answer || currentQuestion.correctAnswer;
              const isCorrect = option === correctAnswer;

              let className = "w-full justify-start text-left p-6 h-auto text-lg transition-all duration-300 border-2 rounded-xl font-medium hover:shadow-md ";

              if (isAnswered) {
                if (isCorrect) {
                  className += "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-400 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/20";
                } else if (isSelected) {
                  className += "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-400 text-red-700 dark:text-red-400 shadow-lg shadow-red-500/20";
                } else {
                  className += "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-60";
                }
              } else if (isSelected) {
                className += "border-blue-400 ring-2 ring-blue-400/50 bg-blue-50 dark:bg-blue-950/20 shadow-lg shadow-blue-500/20";
              } else {
                className += "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10";
              }

              return (
                <Button
                  key={idx}
                  data-option={option}
                  variant="outline"
                  className={className}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                >
                  <span className="mr-4 font-mono text-sm opacity-70 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1 text-left">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-600 ml-3" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-500 ml-3" />}
                </Button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div
            ref={explanationRef}
            className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 p-6 rounded-2xl border-2 border-blue-200/50 dark:border-blue-800/30 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-lg text-blue-700 dark:text-blue-300">Explanation</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {currentQuestion.explanation}
                </p>
              </div>
              <Button
                onClick={nextQuestion}
                size="lg"
                className="ml-6 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 px-6"
              >
                {currentIndex + 1 === questions.length ? (
                  <>
                    <Trophy className="mr-2 h-5 w-5" />
                    Finish Quiz
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
