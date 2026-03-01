import { useEffect, useRef, RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimationConfig {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
  toggleActions?: string
}

export function useGSAP(
  animationFn: (element: Element) => gsap.core.Tween | gsap.core.Timeline,
  dependencies: any[] = [],
  scrollConfig?: AnimationConfig
) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const animation = animationFn(element)

    if (scrollConfig) {
      ScrollTrigger.create({
        trigger: scrollConfig.trigger || element,
        start: scrollConfig.start || 'top 80%',
        end: scrollConfig.end || 'bottom 20%',
        scrub: scrollConfig.scrub,
        pin: scrollConfig.pin,
        markers: scrollConfig.markers,
        toggleActions: scrollConfig.toggleActions || 'play none none reverse',
        animation
      })
    }

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, dependencies)

  return elementRef
}

// Hook for stagger animations
export function useStagger(
  selector: string,
  animationFn: (elements: NodeListOf<Element>) => gsap.core.Tween | gsap.core.Timeline,
  dependencies: any[] = []
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    const animation = animationFn(elements)

    return () => {
      animation.kill()
    }
  }, dependencies)
}

// Hook for timeline animations
export function useTimeline(
  timelineFn: (timeline: gsap.core.Timeline) => void,
  dependencies: any[] = []
) {
  const timelineRef = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const timeline = gsap.timeline()
    timelineRef.current = timeline
    
    timelineFn(timeline)

    return () => {
      timeline.kill()
    }
  }, dependencies)

  return timelineRef
}
