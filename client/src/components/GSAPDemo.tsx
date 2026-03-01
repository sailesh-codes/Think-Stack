import { useEffect, useRef } from 'react'
import { animations } from '../lib/gsap'

export function GSAPDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Basic animations on mount
    animations.fadeIn('.fade-in-element', 1, 0.2)
    animations.slideUp('.slide-up-element', 1, 0.4)
    animations.scaleIn('.scale-in-element', 1, 0.6)
    
    // Stagger animation for cards
    animations.staggerFadeIn('.stagger-card', 0.1)
    
    // Scroll-triggered animations
    animations.scrollReveal('.scroll-reveal-top', 'top')
    animations.scrollReveal('.scroll-reveal-left', 'left')
    
    // Typewriter effect
    animations.typewriter('.typewriter', 'Welcome to GSAP Animations!', 2)
    
    // Hover effects
    animations.hoverScale('.hover-card')

    // Cleanup
    return () => {
      // GSAP automatically cleans up, but you can add custom cleanup if needed
    }
  }, [])

  return (
    <div ref={containerRef} className="p-8 space-y-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">GSAP Animation Demo</h1>
      
      {/* Fade In */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fade In Animation</h2>
        <div className="fade-in-element bg-blue-500 text-white p-6 rounded-lg">
          This element fades in when the component mounts
        </div>
      </div>

      {/* Slide Up */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Slide Up Animation</h2>
        <div className="slide-up-element bg-green-500 text-white p-6 rounded-lg">
          This element slides up from below
        </div>
      </div>

      {/* Scale In */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Scale In Animation</h2>
        <div className="scale-in-element bg-purple-500 text-white p-6 rounded-lg">
          This element scales in from smaller size
        </div>
      </div>

      {/* Stagger Animation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Stagger Animation</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="stagger-card bg-red-500 text-white p-4 rounded-lg text-center">
              Card {i}
            </div>
          ))}
        </div>
      </div>

      {/* Typewriter */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Typewriter Effect</h2>
        <div className="typewriter bg-yellow-500 text-black p-6 rounded-lg font-mono text-xl">
          {/* Text will be typed here */}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Hover Animation</h2>
        <div className="hover-card bg-indigo-500 text-white p-6 rounded-lg cursor-pointer transition-all">
          Hover over this card to see it scale!
        </div>
      </div>

      {/* Scroll Reveal Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Scroll Reveal Animations</h2>
        <div className="h-96" /> {/* Spacer for scroll effect */}
        
        <div className="scroll-reveal-top bg-teal-500 text-white p-6 rounded-lg">
          This element reveals from top when you scroll to it
        </div>
        
        <div className="h-32" /> {/* Spacer */}
        
        <div className="scroll-reveal-left bg-orange-500 text-white p-6 rounded-lg">
          This element reveals from left when you scroll to it
        </div>
        
        <div className="h-96" /> {/* Spacer for scroll effect */}
      </div>
    </div>
  )
}
