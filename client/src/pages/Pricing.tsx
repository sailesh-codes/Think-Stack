import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCheckout, useUserUsage } from "@/hooks/use-quizzes";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { data: userData } = useUserUsage();
  const createCheckout = useCreateCheckout();

  const isPro = userData?.usage?.isPro;

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    createCheckout.mutate();
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Start for free, upgrade for unlimited power. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-card border border-border rounded-3xl p-8 relative">
          <h3 className="text-2xl font-bold">Free Starter</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">$0</span>
            <span className="ml-2 text-muted-foreground">/ forever</span>
          </div>
          <p className="mt-4 text-muted-foreground">Perfect for trying out the power of AI quizzes.</p>
          
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>5 Free AI Quizzes</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>Standard Topics</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>Basic Analytics</span>
            </li>
          </ul>

          <Button 
            className="w-full mt-8" 
            variant="outline"
            disabled={isPro}
          >
            {isPro ? "Current Plan (Pro Active)" : "Current Plan"}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 relative shadow-2xl shadow-primary/20 overflow-hidden group">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-purple-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
            MOST POPULAR
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          <h3 className="text-2xl font-bold flex items-center gap-2">
            Pro Unlimited <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">$9</span>
            <span className="ml-2 text-slate-300">/ month</span>
          </div>
          <p className="mt-4 text-slate-300">Unlock your full learning potential.</p>
          
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>
              <span>Unlimited AI Quizzes</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>
              <span>Advanced Topics & Customization</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>
              <span>Priority Support</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>
              <span>Export to PDF (Coming Soon)</span>
            </li>
          </ul>

          <Button 
            className="w-full mt-8 bg-white text-slate-900 hover:bg-slate-100 border-0 font-semibold"
            onClick={handleSubscribe}
            disabled={isPro || createCheckout.isPending}
          >
            {isPro ? (
              "Already Subscribed"
            ) : createCheckout.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              "Upgrade to Pro"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
