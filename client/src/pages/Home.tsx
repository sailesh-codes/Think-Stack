import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, BrainCircuit, CheckCircle2, Sparkles, Zap, 
  Shield, BookOpen, Users, Target, Award, Clock, BarChart3,
  GraduationCap, Globe, Star, ChevronDown, Check, X
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const features = [
    { icon: Zap, title: "Instant Generation", description: "Create quizzes in seconds with our advanced AI engine" },
    { icon: Target, title: "Adaptive Difficulty", description: "Questions scale to match your learning level" },
    { icon: BookOpen, title: "Detailed Explanations", description: "Learn why each answer is correct or wrong" },
    { icon: BarChart3, title: "Progress Analytics", description: "Track your improvement over time" },
    { icon: Shield, title: "Secure & Private", description: "Your data is encrypted and never shared" },
    { icon: Globe, title: "Any Topic", description: "From history to quantum physics - we cover it all" },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Medical Student",
      content: "Think Stack helped me ace my NEET exams. The AI-generated questions are incredibly relevant and challenging.",
      avatar: "SM"
    },
    {
      name: "James K.",
      role: "High School Teacher",
      content: "I save 3+ hours every week on quiz preparation. My students love the variety of questions.",
      avatar: "JK"
    },
    {
      name: "Priya R.",
      role: "Corporate Trainer",
      content: "The shareable quiz links make it easy to assess my team's knowledge. Highly recommended!",
      avatar: "PR"
    },
  ];

  const faqs = [
    {
      question: "How many free quizzes can I generate?",
      answer: "Free users get 5 quiz generations per account. Each generation creates a complete quiz with multiple questions based on your topic and difficulty selection."
    },
    {
      question: "What happens after I use all my free credits?",
      answer: "Once you've used your 5 free credits, you can upgrade to Pro for unlimited quiz generation, or wait for our monthly credit refresh (coming soon)."
    },
    {
      question: "Can I edit quizzes after generating them?",
      answer: "Yes! You can review and modify any generated quiz before sharing it. Edit questions, change answers, or adjust explanations to fit your needs."
    },
    {
      question: "How does the shareable quiz link work?",
      answer: "Pro users can generate unique links for any quiz. Share these links with students, colleagues, or friends - they can take the quiz without creating an account."
    },
    {
      question: "Is my data safe and private?",
      answer: "Absolutely. We use enterprise-grade encryption and never share your data with third parties. Your quizzes and results remain completely private unless you choose to share them."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro subscription at any time with no questions asked. You'll retain access until the end of your billing period."
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      description: "Perfect for trying out Think Stack",
      price: { monthly: "0", yearly: "0" },
      features: [
        { text: "5 quiz generations", included: true },
        { text: "Basic difficulty levels", included: true },
        { text: "Question explanations", included: true },
        { text: "Shareable quiz links", included: false },
        { text: "Analytics dashboard", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started",
      href: "/api/login",
      popular: false,
      gradient: "from-slate-500 to-slate-600"
    },
    {
      name: "Pro",
      description: "For serious learners & educators",
      price: { monthly: "299", yearly: "199" },
      currency: "₹",
      features: [
        { text: "Unlimited quiz generations", included: true },
        { text: "All difficulty levels", included: true },
        { text: "Detailed explanations", included: true },
        { text: "Shareable quiz links", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "Email support", included: true },
      ],
      cta: "Upgrade to Pro",
      href: "/dashboard",
      popular: true,
      gradient: "from-primary to-purple-600"
    },
    {
      name: "Team",
      description: "For organizations & institutions",
      price: { monthly: "999", yearly: "799" },
      currency: "₹",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Up to 10 team members", included: true },
        { text: "Team analytics & reports", included: true },
        { text: "Custom branding", included: true },
        { text: "API access", included: true },
        { text: "Dedicated support", included: true },
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full -z-10 opacity-40" />
        
        <motion.div {...fadeInUp}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              AI-Powered Learning Revolution
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Generate AI Quizzes <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
              in 60 seconds
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter any topic, select difficulty, and let our AI create perfect quizzes instantly. 
            Start with 5 free generations - no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
              <Link href="/dashboard" data-testid="button-start-generating">
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-2">
              <a href="#pricing" data-testid="button-view-pricing">
                View Pricing
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>5 free quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-border/40 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">Trusted by learners worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Quizzes Generated", value: "10,000+", icon: Sparkles },
              { label: "Active Learners", value: "2,500+", icon: Users },
              { label: "Topics Covered", value: "Unlimited", icon: BookOpen },
              { label: "Satisfaction Rate", value: "99.9%", icon: Star },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Think Stack Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional quizzes in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Enter Topic", description: "Type any subject you want to study - from history to coding", icon: Target },
            { step: "02", title: "Select Difficulty", description: "Choose Easy, Medium, or Hard based on your current level", icon: BarChart3 },
            { step: "03", title: "Generate & Learn", description: "Get your AI-crafted quiz instantly with detailed explanations", icon: GraduationCap },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative"
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent" />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-primary/20">{item.step}</span>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] mx-4 lg:mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6 border-b border-border/50 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground ml-auto font-mono">think-stack.ai</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Topic</label>
                  <div className="h-12 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl flex items-center px-4 text-foreground">
                    History of Ancient Rome
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-green-500/10 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center font-medium">Easy</div>
                    <div className="h-12 bg-primary/10 border border-primary text-primary rounded-xl flex items-center justify-center font-medium">Medium</div>
                    <div className="h-12 bg-purple-500/10 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center font-medium">Hard</div>
                  </div>
                </div>
                <Button className="w-full h-14 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 rounded-xl mt-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Quiz
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              <span>Smart Learning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Just type a topic. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">AI handles the rest.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI engine analyzes millions of educational resources to create perfectly balanced quizzes tailored to your learning goals.
            </p>
            <ul className="space-y-4">
              {[
                "Instant feedback on every answer",
                "Difficulty adapts to your progress",
                "Detailed explanations for deep learning",
                "Save and review past quizzes anytime"
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to learn faster</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for students, teachers, and lifelong learners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your learning journey
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-full">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly" 
                    ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                  billingCycle === "yearly" 
                    ? "bg-white dark:bg-slate-800 shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="absolute -top-3 -right-3 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                  -33%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full relative overflow-hidden ${
                  plan.popular 
                    ? "border-2 border-primary shadow-xl shadow-primary/10" 
                    : "border-2 hover:border-muted-foreground/30"
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`inline-flex mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${plan.gradient} items-center justify-center mb-4`}>
                      {plan.name === "Free" && <Sparkles className="h-7 w-7 text-white" />}
                      {plan.name === "Pro" && <Zap className="h-7 w-7 text-white" />}
                      {plan.name === "Team" && <Users className="h-7 w-7 text-white" />}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold">
                        {plan.currency || ""}{billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                      </span>
                      {plan.price.monthly !== "0" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-green-500" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                              <X className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      asChild 
                      className={`w-full h-12 rounded-xl ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link href={plan.href} data-testid={`button-pricing-${plan.name.toLowerCase()}`}>
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by learners everywhere</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about Think Stack
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-2">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Think Stack
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="bg-card border-2 rounded-xl px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6" data-testid={`faq-trigger-${idx}`}>
                  <span className="font-medium text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary blur-[100px] rounded-full opacity-40" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 blur-[100px] rounded-full opacity-40" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              <span>Start learning in 60 seconds</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to supercharge your learning?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners using AI-powered quizzes. Start with 5 free generations today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 text-lg h-14">
                <Link href="/api/login" data-testid="button-cta-start">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-white/30 text-white hover:bg-white/10">
                <a href="#pricing" data-testid="button-cta-pricing">
                  View Pricing
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-primary to-purple-600 p-2 rounded-lg">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Think Stack</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Powered by OpenAI</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>10,000+ quizzes generated</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>SOC 2 Compliant</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Think Stack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
