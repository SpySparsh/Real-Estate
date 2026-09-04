import { useRef } from 'react'
import { closingCTA } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

function ClosingCTA() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Background transitions to dark as user approaches ──
      gsap.to(containerRef.current, {
        backgroundColor: 'rgba(23, 23, 22, 1)',
        color: '#F4F1EB',
        ease: 'none',
        scrollTrigger: {
          id: 'cta-bg',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 80%'),
          end: 'top 30%',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      })

      // Update headline color to match
      gsap.to('.cta-headline', {
        color: '#F4F1EB',
        ease: 'none',
        scrollTrigger: {
          id: 'cta-headline-color',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 80%'),
          end: 'top 30%',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      })

      // ── Headline lines: staggered masked reveal ──
      gsap.utils.toArray('.cta-headline').forEach((line, i) => {
        gsap.from(line, {
          yPercent: 120,
          opacity: 0,
          duration: 1.4,
          delay: i * 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            id: `cta-headline-${i}`,
            trigger: line.parentElement || containerRef.current,
            start: getPostPhilosophyStart('top 75%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        })
      })

      // ── Fine divider extends ──
      gsap.from('.cta-divider', {
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: {
          id: 'cta-divider',
          trigger: '.cta-divider',
          start: getPostPhilosophyStart('top 85%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })

      // ── Subtext reveal ──
      gsap.from('.cta-subtext', {
        opacity: 0,
        y: 15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'cta-subtext',
          trigger: '.cta-subtext',
          start: getPostPhilosophyStart('top 90%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="section-padding-x bg-ivory relative overflow-hidden"
      style={{ paddingTop: 'clamp(6rem, 15vh, 12rem)', paddingBottom: 'clamp(6rem, 15vh, 12rem)' }}
    >
      <div className="container-base text-center">
        {/* Large Statement */}
        <div className="mb-12 md:mb-16">
          {closingCTA.statement.map((line, index) => (
            <div key={index} className="overflow-hidden pb-1 md:pb-2">
              <h2
                className="cta-headline display-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        {/* Fine Divider */}
        <div className="cta-divider w-24 h-px bg-current opacity-30 mx-auto mb-8" />

        {/* Subtext */}
        <p className="cta-subtext eyebrow text-current opacity-50">
          Shri Radhika Developers
        </p>
      </div>
    </section>
  )
}

export default ClosingCTA
