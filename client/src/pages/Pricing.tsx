import { Check, Zap, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCheckout, useUserUsage } from "@/hooks/use-quizzes";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="absolute inset-0 -z-10 bg-white" />

      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
          Choose the plan that fits your flow
        </h1>
        <p className="text-lg text-muted-foreground">
          Start for free, upgrade when youre ready. No contracts, cancel anytime.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <motion.div
          className="bg-card/90 border border-border rounded-3xl p-8 relative backdrop-blur-sm hover:border-blue-500/60 hover:shadow-[0_18px_45px_rgba(59,130,246,0.25)] transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <h3 className="text-2xl font-bold">Free Starter</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">₹0</span>
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
            className="w-full mt-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:brightness-110 border-0 transition-all duration-200"
            disabled={isPro}
          >
            {isPro ? "Current Plan (Pro Active)" : "Current Plan"}
          </Button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          className="bg-white text-black border border-blue-500/60 rounded-3xl p-8 relative shadow-2xl shadow-blue-500/30 overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-black text-xs font-bold px-3 py-1 rounded-bl-xl">
            MOST POPULAR
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-sky-500/20 to-blue-500/15 opacity-0 group-hover:opacity-100 transition-opacity" />

          <h3 className="text-2xl font-bold flex items-center gap-2">
            Pro Unlimited <Zap className="h-5 w-5 text-blue-500 fill-blue-500" />
          </h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-black">$9</span>
            <span className="ml-2 text-gray-600">/ month</span>
          </div>
          <p className="mt-4 text-gray-600">Unlock your full learning potential.</p>
          
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
            className="w-full mt-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:brightness-110 border-0 font-semibold transition-all duration-200"
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
        </motion.div>

        {/* Organization Plan */}
        <motion.div
          className="bg-gradient-to-br from-blue-500/10 to-sky-500/10 border border-blue-500/30 rounded-3xl p-8 relative backdrop-blur-sm hover:border-blue-500/60 hover:shadow-[0_18px_45px_rgba(59,130,246,0.25)] transition-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.1 }}
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-black text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Users className="h-3 w-3" />
            TEAM
          </div>
          
          <h3 className="text-2xl font-bold flex items-center gap-2">
            Organization <Crown className="h-5 w-5 text-blue-500" />
          </h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">₹0</span>
            <span className="ml-2 text-muted-foreground">/ 3 trials</span>
          </div>
          <p className="mt-4 text-muted-foreground">Perfect for team learning and training sessions.</p>
          
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Live Multiplayer Quizzes</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Up to 10 Participants</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Real-time Results</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Shareable Quiz Links</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Randomized Questions</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-blue-500" />
              <span>Leaderboard & Points</span>
            </li>
          </ul>

          <Button
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 border-0 font-semibold transition-all duration-200"
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = "/login";
                return;
              }
              // Navigate to quiz page with organization mode
              window.location.href = "/quiz?mode=organization";
            }}
          >
            Try Organization
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            3 free sessions, then upgrade for unlimited
          </p>
        </motion.div>
      </div>
    </div>
  );
}
