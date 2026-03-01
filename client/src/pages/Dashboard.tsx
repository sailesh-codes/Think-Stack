import { useQuizzes, useGenerateQuiz, useUserUsage } from "@/hooks/use-quizzes";
import { QuizCard } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateQuizSchema } from "@shared/schema";

type GenerateFormValues = z.infer<typeof generateQuizSchema>;

export default function Dashboard() {
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuizzes();
  const { data: userData } = useUserUsage();
  const generateQuiz = useGenerateQuiz();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateQuizSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      amount: 5,
    },
  });

  const onSubmit = (data: GenerateFormValues) => {
    generateQuiz.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  // Determine if user can generate more quizzes
  const isPro = userData?.usage?.isPro;
  const creditsUsed = userData?.usage?.quizzesGenerated || 0;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasCredits = isDevelopment || isPro || creditsUsed < 5;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your AI-generated quizzes and track your progress.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              Create New Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate AI Quiz</DialogTitle>
              <DialogDescription>
                Enter a topic and let our AI create a custom quiz for you in seconds.
              </DialogDescription>
            </DialogHeader>

            {hasCredits ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g. Quantum Physics, History of Rome..."
                    {...form.register("topic")}
                    className="focus-visible:ring-primary"
                  />
                  {form.formState.errors.topic && (
                    <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      onValueChange={(val) => form.setValue("difficulty", val as any)}
                      defaultValue="medium"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Questions</Label>
                    <Select
                      onValueChange={(val) => form.setValue("amount", parseInt(val))}
                      defaultValue="5"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  disabled={generateQuiz.isPending}
                >
                  {generateQuiz.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Out of Credits</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've used all your free generations. Upgrade to Pro for unlimited quizzes.
                  </p>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingQuizzes ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-card rounded-2xl animate-pulse border border-border/50" />
          ))}
        </div>
      ) : quizzes?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No quizzes yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Create your first AI-powered quiz to get started learning something new.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Create First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onSelect={(q) => setLocation(`/quiz/${q.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
