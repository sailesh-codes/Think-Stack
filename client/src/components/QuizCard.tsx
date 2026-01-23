import { motion } from "framer-motion";
import { BookOpen, Trophy, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Quiz } from "@shared/schema";
import { useDeleteQuiz } from "@/hooks/use-quizzes";

interface QuizCardProps {
  quiz: Quiz;
  onSelect: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onSelect }: QuizCardProps) {
  const deleteQuiz = useDeleteQuiz();

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card hover:shadow-xl hover:shadow-primary/5 border border-border/50 rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge 
          variant="outline" 
          className={`capitalize ${difficultyColors[quiz.difficulty as keyof typeof difficultyColors]}`}
        >
          {quiz.difficulty}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this quiz?")) {
              deleteQuiz.mutate(quiz.id);
            }
          }}
          disabled={deleteQuiz.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {quiz.topic}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 h-10">
        Test your knowledge on {quiz.topic} with these AI-generated questions.
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-4">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          <span>{(quiz.questions as any[]).length} Qs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>~{Math.ceil((quiz.questions as any[]).length * 1.5)} min</span>
        </div>
      </div>

      <Button 
        onClick={() => onSelect(quiz)}
        className="w-full mt-4 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border-0 transition-colors"
      >
        Start Quiz
        <Trophy className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
}
