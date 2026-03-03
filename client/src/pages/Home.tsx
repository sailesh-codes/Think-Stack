import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowRight, BrainCircuit, CheckCircle2, Sparkles, Zap, 
  Shield, BookOpen, Users, Target, Award, Clock, BarChart3,
  GraduationCap, Globe, Star, ChevronDown, Check, X
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import * as PIXI from 'pixi.js';
import { gsap } from "@/lib/gsap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { animations } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // PIXI refs
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const pixiContainerRef = useRef<HTMLDivElement>(null);

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

    // Initialize PIXI.js animated background
    initPixiBackground()

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
      
      // Destroy PIXI application
      if (pixiAppRef.current) {
        try {
          pixiAppRef.current.destroy(true)
          pixiAppRef.current = null
        } catch (error) {
          console.error('Error destroying PIXI application:', error)
        }
      }
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

  // PIXI.js background initialization
  const initPixiBackground = () => {
    console.log('🎨 Initializing PIXI.js background...');
    
    // Check if PIXI is available
    if (typeof PIXI === 'undefined') {
      console.error('❌ PIXI.js is not loaded! Falling back to static background.');
      // Add fallback static background
      if (pixiContainerRef.current) {
        pixiContainerRef.current.style.background = 'linear-gradient(45deg, rgba(1, 175, 246, 0.1), rgba(240, 0, 133, 0.1), rgba(255, 208, 54, 0.1))';
      }
      return;
    }

    console.log('✅ PIXI.js is available');
    
    if (!pixiContainerRef.current) {
      console.warn('❌ PIXI container ref not available');
      return;
    }

    console.log('✅ PIXI container ref available');

    try {
      // Create PIXI application with working configuration
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xFFFFFF, // White background to match site
        antialias: true
      });

      console.log('✅ PIXI application created', { width: app.screen.width, height: app.screen.height });

      pixiAppRef.current = app;

      // Append to container and set up ticker
      pixiContainerRef.current.appendChild(app.view);
      console.log('✅ PIXI canvas appended to DOM');

      app.ticker.stop(); // Stop Pixi ticker

      // Use GSAP ticker for PIXI updates
      gsap.ticker.add(() => {
        app.ticker.update();
      });
      console.log('✅ GSAP ticker integration complete');

      // Configuration matching the working example
      const gridSize = 11;
      const circD = 63; // circle diameter
      const circOffsetX = 0.11111; // circle offset
      const circOffsetY = 0.15873; // circle offset
      const color1 = 0x01AFF6; // blue
      const color2 = 0xF20085; // pink
      const color3 = 0xFFD036; // yellow
      const animDuration = 0.8;

      // Create grid of circle containers
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const container = new PIXI.Container();
          const circContainer1 = new PIXI.Container();
          const circContainer2 = new PIXI.Container();
          const circContainer3 = new PIXI.Container();

          // Create circles with blend modes (using type assertion for TS compatibility)
          const circle1 = new PIXI.Graphics();
          circle1.lineStyle(0);
          circle1.beginFill(color1, 1);
          circle1.drawCircle(0, 0, circD/2);
          circle1.endFill();
          (circle1.blendMode as any) = 1; // MULTIPLY blend mode
          circContainer1.addChild(circle1);
          circContainer1.x = 0;
          circContainer1.y = 0;
          container.addChild(circContainer1);

          const circle2 = new PIXI.Graphics();
          circle2.lineStyle(0);
          circle2.beginFill(color2, 1);
          circle2.drawCircle(0, 0, circD/2);
          circle2.endFill();
          (circle2.blendMode as any) = 1; // MULTIPLY blend mode
          circContainer2.addChild(circle2);
          circContainer2.x = -circOffsetX*circD;
          circContainer2.y = circOffsetY*circD;
          container.addChild(circContainer2);

          const circle3 = new PIXI.Graphics();
          circle3.lineStyle(0);
          circle3.beginFill(color3, 1);
          circle3.drawCircle(0, 0, circD/2);
          circle3.endFill();
          (circle3.blendMode as any) = 1; // MULTIPLY blend mode
          circContainer3.addChild(circle3);
          circContainer3.x = circOffsetX*circD;
          circContainer3.y = circOffsetY*circD;
          container.addChild(circContainer3);

          app.stage.addChild(container);

          // Position containers in grid (adjusted for full screen)
          container.x = i * circD + circD/2 + i * 2;
          container.y = j * circD + circD/2 + j * 2;
        }
      }

      // Position the stage
      app.stage.x = 2;

      // GSAP animations matching the working example
      gsap.timeline({ delay: 0.2 })
        .from(app.stage.children, {
          pixi: { scale: 0, rotation: 360 },
          duration: 2,
          ease: 'power4',
          stagger: {
            each: 0.1,
            grid: [gridSize, gridSize],
            from: [0, 1]
          }
        })
        .to(app.stage.children, {
          duration: animDuration,
          ease: 'sine.inOut',
          stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true,
            grid: [gridSize, gridSize],
            from: [0, 1],
            onStart: function() {
              // Animate all container children
              gsap.to(app.stage.children.map(container => container.children).flat(), {
                pixi: { scale: 0.15 },
                duration: animDuration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
              });
            }
          }
        }, 0.1);

      // Handle window resize
      const handleResize = () => {
        try {
          if (app && pixiContainerRef.current) {
            app.renderer.resize(window.innerWidth, window.innerHeight);
          }
        } catch (error) {
          console.error('Error handling window resize:', error);
        }
      };

      window.addEventListener('resize', handleResize);

      // Return cleanup function
      return () => {
        try {
          window.removeEventListener('resize', handleResize);
        } catch (error) {
          console.error('Error removing resize listener:', error);
        }
      };

    } catch (error) {
      console.error('Error initializing PIXI background:', error);
      return () => {};
    }
  };

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
    <div className="overflow-hidden bg-white min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-white">
        {/* PIXI.js Animated Background */}
        <div 
          ref={pixiContainerRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 0.8 }}
        >
          {/* CSS Fallback Animation */}
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-sky-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-600/20 rounded-full blur-md animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-blue-400/20 via-black/10 to-blue-600/20 blur-[120px] rounded-full -z-10 opacity-60" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-gradient-to-l from-blue-500/25 via-black/5 to-blue-300/20 blur-[100px] rounded-full -z-10 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 -z-10" />
        
        <div className="hero-content relative z-10">
          

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
              className="hero-button rounded-full px-8 text-lg h-14 shadow-2xl shadow-blue-900/40 bg-gradient-to-r from-blue-600 via-black/20 to-blue-800 hover:from-blue-700 hover:via-black/30 hover:to-blue-900 text-white border-2 border-black/30 dark:border-white/30 transition-all duration-200 hover:shadow-3xl hover:shadow-black/50"
            >
              <Link href="/dashboard" data-testid="button-start-generating">
                <span className="relative z-10 font-semibold">Start Free</span> <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hero-button rounded-full px-8 text-lg h-14 border-2 border-black/40 text-black hover:bg-black hover:text-white transition-colors duration-200 bg-white/90 backdrop-blur-sm shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40"
            >
              <Link href="/pricing" data-testid="button-view-pricing">
                View Pricing
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm">
            <div className="hero-feature flex items-center gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-sm px-4 py-3 rounded-full border border-black/20 dark:border-white/20 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="hero-feature flex items-center gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-sm px-4 py-3 rounded-full border border-black/20 dark:border-white/20 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">5 free quizzes</span>
            </div>
            <div className="hero-feature flex items-center gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-sm px-4 py-3 rounded-full border border-black/20 dark:border-white/20 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center relative bg-white">
        <div className="how-it-works-title text-center mb-16 absolute top-20 left-0 right-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-lg">How Think Stack Works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto drop-shadow-md">
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
              <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 text-slate-900 border-2 border-blue-200/50 shadow-3xl group hover:shadow-4xl hover:shadow-blue-500/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/30 via-blue-200/20 to-blue-600/20 opacity-80" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/25 via-blue-300/15 to-blue-100/20 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-blue-300/15 opacity-30" />
                
                <div className="relative z-10 p-10">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-6xl font-bold text-blue-600 bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-2 border border-blue-300/30 shadow-lg">{item.step}</div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-500 shadow-2xl shadow-blue-500/30 border border-blue-300/30">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4 text-slate-900 font-bold">{item.title}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">{item.description}</p>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-[3rem] mx-4 lg:mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="feature-demo-left order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-black/10 to-blue-600 rounded-3xl blur-2xl opacity-20 transform rotate-3" />
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-black/20 dark:border-white/20 rounded-3xl p-8 shadow-3xl shadow-black/30">
              <div className="flex items-center gap-4 mb-6 border-b-2 border-black/20 dark:border-white/20 pb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-black/20" />
                <div className="w-3 h-3 rounded-full bg-black shadow-lg shadow-blue-500/20" />
                <div className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-black/20" />
                <span className="text-sm text-slate-600 dark:text-slate-300 ml-auto font-mono font-semibold bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-black/10 dark:border-white/10"></span>
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
                    <div className="h-12 bg-blue-500/10 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-medium">Easy</div>
                    <div className="h-12 bg-sky-500/10 border border-sky-500 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center font-medium">Medium</div>
                    <div className="h-12 bg-blue-600/10 border border-blue-600 text-blue-700 dark:text-blue-500 rounded-xl flex items-center justify-center font-medium">Hard</div>
                  </div>
                </div>
                <Button className="w-full h-14 bg-gradient-to-r from-blue-500 via-black/20 to-blue-600 hover:from-blue-600 hover:via-black/30 hover:to-blue-700 text-white font-semibold rounded-xl mt-4 border-2 border-black/20 dark:border-white/20 shadow-xl shadow-black/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40">
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Quiz
                </Button>
              </div>
            </div>
          </div>

          <div className="feature-demo-right order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              <span>Smart Learning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Just type a topic. <br />
              <span className="text-black dark:text-white">AI handles the rest.</span>
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
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="features-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-lg">Everything you need to learn faster</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto drop-shadow-md">
            Powerful features designed for students, teachers, and lifelong learners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="feature-card"
            >
              <Card className="h-full border-2 border-black/20 dark:border-white/20 bg-gradient-to-br from-white via-blue-50/30 to-slate-100 dark:from-slate-800 dark:via-blue-950/20 dark:to-slate-900 text-slate-900 dark:text-white shadow-2xl hover:shadow-3xl hover:shadow-black/30 transition-all duration-500 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 opacity-10" />
                <CardHeader className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-black/10 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-black/20 border border-black/10 dark:border-white/10">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 p-6 pt-0">
                  <p className="text-slate-600 dark:text-slate-200 font-medium leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="testimonials-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-lg">Loved by learners everywhere</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto drop-shadow-md">
            See what our community has to say about Think Stack
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="testimonial-card"
            >
              <Card className="bg-gradient-to-br from-white via-blue-50/30 to-slate-100 dark:from-slate-800 dark:via-blue-950/20 dark:to-slate-900 rounded-[2.5rem] text-center text-slate-900 dark:text-white relative overflow-hidden hover:shadow-3xl hover:shadow-black/30 transition-all duration-500 border-2 border-black/20 dark:border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10 opacity-10" />
                <CardContent className="pt-6 relative z-10">
                  <div className="flex gap-1 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-blue-400 text-blue-400 drop-shadow-lg" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 mb-6 leading-relaxed text-lg font-medium">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3 justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-black/10 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/20 border-2 border-black/20 dark:border-white/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-blue-300 text-lg">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{testimonial.role}</p>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="cta-section max-w-4xl mx-auto bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden border-3 border-black/30 dark:border-white/30 shadow-3xl shadow-black/50">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-600/40 via-black/15 to-blue-800/30 blur-[100px] rounded-full opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tl from-blue-700/35 via-black/10 to-blue-500/25 blur-[100px] rounded-full opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 opacity-30" />
          
          <div className="cta-content relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border-2 border-black/20 dark:border-white/20 text-blue-200 text-sm font-medium mb-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>Start learning in 60 seconds</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">Ready to supercharge your learning?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto drop-shadow-lg font-medium">
              Join thousands of learners using AI-powered quizzes. Start with 5 free generations today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-black/25 to-blue-700 hover:from-blue-700 hover:via-black/35 hover:to-blue-800 text-white rounded-full px-8 text-lg h-14 border-3 border-black/30 dark:border-white/30 shadow-3xl shadow-black/40 hover:shadow-4xl hover:shadow-black/60 transition-all duration-300 font-bold">
                <Link href="/api/login" data-testid="button-cta-start">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-3 border-black/40 text-white hover:bg-black/20 hover:text-white transition-colors shadow-2xl shadow-black/30 hover:shadow-3xl hover:shadow-black/50 backdrop-blur-sm font-semibold">
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
