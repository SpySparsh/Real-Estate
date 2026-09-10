import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SECTION_IDS = [
  'home',
  'introduction',
  'philosophy',
  'projects',
  'partners',
  'portfolio-impact',
  'about',
  'cta',
  'contact',
  'footer',
]

// Light / Dark section palette mapping for atmospheric background transitions
const SECTION_BG_COLORS = {
  home: '#F4F1EB',
  introduction: '#F4F1EB',
  philosophy: '#F4F1EB',
  projects: '#F4F1EB',
  partners: '#F4F1EB',
  'portfolio-impact': '#171716',
  about: '#F4F1EB',
  cta: '#171716',
  contact: '#F4F1EB',
  footer: '#171716',
}

/**
 * useSectionFocus - Coordinates cinematic section-level visual focus handoffs across the entire website.
 * 
 * Rules:
 * - Controls ONLY the section-level wrapper (.section-focus-wrapper) opacity, scale, and y.
 * - Does NOT touch or animate child elements (owned by section-internal timelines).
 * - Focused: opacity = 1.0, scale = 1.0, y = 0px, pointerEvents = 'auto'
 * - Dormant / Suppressed: opacity = 0, scale = 0.96, y = 35px, pointerEvents = 'none' (NO early peeking!)
 * - Receded / Departing: opacity = 0.05, scale = 0.95, y = -35px, pointerEvents = 'none' (genuine depth departure!)
 * - Driven purely by ScrollTrigger scrub (100% interruptible, responsive to scroll speed, reversible).
 * - Golden Invariant: Section A Focused -> A recedes & B emerges -> B becomes 100% focused at top 22% (desktop) / 25% (mobile) -> ONLY NOW B's opening plays.
 * - Atmospheric transitions: Boundary pairs smoothly cross-dissolve background colors between #F4F1EB and #171716, eliminating hard edges.
 */
