import { useRef } from 'react'
import { statistics } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

function PortfolioImpact() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Section entrance ──
      gsap.from('.impact-eyebrow', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'impact-eyebrow',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 80%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })

      // ── Divider wipe ──
      gsap.from('.impact-top-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          id: 'impact-top-divider',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 75%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })

      // ── Statistics: staggered entry + number counting ──
      const stats = gsap.utils.toArray('.impact-stat')

      stats.forEach((stat, i) => {
        const valueEl = stat.querySelector('.stat-value')
        const labelEl = stat.querySelector('.stat-label')
        const divider = stat.querySelector('.stat-divider')

        // Entry animation
        const entryTl = gsap.timeline({
          scrollTrigger: {
            id: `impact-stat-entry-${i}`,
            trigger: stat,
            start: getPostPhilosophyStart('top 88%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        })

        // Divider extends
        if (divider) {
          entryTl.from(divider, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.8,
            ease: 'power3.inOut',
          })
        }

        // Value rises up
        if (valueEl) {
          entryTl.from(valueEl, {
            yPercent: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
          }, '-=0.4')

          // If numeric value available, count up
          const numericTarget = valueEl.dataset.numericTarget
          if (numericTarget) {
            const target = parseInt(numericTarget, 10)
            const suffix = valueEl.dataset.suffix || ''
            const counter = { value: 0 }

            gsap.to(counter, {
              value: target,
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                id: `impact-stat-counter-${i}`,
                trigger: stat,
                start: getPostPhilosophyStart('top 85%'),
                toggleActions: 'play none none none',
                invalidateOnRefresh: true,
              },
              onUpdate: () => {
                valueEl.textContent = Math.round(counter.value) + suffix
              }
            })
          }
        }

        // Label fades in
        if (labelEl) {
          entryTl.from(labelEl, {
            opacity: 0,
            y: 10,
            duration: 0.6,
            ease: 'power3.out',
          }, '-=0.5')
        }

      })
    })

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const stats = gsap.utils.toArray('.impact-stat')

      stats.forEach((stat) => {
        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          end: 'bottom 15%',
          onUpdate: (self) => {
            const p = self.progress
            const emphasis = p < 0.5
              ? gsap.utils.mapRange(0, 0.5, 0.35, 1, p)
              : gsap.utils.mapRange(0.5, 1, 1, 0.35, p)
            gsap.set(stat, { opacity: gsap.utils.clamp(0.35, 1, emphasis) })
          }
        })
      })
    })

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
  const stats = gsap.utils.toArray('.impact-stat')

  let activeIndex = -1

  const updateActiveStat = () => {
    const viewportCenter = window.innerHeight / 2

    let closestIndex = 0
    let closestDistance = Infinity

    stats.forEach((stat, index) => {
      const rect = stat.getBoundingClientRect()
      const statCenter = rect.top + rect.height / 2
      const distance = Math.abs(statCenter - viewportCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex === activeIndex) return

    activeIndex = closestIndex

    stats.forEach((stat, index) => {
      const isActive = index === activeIndex

      gsap.to(stat, {
        opacity: isActive ? 1 : 0.38,
        y: isActive ? 0 : 12,
        scale: isActive ? 1 : 0.982,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      })
    })
  }

  stats.forEach((stat, index) => {
    gsap.set(stat, {
      opacity: index === 0 ? 1 : 0.38,
      y: index === 0 ? 0 : 12,
      scale: index === 0 ? 1 : 0.982,
    })
  })

  const trigger = ScrollTrigger.create({
    trigger: containerRef.current,
    start: getPostPhilosophyStart('top bottom'),
    end: 'bottom top',
    invalidateOnRefresh: true,

    onUpdate: updateActiveStat,
    onRefresh: updateActiveStat,
  })

  requestAnimationFrame(updateActiveStat)

  return () => trigger.kill()
})
  }, { scope: containerRef })

  // Parse stat values to detect numeric targets
  const parseStatValue = (stat) => {
    // Try to extract a number from placeholder values like "XX+" or "25+"
    const match = stat.value.match(/^(\d+)(.*)$/)
    if (match && stat.numericValue !== null) {
      return {
        numericTarget: stat.numericValue,
        suffix: match[2] || '',
        display: stat.value,
      }
    }
    return { numericTarget: null, suffix: '', display: stat.value }
  }

  return (
    <section ref={containerRef} className="section-padding-x py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-black text-ivory relative overflow-hidden">
      {/* Subtle top gradient transition from ivory */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-ivory to-transparent z-10 pointer-events-none" />

      <div className="container-base relative z-20">
        {/* Section Label */}
        <p className="impact-eyebrow eyebrow mb-6 md:mb-12 text-neutral/70">
          Portfolio Impact
        </p>

        {/* Top divider */}
        <div className="impact-top-divider w-full h-px bg-ivory/10 mb-10 md:mb-24" />

        {/* Statistics — Sequential focus grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {statistics.map((stat, index) => {
            const parsed = parseStatValue(stat)

            return (
              <div key={index} className="impact-stat transition-all duration-500 origin-left">
                {/* Fine divider per stat */}
                <div className="stat-divider h-px bg-ivory/20 mb-6 md:mb-8" />

                {/* Value */}
                <div className="overflow-hidden mb-3 md:mb-6">
                  <p
                    className="stat-value font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl font-medium text-ivory leading-none tracking-tight"
                    data-numeric-target={parsed.numericTarget}
                    data-suffix={parsed.suffix}
                  >
                    {parsed.display}
                  </p>
                </div>

                {/* Label */}
                <p className="stat-label font-body text-xs sm:text-sm tracking-[0.2em] uppercase text-neutral/70 max-w-[15rem]">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PortfolioImpact
