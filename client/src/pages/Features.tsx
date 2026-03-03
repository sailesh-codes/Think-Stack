import { BrainCircuit, Sparkles, Zap, Lock, Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Generation",
    description: "Our advanced algorithms analyze any topic to create relevant, challenging questions in seconds."
  },
  {
    icon: Sparkles,
    title: "Instant Explanations",
    description: "Learn while you test. Every answer comes with a detailed explanation to help you understand the 'why'."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate a full quiz in under 60 seconds. Spend less time preparing and more time learning."
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your data and generated quizzes are private to you. We never share your learning history."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Take quizzes on the go. Our interface is fully responsive and looks great on any device."
  },
  {
    icon: Globe,
    title: "Any Topic Imaginable",
    description: "From Quantum Physics to Pop Culture, Think Stack can generate a quiz on absolutely anything."
  }
];

export default function Features() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Powerful Features for Modern Learners</h1>
        <p className="text-lg text-muted-foreground">
          Think Stack gives you the superpowers to learn faster and retain more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-card border border-border/50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <feature.icon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-sky-500/20 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start learning?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who are leveling up their knowledge every day.
          </p>
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8">
            <Link href="/api/login">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
