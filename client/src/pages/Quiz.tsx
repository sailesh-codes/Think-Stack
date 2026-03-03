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
import { Loader2, Sparkles, Users, Trophy, Lightbulb, Target, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateQuizSchema } from "@shared/schema";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { QuizGenerationLoader } from "@/components/QuizGenerationLoader";
import { gsap } from "@/lib/gsap";
import { useModernToast } from "@/components/ModernToastManager";

type GenerateFormValues = z.infer<typeof generateQuizSchema>;

export default function Quiz() {
  const { user, isLoading } = useAuth();
  const generateQuiz = useGenerateQuiz();
  const { data: userData } = useUserUsage();
  const [quizMode, setQuizMode] = useState<"individual" | "organization">("individual");
  const [orgQuizzesCreated, setOrgQuizzesCreated] = useState(0);
  const modernToast = useModernToast();

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const modeButtonsRef = useRef<HTMLDivElement>(null);

  // Check for organization mode in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "organization") {
      setQuizMode("organization");
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    if (containerRef.current && titleRef.current && formRef.current && modeButtonsRef.current) {
      const tl = gsap.timeline();

      // Animate title
      tl.fromTo(titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Animate mode buttons
      tl.fromTo(modeButtonsRef.current.children,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.4"
      );

      // Animate form
      tl.fromTo(formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, []);

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    window.location.href = "/login";
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateQuizSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      amount: 5,
    },
  });

  const onSubmit = (data: GenerateFormValues) => {
    console.log('onSubmit called with data:', data);
    console.log('quizMode:', quizMode);

    if (quizMode === "organization") {
      // Check organization quiz limit using actual server data
      const orgQuizzesUsed = userData?.usage?.organizationQuizzesGenerated || 0;

      // Allow unlimited for development and admin emails
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isAdminEmail = user?.email && ['codecraft2k@gmail.com', 'thinkstack.ai.cc@gmail.com'].includes(user.email);

      console.log('orgQuizzesUsed:', orgQuizzesUsed, 'isDevelopment:', isDevelopment, 'isAdminEmail:', isAdminEmail);

      if (!isDevelopment && !isAdminEmail && orgQuizzesUsed >= 3) {
        modernToast.error("Organization Quiz Limit Reached", "You've used all 3 free Organization quizzes. Please upgrade to continue creating live quizzes.");
        return;
      }

      console.log('Starting organization quiz generation...');

      // Create organization quiz
      generateQuiz.mutate({ ...data, isOrganization: true }, {
        onSuccess: (quiz) => {
          console.log('Organization quiz created successfully:', quiz);
          modernToast.success("Live Quiz Room Created!", "Organization quiz created! Share the link to start your live quiz session.");
          // Redirect to organization quiz room
          const redirectUrl = `/quiz-room/${quiz.id}?creator=${user?.id}`;
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        },
        onError: (error) => {
          console.error('Organization quiz creation failed:', error);
          modernToast.error("Quiz Creation Failed", `Failed to create organization quiz: ${error.message}`);
        },
      });
    } else {
      console.log('Starting individual quiz generation...');
      // Regular individual quiz
      generateQuiz.mutate(data, {
        onSuccess: (quiz) => {
          console.log('Individual quiz created successfully:', quiz);
          modernToast.success("Quiz Generated Successfully!", "Individual quiz created! Starting your quiz...");
          // Redirect to the generated quiz page
          const redirectUrl = `/quiz/${quiz.id}`;
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        },
        onError: (error) => {
          console.error('Individual quiz creation failed:', error);
          modernToast.error("Quiz Generation Failed", `Failed to create quiz: ${error.message}`);
        },
      });
    }
  };

  const isPro = userData?.usage?.isPro;
  const creditsUsed = userData?.usage?.quizzesGenerated || 0;
  const creditLimit = 5;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAdminEmail = user?.email && ['codecraft2k@gmail.com', 'thinkstack.ai.cc@gmail.com'].includes(user.email);
  const hasCredits = isDevelopment || isPro || isAdminEmail || creditsUsed < creditLimit;

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen bg-white pt-24"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              ref={titleRef}
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Create Your Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Generate personalized quizzes powered by AI
            </p>
          </div>

          {/* Mode Selection */}
          <div ref={modeButtonsRef} className="flex gap-4 mb-8 justify-center">
            <Button
              onClick={() => setQuizMode("individual")}
              variant={quizMode === "individual" ? "default" : "outline"}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                quizMode === "individual"
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg"
                  : "bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300"
              }`}
            >
              <Target className="mr-2 h-4 w-4" />
              Individual Quiz
            </Button>
            <Button
              onClick={() => setQuizMode("organization")}
              variant={quizMode === "organization" ? "default" : "outline"}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                quizMode === "organization"
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg"
                  : "bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300"
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Organization Quiz
            </Button>
          </div>

          {/* Quiz Generation Form */}
          <Card
            ref={formRef}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 shadow-xl"
          >
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                <Lightbulb className="h-6 w-6 text-blue-500" />
                {quizMode === "organization" ? "Create Live Quiz Room" : "Generate Quiz"}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {quizMode === "organization"
                  ? "Create an interactive quiz for your team or classroom"
                  : "Create a personalized quiz for individual learning"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Topic *
                  </Label>
                  <Input
                    id="topic"
                    {...form.register("topic")}
                    placeholder="e.g., JavaScript, World History, Biology..."
                    className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                  />
                  {form.formState.errors.topic && (
                    <p className="text-sm text-red-500">{form.formState.errors.topic.message}</p>
                  )}
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Difficulty Level
                  </Label>
                  <Select onValueChange={(value) => form.setValue("difficulty", value as any)}>
                    <SelectTrigger className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                      <SelectItem value="medium">Medium - Intermediate level</SelectItem>
                      <SelectItem value="hard">Hard - Advanced topics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Questions */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Questions
                  </Label>
                  <Select onValueChange={(value) => form.setValue("amount", parseInt(value))}>
                    <SelectTrigger className="h-12 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="7">7 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Credits Info */}
                <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {quizMode === "organization" ? "Organization Credits" : "Credits"}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {quizMode === "organization"
                        ? (() => {
                            const orgUsed = userData?.usage?.organizationQuizzesGenerated || 0;
                            if (isDevelopment || isAdminEmail) {
                              return "Unlimited (Development/Admin)";
                            }
                            return `${Math.max(3 - orgUsed, 0)}/3 free quizzes left`;
                          })()
                        : `${Math.max(creditLimit - creditsUsed, 0)}/${creditLimit} free generations left`
                      }
                    </span>
                  </div>
                  {quizMode === "organization" && !isDevelopment && !isAdminEmail && (userData?.usage?.organizationQuizzesGenerated || 0) >= 3 && (
                    <span className="text-xs text-red-500">
                      You've used all free Organization quizzes. Upgrade to continue.
                    </span>
                  )}
                  {quizMode !== "organization" && !hasCredits && (
                    <span className="text-xs text-red-500">
                      You have used all free credits. Upgrade on the Dashboard or Pricing page to continue.
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full h-14 rounded-xl text-lg font-medium transition-all duration-300 ${
                    quizMode === "organization"
                      ? "bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                      : "bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                  }`}
                  disabled={generateQuiz.isPending || (quizMode === "organization" ? (!isDevelopment && !isAdminEmail && (userData?.usage?.organizationQuizzesGenerated || 0) >= 3) : !hasCredits)}
                  onClick={() => console.log('Button clicked, isPending:', generateQuiz.isPending)}
                >
                  {generateQuiz.isPending ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Generating quiz...
                    </>
                  ) : quizMode === "organization" ? (
                    <>
                      <Users className="mr-3 h-5 w-5" />
                      Create Live Quiz Room
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Loading Screen */}
      <QuizGenerationLoader isGenerating={generateQuiz.isPending} mode={quizMode} />
    </>
  );
}
