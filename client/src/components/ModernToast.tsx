import { useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface ModernToastProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  onClose: (id: string) => void;
  duration?: number;
}

export function ModernToast({ id, type, title, description, onClose, duration = 4000 }: ModernToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const typeConfig = {
    success: {
      bg: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      progressColor: "bg-emerald-400"
    },
    error: {
      bg: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
      border: "border-red-200 dark:border-red-800",
      icon: XCircle,
      iconColor: "text-red-600",
      progressColor: "bg-red-400"
    },
    warning: {
      bg: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      border: "border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
      iconColor: "text-amber-600",
      progressColor: "bg-amber-400"
    },
    info: {
      bg: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
      progressColor: "bg-blue-400"
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (!toastRef.current) return;

    const tl = gsap.timeline();

    // Entrance animation
    tl.fromTo(toastRef.current,
      {
        opacity: 0,
        x: 400,
        scale: 0.8,
        rotationY: -15
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );

    // Icon bounce animation
    if (iconRef.current) {
      tl.fromTo(iconRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" },
        "-=0.3"
      );
    }

    // Content slide in
    if (contentRef.current) {
      tl.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
    }

    // Progress bar animation
    if (progressRef.current) {
      tl.fromTo(progressRef.current,
        { width: "100%" },
        { width: "0%", duration: duration / 1000, ease: "none" },
        "-=0.1"
      );
    }

    // Auto close after duration
    const timeoutId = setTimeout(() => {
      closeToast();
    }, duration);

    const closeToast = () => {
      if (toastRef.current) {
        gsap.to(toastRef.current, {
          opacity: 0,
          x: 400,
          scale: 0.8,
          rotationY: 15,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => onClose(id)
        });
      }
    };

    return () => {
      clearTimeout(timeoutId);
      tl.kill();
    };
  }, [id, onClose, duration]);

  const handleClose = () => {
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        x: 400,
        scale: 0.8,
        rotationY: 15,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => onClose(id)
      });
    }
  };

  return (
    <div
      ref={toastRef}
      className={`relative w-96 max-w-sm bg-gradient-to-r ${config.bg} border ${config.border} rounded-2xl p-4 shadow-xl backdrop-blur-xl overflow-hidden cursor-pointer`}
      onClick={handleClose}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div
          ref={progressRef}
          className={`h-full ${config.progressColor} rounded-r-full`}
        ></div>
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div ref={iconRef} className={`flex-shrink-0 p-2 rounded-xl bg-white/60 dark:bg-gray-800/60`}>
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">
            {title}
          </h4>
          {description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}
