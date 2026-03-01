import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

// Text splitting utility
export const splitText = (element: Element) => {
  const text = element.textContent || ''
  const chars = text.split('').map(char => {
    const span = document.createElement('span')
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    span.style.opacity = '0'
    span.style.transform = 'translateY(50px)'
    return span
  })
  
  element.innerHTML = ''
  chars.forEach(span => element.appendChild(span))
  
  return chars
}

// Animation utilities
export const animations = {
  // Fade in animation
  fadeIn: (element: string | Element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration, delay }
    )
  },

  // Slide up animation
  slideUp: (element: string | Element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration, delay }
    )
  },

  // Scale in animation
  scaleIn: (element: string | Element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration, delay }
    )
  },

  // Stagger animation for multiple elements
  staggerFadeIn: (elements: string | NodeListOf<Element>, stagger = 0.1, delay = 0) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger, duration: 0.8, delay }
    )
  },

  // Scroll-triggered animation
  scrollReveal: (element: string | Element, from = 'bottom') => {
    const directions = {
      top: { y: -100 },
      bottom: { y: 100 },
      left: { x: -100 },
      right: { x: 100 }
    }

    return gsap.fromTo(
      element,
      { ...directions[from as keyof typeof directions], opacity: 0 },
      {
        ...directions[from as keyof typeof directions],
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  },

  // Text typing animation
  typewriter: (element: string | Element, text: string, duration = 2) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if (el) {
      el.textContent = ''
      return gsap.to(el, {
        duration,
        text: {
          value: text,
          delimiter: ''
        },
        ease: 'none'
      })
    }
  },

  // Text split animation - characters animate in sequence
  textSplitReveal: (element: string | Element, stagger = 0.05, duration = 0.8) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if (!el) return

    const chars = splitText(el)
    
    return gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out'
    })
  },

  // Advanced text split animation with rotation and scale
  textSplitBounce: (element: string | Element, stagger = 0.03, duration = 0.6) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if (!el) return

    const chars = splitText(el)
    
    return gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotation: 0,
      scale: 1,
      duration,
      stagger,
      ease: 'back.out(1.7)'
    })
  },

  // Hover animation
  hoverScale: (element: string | Element, scale = 1.05) => {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, { scale, duration: 0.3, ease: 'power2.out' })
    
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if (el) {
      el.addEventListener('mouseenter', () => tl.play())
      el.addEventListener('mouseleave', () => tl.reverse())
    }
    
    return tl
  }
}

export { gsap, ScrollTrigger }
