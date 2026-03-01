import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, BrainCircuit, CheckCircle2, Sparkles, Zap, 
  Shield, BookOpen, Users, Target, Award, Clock, BarChart3,
  GraduationCap, Globe, Star, ChevronDown, Check, X
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { animations } from "@/lib/gsap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Initialize GSAP scroll animations
  useEffect(() => {
    // Hide the text split element initially
    gsap.set('.text-split-main', { opacity: 0 })
    
    // Hero section animations with enhanced text split
    animations.fadeIn('.hero-content', 1, 0.2)
    
    // Enhanced text split animation for main heading - each letter animates separately
    setTimeout(() => {
      const mainElement = document.querySelector('.text-split-main')
      if (mainElement) {
        const text = mainElement.textContent || ''
        const chars = text.split('').map((char, index) => {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00A0' : char
          span.style.display = 'inline-block'
          span.style.opacity = '0'
          span.style.transform = 'translateY(100px) rotate(180deg) scale(0)'
          return span
        })
        
        mainElement.innerHTML = ''
        chars.forEach(span => mainElement.appendChild(span))
        
        // Make the container visible now that it's split
        gsap.set('.text-split-main', { opacity: 1 })
        
        // Create dramatic staggered animation for each letter
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.05,
            from: "random",
            ease: "power2.inOut"
          },
          ease: "back.out(1.7)"
        })
      }
    }, 500)
    
    animations.slideUp('.hero-description', 1.2, 2)
    animations.staggerFadeIn('.hero-button', 0.2, 2.3)
    animations.staggerFadeIn('.hero-feature', 0.1, 2.6)

    // Trusted by section - scroll triggered
    animations.scrollReveal('.trusted-section', 'bottom')
    animations.staggerFadeIn('.stat-item', 0.15)

    // How it works section - cinematic single card reveal
    const howItWorksTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".how-it-works-section",
        start: "top top",
        end: "+=300%",
        scrub: 0.8,
        pin: true,
        pinSpacing: true,
        markers: false,
        anticipatePin: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Smooth progress updates
          const progress = self.progress;
          // You can add custom logic here if needed
        }
      }
    })

    // Set initial states - ensure clean start
    gsap.set(".step-card-1", { opacity: 0, scale: 0.9, y: 50 })
    gsap.set(".step-card-2", { opacity: 0, scale: 0.9, y: 50 })
    gsap.set(".step-card-3", { opacity: 0, scale: 0.9, y: 50 })
    gsap.set(".how-it-works-title", { opacity: 0, y: -30 })

    // Phase 1: Title appears and first card centers (0-25% progress)
    howItWorksTimeline
      .to(".how-it-works-title", { 
        opacity: 1, 
        y: 0, 
        duration: 0.25, 
        ease: "power2.out" 
      }, 0)
      .to(".step-card-1", { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.25, 
        ease: "power2.out" 
      }, 0.1)

    // Phase 2: First card fades out, second card fades in (25-50% progress)
    howItWorksTimeline
      .to(".step-card-1", { 
        opacity: 0, 
        scale: 0.8, 
        y: -50, 
        duration: 0.25, 
        ease: "power2.inOut" 
      }, 0.25)
      .to(".step-card-2", { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.25, 
        ease: "power2.out" 
      }, 0.25)

    // Phase 3: Second card fades out, third card fades in (50-75% progress)
    howItWorksTimeline
      .to(".step-card-2", { 
        opacity: 0, 
        scale: 0.8, 
        y: -50, 
        duration: 0.25, 
        ease: "power2.inOut" 
      }, 0.5)
      .to(".step-card-3", { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.25, 
        ease: "power2.out" 
      }, 0.5)

    // Phase 4: Third card fades out and title fades (75-100% progress)
    howItWorksTimeline
      .to(".step-card-3", { 
        opacity: 0, 
        scale: 0.8, 
        y: -50, 
        duration: 0.25, 
        ease: "power2.inOut" 
      }, 0.75)
      .to(".how-it-works-title", { 
        opacity: 0, 
        y: -30, 
        duration: 0.25, 
        ease: "power2.in" 
      }, 0.75)

    // Cleanup function
    return () => {
      // Kill all ScrollTriggers and timelines
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      howItWorksTimeline.kill()
    }

    // Feature demo section - scroll triggered
    animations.scrollReveal('.feature-demo-left', 'left')
    animations.scrollReveal('.feature-demo-right', 'right')
    animations.staggerFadeIn('.feature-list-item', 0.1)

    // Features grid - scroll triggered
    animations.scrollReveal('.features-title', 'bottom')
    animations.staggerFadeIn('.feature-card', 0.15)

    // Testimonials - scroll triggered
    animations.scrollReveal('.testimonials-title', 'bottom')
    animations.staggerFadeIn('.testimonial-card', 0.2)

    // CTA section - scroll triggered
    animations.scrollReveal('.cta-section', 'bottom')
    animations.fadeIn('.cta-content', 1, 0.3)
  }, [])

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
        
        <div className="hero-content">
          

          <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="text-split-main" style={{ opacity: 0 }}>Elevate your learning with AI</span>
          </h1>

          <p className="hero-description text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter any topic, select difficulty, and let our AI create perfect quizzes instantly. 
            Start with 5 free generations - no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="hero-button rounded-full px-8 text-lg h-14 shadow-lg shadow-slate-900/40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:brightness-110 transition-all duration-200"
            >
              <Link href="/dashboard" data-testid="button-start-generating">
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hero-button rounded-full px-8 text-lg h-14 border border-slate-800 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors duration-200"
            >
              <Link href="/pricing" data-testid="button-view-pricing">
                View Pricing
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="hero-feature flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="hero-feature flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>5 free quizzes</span>
            </div>
            <div className="hero-feature flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-section border-y border-border/40 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">Trusted by learners worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Quizzes Generated", value: "10,000+", icon: Sparkles },
              { label: "Active Learners", value: "2,500+", icon: Users },
              { label: "Topics Covered", value: "Unlimited", icon: BookOpen },
              { label: "Satisfaction Rate", value: "99.9%", icon: Star },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="stat-item flex flex-col items-center"
              >
                <stat.icon className="h-6 w-6 text-primary mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center relative">
        <div className="how-it-works-title text-center mb-16 absolute top-20 left-0 right-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Think Stack Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professional quizzes in three simple steps
          </p>
        </div>

        <div className="relative w-full max-w-2xl h-96 flex items-center justify-center">
          {[
            { step: "01", title: "Enter Topic", description: "Type any subject you want to study - from history to coding", icon: Target },
            { step: "02", title: "Select Difficulty", description: "Choose Easy, Medium, or Hard based on your current level", icon: BarChart3 },
            { step: "03", title: "Generate & Learn", description: "Get your AI-crafted quiz instantly with detailed explanations", icon: GraduationCap },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`step-card-${idx + 1} absolute w-full max-w-lg`}
            >
              <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-800/80 shadow-2xl group hover:shadow-3xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent opacity-40" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent opacity-40" />
                
                <div className="relative z-10 p-10">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-6xl font-bold text-blue-500">{item.step}</div>
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4 text-white">{item.title}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-xl text-slate-200/90 leading-relaxed">{item.description}</p>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <ChevronDown className="h-6 w-6" />
            <span className="text-sm">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Feature Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] mx-4 lg:mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="feature-demo-left order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b border-border/50 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground ml-auto font-mono"></span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Topic</label>
                  <div className="h-12 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl flex items-center px-4 text-foreground">
                    History of AI
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
            </div>
          </div>

          <div className="feature-demo-right order-1 lg:order-2">
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
                <li 
                  key={i} 
                  className="feature-list-item flex items-center gap-3"
                >
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="features-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to learn faster</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for students, teachers, and lifelong learners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="feature-card"
            >
              <Card className="h-full border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg hover:shadow-xl transition-shadow rounded-3xl">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200/90">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="testimonials-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by learners everywhere</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about Think Stack
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card"
            >
              <Card className=" bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem]  text-center text-white relative overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed text-white">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-blue-500">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground text-blue-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section moved to dedicated /faq page */}

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="cta-section max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary blur-[100px] rounded-full opacity-40" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 blur-[100px] rounded-full opacity-40" />
          
          <div className="cta-content relative z-10">
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
        </div>
      </section>

      
    </div>
  );
}