export function useSectionFocus() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        const wrapper = el?.querySelector('.section-focus-wrapper')
        if (wrapper) gsap.set(wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
      })
      return
    }

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop } = context.conditions

        // Collect elements and wrappers
        const sections = SECTION_IDS.map((id) => {
          const el = document.getElementById(id)
          const wrapper = el?.querySelector('.section-focus-wrapper')
          return { id, el, wrapper }
        })

        // Hero starts 100% focused on page load
        if (sections[0].wrapper) {
          gsap.set(sections[0].wrapper, { opacity: 1, scale: 1, y: 0, transformOrigin: '50% 50%', pointerEvents: 'auto' })
        }

        // All downstream sections start completely dormant / suppressed to prevent early peeking
        for (let i = 1; i < sections.length; i++) {
          if (sections[i].wrapper) {
            gsap.set(sections[i].wrapper, { opacity: 0, scale: 0.96, y: 35, transformOrigin: '50% 50%', pointerEvents: 'none' })
          }
        }

        document.documentElement.dataset.focusedSection = 'home'

        // Build focus handoff timelines for all adjacent pairs
        for (let i = 0; i < sections.length - 1; i++) {
          const currentSection = sections[i]
          const nextSection = sections[i + 1]

          if (!currentSection.el || !currentSection.wrapper || !nextSection.el || !nextSection.wrapper) {
            continue
          }

          const isLastPair = i === sections.length - 2 // contact -> footer
          // Slow, cinematic handoff travel starts as nextSection enters the bottom of the viewport
          const startPos = isDesktop ? 'top 92%' : 'top 95%'
          // Handoff completes when nextSection reaches its prime visual focus position
          const endPos = isLastPair
            ? 'bottom bottom'
            : (isDesktop ? 'top 22%' : 'top 25%')

          const tl = gsap.timeline({
            scrollTrigger: {
              id: `focus-handoff-${currentSection.id}-${nextSection.id}`,
              trigger: nextSection.el,
              start: startPos,
              end: endPos,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress

                // Phase 1: Departing Section A recedes into depth and completely disappears (0.0 -> 0.55)
                if (currentSection.wrapper && self.isActive) {
                  if (i > 0 && window.scrollY <= 100) {
                    gsap.set(currentSection.wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
                    return
                  }
                  if (p <= 0.55) {
                    const t = p / 0.55
                    // smooth power1.inOut curve
                    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                    const op = Math.max(0, 1 - eased)
                    const sc = 1 - 0.06 * eased
                    const yVal = -50 * eased
                    gsap.set(currentSection.wrapper, { opacity: op, scale: sc, y: yVal })
                  } else {
                    gsap.set(currentSection.wrapper, { opacity: 0, scale: 0.94, y: -50 })
                  }
                }

                if (p >= 0.75) {
                  document.documentElement.dataset.focusedSection = nextSection.id
                  if (nextSection.wrapper) nextSection.wrapper.style.pointerEvents = 'auto'
                  if (currentSection.wrapper) currentSection.wrapper.style.pointerEvents = 'none'
                } else if (p <= 0.25) {
                  document.documentElement.dataset.focusedSection = currentSection.id
                  if (currentSection.wrapper) currentSection.wrapper.style.pointerEvents = 'auto'
                  if (nextSection.wrapper) nextSection.wrapper.style.pointerEvents = 'none'
                } else {
                  if (currentSection.wrapper) currentSection.wrapper.style.pointerEvents = 'none'
                  if (nextSection.wrapper) nextSection.wrapper.style.pointerEvents = 'none'
                }
              },
              onLeave: () => {
                if (currentSection.wrapper) {
                  gsap.set(currentSection.wrapper, { opacity: 0, scale: 0.94, y: -50, pointerEvents: 'none' })
                }
                if (nextSection.wrapper) {
                  gsap.set(nextSection.wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
                }
              },
              onLeaveBack: () => {
                if (currentSection.wrapper) {
                  if (i === 0) {
                    gsap.set(currentSection.wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
                  } else {
                    const isFarAbove = currentSection.el
                      ? window.scrollY < currentSection.el.offsetTop - window.innerHeight * 0.9
                      : window.scrollY <= 100
                    if (isFarAbove || window.scrollY <= 100) {
                      gsap.set(currentSection.wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
                    } else {
                      gsap.set(currentSection.wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
                    }
                  }
                }
                if (nextSection.wrapper) {
                  gsap.set(nextSection.wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
                }
              },
            },
          })

          // Phase 2: Entering Section B emerges and takes over visual dominance (0.35 -> 0.85)
          // Explicitly set 0 at time 0 so rewind guarantees dormancy even before tween start
          tl.set(nextSection.wrapper, { opacity: 0, scale: 0.95, y: 50 }, 0)
          tl.to(
            nextSection.wrapper,
            { opacity: 1, scale: 1, y: 0, duration: 0.50, ease: 'power1.inOut' },
            0.35
          )

          // Phase 3: Hold Section B as the ONLY dominant visual composition before opening begins (0.85 -> 1.0)
          tl.set({}, {}, 1.0)

          // Atmospheric background cross-dissolve across light/dark boundaries
          const currentBg = SECTION_BG_COLORS[currentSection.id]
          const nextBg = SECTION_BG_COLORS[nextSection.id]

          if (currentBg && nextBg && currentBg !== nextBg) {
            // Smoothly interpolate next section's background from currentBg to nextBg
            tl.fromTo(
              nextSection.el,
              { backgroundColor: currentBg },
              { backgroundColor: nextBg, duration: 0.70, ease: 'power1.inOut', immediateRender: false },
              0.10
            )
          }
        }

        // Dedicated Top/Hero Sentinel Trigger to guarantee Hero focus and downstream dormancy on reverse scroll to top
        ScrollTrigger.create({
          id: 'focus-top-sentinel',
          trigger: sections[0].el || document.body,
          start: 'top top',
          end: isDesktop ? 'bottom 80%' : 'bottom 90%',
          onEnterBack: () => {
            document.documentElement.dataset.focusedSection = 'home'
            if (sections[0].wrapper) {
              gsap.set(sections[0].wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
            }
            for (let j = 1; j < sections.length; j++) {
              if (sections[j].wrapper) {
                gsap.set(sections[j].wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
              }
            }
          },
          onUpdate: (self) => {
            if (self.progress === 0 || window.scrollY <= 30) {
              document.documentElement.dataset.focusedSection = 'home'
              if (sections[0].wrapper) {
                gsap.set(sections[0].wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
              }
              for (let j = 1; j < sections.length; j++) {
                if (sections[j].wrapper) {
                  gsap.set(sections[j].wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
                }
              }
            }
          },
        })

        const handleTopScroll = () => {
          if (window.scrollY <= 50) {
            document.documentElement.dataset.focusedSection = 'home'
            if (sections[0].wrapper) {
              gsap.set(sections[0].wrapper, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' })
            }
            for (let j = 1; j < sections.length; j++) {
              if (sections[j].wrapper) {
                gsap.set(sections[j].wrapper, { opacity: 0, scale: 0.95, y: 50, pointerEvents: 'none' })
              }
            }
          }
        }

        window.addEventListener('scroll', handleTopScroll, { passive: true })

        return () => {
          window.removeEventListener('scroll', handleTopScroll)
        }
      }
    )

    return () => {
      mm.revert()
    }
  }, [])
}
