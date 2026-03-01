import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useGSAP } from "@/hooks/useGSAP";
import { gsap } from "gsap";

function AnimatedRouter() {
  const { isLoading } = useAuth();
  
  // Animate loading spinner container
  const spinnerRef = useGSAP(
    (element) => {
      const spinner = element.querySelector('.spinner-icon');
      if (spinner) {
        return gsap.to(spinner, { 
          rotation: 360, 
          duration: 1, 
          repeat: -1, 
          ease: "none" 
        });
      }
      return gsap.to(element, { opacity: 1, duration: 0.5 });
    },
    [isLoading]
  );

  // Animate main layout
  const layoutRef = useGSAP(
    (element) => gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    ),
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div ref={spinnerRef}>
          <Loader2 className="h-8 w-8 text-primary spinner-icon" />
        </div>
      </div>
    );
  }

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/faq" component={FAQ} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/quiz/:id" component={QuizPlayer} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function AnimatedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatedRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default AnimatedApp;
