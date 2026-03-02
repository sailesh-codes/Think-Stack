import { useRef, useEffect } from "react";
import { BookOpen, Trophy, Clock, Trash2, Users, Sparkles, Target, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Quiz } from "@shared/schema";
import { useDeleteQuiz } from "@/hooks/use-quizzes";
import { gsap } from "@/lib/gsap";

interface QuizCardProps {
  quiz: Quiz;
  onSelect: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onSelect }: QuizCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const deleteQuiz = useDeleteQuiz();

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  useEffect(() => {
    if (cardRef.current) {
      // Initial entrance animation with stagger
      const tl = gsap.timeline();

      tl.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
          rotationY: -15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );

      // Floating animation for the glow effect
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.1,
          duration: 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // Subtle icon rotation
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          rotation: 5,
          duration: 4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // Add hover animations
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          y: -12,
          scale: 1.03,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 25px 50px rgba(251, 146, 60, 0.25)"
        });

        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: 0.6,
            scale: 1.2,
            duration: 0.3
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 8px 25px rgba(251, 146, 60, 0.15)"
        });

        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: 0.3,
            scale: 1,
            duration: 0.3
          });
        }
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cardRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        tl.kill();
      };
    }
  }, []);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Target className="h-4 w-4" />;
      case 'medium':
        return <Zap className="h-4 w-4" />;
      case 'hard':
        return <Brain className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 dark:from-gray-900 dark:via-orange-950/10 dark:to-amber-950/5 border-2 border-orange-200/60 dark:border-orange-800/40 rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl"
      style={{
        boxShadow: "0 8px 25px rgba(251, 146, 60, 0.15)"
      }}
    >
      {/* Animated background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-transparent opacity-30 rounded-3xl blur-xl scale-110"
      ></div>

      <div className="relative z-10">
        {/* Header with animated icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl shadow-lg">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant="outline"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${difficultyColors[quiz.difficulty as keyof typeof difficultyColors]}`}
              >
                {getDifficultyIcon(quiz.difficulty)}
                {quiz.difficulty.toUpperCase()}
              </Badge>
              {quiz.isOrganization && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 bg-orange-100/90 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-700 px-3 py-1.5 text-xs font-semibold"
                >
                  <Users className="h-3 w-3" />
                  LIVE QUIZ
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl -mt-2 -mr-2"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this quiz?")) {
                deleteQuiz.mutate(quiz.id);
              }
            }}
            disabled={deleteQuiz.isPending}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Quiz title with gradient text */}
        <h3 className="text-2xl font-bold mb-4 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200">
          {quiz.topic}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-8 line-clamp-2 h-12 leading-relaxed text-sm">
          Challenge yourself with AI-generated questions about {quiz.topic}. Test your knowledge and learn something new!
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10 rounded-2xl border border-orange-200/50 dark:border-orange-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
              <BookOpen className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Questions</p>
              <p className="text-lg font-bold text-orange-600">{(quiz.questions as any[]).length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Duration</p>
              <p className="text-lg font-bold text-amber-600">~{Math.ceil((quiz.questions as any[]).length * 1.5)}m</p>
            </div>
          </div>
        </div>

        {/* Enhanced Start Quiz button */}
        <Button
          onClick={() => onSelect(quiz)}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 transition-all duration-300 font-semibold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-slate-500/30 text-base group-hover:scale-105"
        >
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-5 w-5" />
            <span>Start Quiz</span>
            <div className="w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
          </div>
        </Button>
      </div>
    </div>
  );
}
