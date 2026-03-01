import { useGenerateQuiz, useUserUsage } from "@/hooks/use-quizzes";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateQuizSchema } from "@shared/schema";
import { motion } from "framer-motion";

type GenerateFormValues = z.infer<typeof generateQuizSchema>;

export default function Quiz() {
  const generateQuiz = useGenerateQuiz();
  const { data: userData } = useUserUsage();

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
      onSuccess: (quiz) => {
        // Redirect to the generated quiz page
        window.location.href = `/quiz/${quiz.id}`;
      },
    });
  };

  const isPro = userData?.usage?.isPro;
  const creditsUsed = userData?.usage?.quizzesGenerated || 0;
  const creditLimit = 5;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasCredits = isDevelopment || isPro || creditsUsed < creditLimit;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl w-full relative">
        <div className="absolute -top-40 -right-32 w-72 h-72 bg-primary/20 blur-3xl rounded-full -z-10" />
        <div className="absolute -bottom-40 -left-32 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                AI Quiz Generator
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Generate a custom quiz
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter a topic, choose difficulty and question count. Our AI will create a quiz in seconds.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white relative overflow-hidden border border-slate-800/80 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Quiz settings</CardTitle>
              <CardDescription className="text-slate-300">
                Fine-tune your quiz before generating with AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g. Data Structures, World War II, React Hooks..."
                    {...form.register("topic")}
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-primary"
                  />
                  {form.formState.errors.topic && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.topic.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      onValueChange={(val) => form.setValue("difficulty", val as any)}
                      defaultValue={form.getValues("difficulty")}
                    >
                      <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white">
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
                    <Label>Number of questions</Label>
                    <Select
                      onValueChange={(val) => form.setValue("amount", parseInt(val))}
                      defaultValue={String(form.getValues("amount"))}
                    >
                      <SelectTrigger className="bg-slate-900/60 border-slate-700 text-white">
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Questions</SelectItem>
                        <SelectItem value="5">5 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-300">
                  <div>
                    <span className="font-medium text-foreground">Credits</span>{" "}
                    <span>
                      {isDevelopment
                        ? "Unlimited (Development)"
                        : isPro
                        ? "Unlimited (Pro)"
                        : `${Math.max(creditLimit - creditsUsed, 0)}/${creditLimit} free generations left`}
                    </span>
                  </div>
                  {!hasCredits && (
                    <span className="text-xs text-destructive">
                      You have used all free credits. Upgrade on the Dashboard or Pricing page to continue.
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 rounded-xl text-base"
                  disabled={generateQuiz.isPending || !hasCredits}
                >
                  {generateQuiz.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
