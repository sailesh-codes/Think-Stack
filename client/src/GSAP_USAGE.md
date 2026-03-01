# GSAP Animation Usage Guide

GSAP has been successfully integrated into your project! Here's how to use it:

## Quick Start

### 1. Import the animations utility
```tsx
import { animations } from '@/lib/gsap'
```

### 2. Use in your components
```tsx
import { useEffect } from 'react'

function MyComponent() {
  useEffect(() => {
    // Fade in animation
    animations.fadeIn('.my-element')
    
    // Slide up animation with delay
    animations.slideUp('.another-element', 1, 0.5)
  }, [])
  
  return (
    <div>
      <div className="my-element">This will fade in</div>
      <div className="another-element">This will slide up</div>
    </div>
  )
}
```

## Available Animations

### Basic Animations
- `fadeIn(element, duration?, delay?)` - Fade elements in
- `slideUp(element, duration?, delay?)` - Slide up from bottom
- `scaleIn(element, duration?, delay?)` - Scale in from smaller size

### Advanced Animations
- `staggerFadeIn(elements, stagger?)` - Animate multiple elements with stagger
- `scrollReveal(element, direction?)` - Scroll-triggered reveal (top/bottom/left/right)
- `typewriter(element, text, duration?)` - Text typing effect
- `hoverScale(element, scale?)` - Hover scale animation

### Using Custom Hooks

#### useGSAP Hook
```tsx
import { useGSAP } from '@/hooks/useGSAP'
import { gsap } from 'gsap'

function MyComponent() {
  const elementRef = useGSAP(
    (element) => gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
  )

  return <div ref={elementRef}>Animated content</div>
}
```

#### Scroll-Triggered Animation
```tsx
const elementRef = useGSAP(
  (element) => gsap.fromTo(element,
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration: 1 }
  ),
  [],
  {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse'
  }
)
```

## Demo Component

To see all animations in action, add this route to your router:
```tsx
<Route path="/gsap-demo" component={GSAPDemo} />
```

Then visit `/gsap-demo` to see the complete animation showcase.

## Tips

1. **SSR Safety**: GSAP automatically checks for `window` existence, making it safe for SSR
2. **Performance**: GSAP is highly optimized and performs better than CSS animations for complex sequences
3. **Cleanup**: All animations are automatically cleaned up when components unmount
4. **Combination**: You can use GSAP alongside your existing Framer Motion animations

## Integration with Existing Code

Your existing components will continue to work with Framer Motion. You can gradually migrate specific animations to GSAP where you need more control or better performance.

Example of adding GSAP to an existing component:
```tsx
// Before: Just Framer Motion
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

// After: GSAP for more control
<div ref={elementRef} className="gsap-element">
```

Enjoy smooth, performant animations with GSAP! 🚀
