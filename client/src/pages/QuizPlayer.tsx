import { useQuiz } from "@/hooks/use-quizzes";
import { useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPlayer() {
  const [, params] = useRoute("/quiz/:id");
  const quizId = parseInt(params?.id || "0");
  const { data: quiz, isLoading } = useQuiz(quizId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <Button asChild><Link href="/dashboard">Return Home</Link></Button>
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
    
    if (option === currentQuestion.answer) {
      setScore(s => s + 1);
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-bg">
        <Card className="w-full max-w-md p-8 text-center shadow-2xl border-primary/10">
          <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-8">
            You scored {score} out of {questions.length} correct on <span className="font-semibold text-primary">{quiz.topic}</span>.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">Exit Quiz</Link>
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <Progress value={progress} className="h-2 mb-8 bg-slate-200 dark:bg-slate-800" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.answer;
                
                let variant = "outline";
                let className = "w-full justify-start text-left p-6 h-auto text-lg hover:border-primary/50 transition-all";

                if (isAnswered) {
                  if (isCorrect) {
                    className += " bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400";
                  } else if (isSelected) {
                    className += " bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400";
                  } else {
                    className += " opacity-50";
                  }
                } else if (isSelected) {
                  className += " border-primary ring-1 ring-primary bg-primary/5";
                }

                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={className}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                  >
                    <span className="mr-4 font-mono text-sm opacity-50">{String.fromCharCode(65 + idx)}.</span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 ml-2" />}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm"
          >
            <div className="text-sm">
              <span className="font-semibold block mb-1">Explanation:</span>
              <span className="text-muted-foreground">{currentQuestion.explanation}</span>
            </div>
            <Button onClick={nextQuestion} size="lg" className="ml-4 shrink-0">
              {currentIndex + 1 === questions.length ? "Finish" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
