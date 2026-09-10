import { useRef } from 'react'
import { closingCTA } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'
import { useTranslation } from '../hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger)

function ClosingCTA() {
  const containerRef = useRef(null)
  const { tArray } = useTranslation()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions.reduceMotion) {
          gsap.set(['.cta-headline', '.cta-divider', '.cta-subtext'], {
            opacity: 1,
            yPercent: 0,
            y: 0,
            scaleX: 1,
          })
          return
        }
        const { isDesktop } = context.conditions

        // Dynamic start point: strictly gates opening until focus handoff completes
        const getHandoffEnd = () => {
          const t = ScrollTrigger.getById('focus-handoff-about-cta')
          if (t && typeof t.end === 'number') {
            return t.end
          }
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const triggerOffset = isDesktop ? window.innerHeight * 0.22 : window.innerHeight * 0.25
            return scrollTop + rect.top - triggerOffset
          }
          return isDesktop ? 'top 22%' : 'top 25%'
        }

        // Set initial pre-opening dormant states
        gsap.set('.cta-headline', { yPercent: 110, opacity: 0 })
        gsap.set('.cta-divider', { scaleX: 0, opacity: 0, transformOrigin: 'center center' })
        gsap.set('.cta-subtext', { y: 16, opacity: 0 })

        // ── Single unified scrubbed opening timeline ──
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'cta-opening',
            trigger: containerRef.current,
            start: getHandoffEnd,
            end: () => `+=${window.innerHeight * (isDesktop ? 0.35 : 0.30)}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          }
        })

        // 1. Headline lines: masked rise up & fade in
        tl.to('.cta-headline', {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.60,
          ease: 'power2.out',
        }, 0)

        // 2. Fine divider line extends from center
        tl.to('.cta-divider', {
          scaleX: 1,
          opacity: 0.3,
          duration: 0.35,
          ease: 'power2.out',
        }, 0.45)

        // 3. Subtext eyebrow fades in
        tl.to('.cta-subtext', {
          y: 0,
          opacity: 0.5,
          duration: 0.35,
          ease: 'power2.out',
        }, 0.65)
      }
    )
  }, { scope: containerRef })

  return (
    <section
      id="cta"
      ref={containerRef}
      className="section-padding-x bg-[#171716] text-[#F4F1EB] relative overflow-hidden flex flex-col justify-center items-center min-h-[110vh]"
      style={{ paddingTop: 'clamp(4rem, 10vh, 8rem)', paddingBottom: 'clamp(4rem, 10vh, 8rem)' }}
    >
      <div className="section-focus-wrapper w-full">
      <div className="container-base text-center">
        {/* Large Statement */}
        <div className="mb-12 md:mb-16">
          {tArray('closingCTA.statementLines').map((line, index) => (
            <div key={index} className="cta-headline-wrapper overflow-hidden pb-1 md:pb-2">
              <h2
                className="cta-headline display-heading !text-[#F4F1EB] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                style={{ color: '#F4F1EB' }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        {/* Fine Divider */}
        <div className="cta-divider w-24 h-px bg-[#F4F1EB] opacity-30 mx-auto mb-8" />

        {/* Subtext — brand name, NOT translated */}
        <p className="cta-subtext eyebrow !text-[#F4F1EB] opacity-50">
          Shri Radhika Developers
        </p>
      </div>
      </div>
    </section>
  )
}

export default ClosingCTA
