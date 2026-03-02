import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import FAQ from "@/pages/FAQ";
import Quiz from "@/pages/Quiz";
import QuizPlayer from "@/pages/QuizPlayer";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import QuizRoom from "@/pages/QuizRoom";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ModernToastManager } from "@/components/ModernToastManager";

const ADMIN_EMAILS = new Set([
  "codecraft2k@gmail.com",
  "thinkstack.ai.cc@gmail.com",
]);

function Router() {
  const { user, isLoading } = useAuth();

  const isAdmin = user?.email
    ? ADMIN_EMAILS.has(user.email.toLowerCase())
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/faq" component={FAQ} />
          <Route path="/login" component={Login} />
          <Route path="/quiz">
            {user ? <Quiz /> : <Login />}
          </Route>
          <Route path="/dashboard">
            {user ? <Dashboard /> : <Login />}
          </Route>
          <Route path="/quiz/:id">
            {user ? <QuizPlayer /> : <Login />}
          </Route>
          <Route path="/quiz-room/:id">
            <QuizRoom />
          </Route>
          <Route path="/admin">
            {user ? (isAdmin ? <Admin /> : <NotFound />) : <Login />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
        <SonnerToaster />
        <ModernToastManager />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
