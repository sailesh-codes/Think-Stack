import { useRef, useEffect } from "react";
import { Sparkles, Brain, Zap, Target } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface QuizGenerationLoaderProps {
  isGenerating: boolean;
  mode: "individual" | "organization";
}

export function QuizGenerationLoader({ isGenerating, mode }: QuizGenerationLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !isGenerating) return;

    const tl = gsap.timeline();

    // Animate loader entrance
    tl.fromTo(loaderRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Animate progress bar
    if (progressRef.current) {
      tl.fromTo(progressRef.current,
        { width: "0%" },
        { width: "100%", duration: 2, ease: "power2.inOut" },
        "-=0.3"
      );
    }

    // Animate floating icons
    if (iconsRef.current) {
      const icons = iconsRef.current.children;
      gsap.set(icons, { scale: 0, rotation: -180 });

      tl.to(icons, {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      }, "-=1.5");

      // Continuous floating animation
      gsap.to(icons, {
        y: -10,
        duration: 2,
        stagger: 0.3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // Animate text
    if (textRef.current) {
      const textElements = textRef.current.children;
      gsap.set(textElements, { opacity: 0, y: 20 });

      tl.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=1.2");
    }

    return () => {
      tl.kill();
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50/95 via-amber-50/90 to-orange-100/95 dark:from-orange-950/95 dark:via-amber-950/90 dark:to-orange-900/95 backdrop-blur-sm"
    >
      <div className="relative max-w-md w-full mx-4">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-xl scale-110"></div>

        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-orange-200/50 dark:border-orange-800/50 rounded-3xl p-8 shadow-2xl">
          {/* Floating icons */}
          <div ref={iconsRef} className="flex justify-center gap-6 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl shadow-lg">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl shadow-lg">
              <Target className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Loading text */}
          <div ref={textRef} className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {mode === "organization" ? "Creating Live Quiz Room" : "Generating Your Quiz"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              AI is crafting personalized questions just for you...
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative mb-6">
            <div className="h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: "0%" }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Analyzing topic</span>
              <span>Creating questions</span>
              <span>Finalizing</span>
            </div>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s"
                }}
              ></div>
            ))}
          </div>

          {/* Fun facts or tips */}
          <div className="mt-6 p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200/50 dark:border-orange-800/30">
            <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
              💡 <span className="font-medium">Did you know?</span> Our AI generates questions based on current knowledge and best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
