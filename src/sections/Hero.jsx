import { useRef } from 'react'
import { hero, company } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('premiumReveal', '0.22, 1, 0.36, 1')

function Hero() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // ══════════════════════════════════════════════════════════════
    // DESKTOP — Cinematic Entrance + Pointer Depth + Scroll Separation
    // ══════════════════════════════════════════════════════════════
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const isScrolled = window.scrollY > 0
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      entranceTl.from('.reveal-nav', {
        y: -30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
      })
      .to('.hero-curtain', {
        yPercent: -100,
        duration: 1.4,
        ease: 'power3.inOut',
      }, "-=0.5")
      .fromTo('.hero-image',
        { scale: 0.96, opacity: 0, y: 12 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'premiumReveal' },
        "-=1.1" // Align with the curtain reveal
      )
      .from('.hero-headline-line', {
        yPercent: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out'
      }, "-=1.0")
      .from('.hero-label', {
        y: 25,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
      }, "-=0.6")
      .from('.hero-scroll', {
        opacity: 0,
        y: 10,
        duration: 1,
      }, "-=0.3")

      if (isScrolled) {
        entranceTl.progress(1)
      }

      // ── Pointer Depth (unchanged) ──
      // Image: stronger response — quickTo owns x and y on .hero-image-wrapper
      const imgXTo = gsap.quickTo('.hero-image-inner', 'x', {
  duration: 0.8,
  ease: 'power3'
})

const imgYTo = gsap.quickTo('.hero-image-inner', 'y', {
  duration: 0.8,
  ease: 'power3'
})
      // Text: subtle opposing response
      const txtXTo = gsap.quickTo('.hero-text-content', 'x', { duration: 1.2, ease: 'power3' })
      const txtYTo = gsap.quickTo('.hero-text-content', 'y', { duration: 1.2, ease: 'power3' })

      const handleMouseMove = (e) => {
        const xRatio = e.clientX / window.innerWidth - 0.5
        const yRatio = e.clientY / window.innerHeight - 0.5
        imgXTo(xRatio * 50)
        imgYTo(yRatio * 50)
        txtXTo(xRatio * -12)
        txtYTo(yRatio * -8)
      }

      const container = containerRef.current
      container?.addEventListener('mousemove', handleMouseMove)

      // ── Scroll Transformation ──
      // Lines queried individually — each line gets a different movement vector.
      // .hero-image-wrapper: only scale is animated here.
      // x and y on .hero-image-wrapper are owned exclusively by the quickTo handlers above.
      //
      // 3-phase opacity structure (10-unit internal duration):
      //   Phase 1 (0–20%):  movement begins subtly, opacity = 1
      //   Phase 2 (20–65%): clear separation, still fully visible
      //   Phase 3 (65–100%): movement continues, opacity fades to 0
      const lines = container.querySelectorAll('.hero-headline-line')

      const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: '+=140%',
    scrub: 1.5,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
})

gsap.set('.hero-image-wrapper', {
  transformOrigin: '50% 55%',
})

gsap.set('.hero-image', {
  transformOrigin: '50% 55%',
})


scrollTl

  // ── HEADLINE — separate early, then hold and fade ──

  // Line 1 does most of its movement by 70%
  .to(
    lines[0],
    {
      x: -38,
      y: -52,
      ease: 'none',
      duration: 7,
    },
    0
  )

  // Small final continuation while fading
  .to(
    lines[0],
    {
      x: -45,
      y: -60,
      ease: 'none',
      duration: 3,
    },
    7
  )

  // Line 2 does most of its movement by 70%
  .to(
    lines[1],
    {
      x: 46,
      y: 42,
      ease: 'none',
      duration: 7,
    },
    0
  )

  // Small final continuation while fading
  .to(
    lines[1],
    {
      x: 55,
      y: 50,
      ease: 'none',
      duration: 3,
    },
    7
  )

  // Opacity fade starts at pos 5 (middle of animation) so text is mostly
  // transparent before it reaches its most extreme x/y positions.
  // At pos 8.5 (when fade ends) the headline is completely gone, well
  // before positions that would cause visible viewport edge clipping.
  .to(
    lines[0],
    {
      opacity: 0,
      ease: 'none',
      duration: 3.5,
    },
    5
  )

  .to(
    lines[1],
    {
      opacity: 0,
      ease: 'none',
      duration: 3.5,
    },
    5
  )


  // ── SUPPORTING LABELS ──

  .to(
    '.hero-label',
    {
      y: -30,
      opacity: 0,
      ease: 'none',
      duration: 8,
    },
    2
  )


  // ── SCROLL INDICATOR ──

  .to(
    '.hero-scroll',
    {
      opacity: 0,
      y: -15,
      ease: 'none',
      duration: 4,
    },
    0
  )


  // ── IMAGE OUTER FRAME ──
  // Very controlled growth. The wrapper should NOT do all the zooming.

// ── IMAGE TAKEOVER ──
// Starts while the headline is already separating,
// so the image visually responds to the space being created.

// ── DESKTOP IMAGE TAKEOVER ──
// The image begins responding while the headline is separating.
// As the headline approaches the end of its transition,
// the entire image frame travels toward the center and grows.

// ── DESKTOP IMAGE TAKEOVER ──
// The image stays in its editorial position while the headline begins separating.
// It then travels toward the true visual center as the headline fades.

.to(
  '.hero-image-wrapper',
  {
    x: () => {
      const imageWrapper = container.querySelector('.hero-image-wrapper')
      if (!imageWrapper) return 0

      const rect = imageWrapper.getBoundingClientRect()

      // Remove the currently applied GSAP x value so the calculation
      // always targets the element's original layout position.
      const currentX = Number(gsap.getProperty(imageWrapper, 'x')) || 0
      const baseCenter =
        rect.left + rect.width / 2 - currentX

      return window.innerWidth / 2 - baseCenter
    },

    scale: 1.11,
    ease: 'none',
    duration: 4.5,
  },
  4.5
)

.to(
  '.hero-image',
  {
    scale: 1.04,
    y: -6,
    ease: 'none',
    duration: 4.5,
  },
  4.5
)

// Final composition hold.
// The image is centered and settled before the next section begins.
.to({}, { duration: 1.5 })
      return () => {
        container?.removeEventListener('mousemove', handleMouseMove)
      }
    })

    // ══════════════════════════════════════════════════════════════
    // MOBILE — Entrance + One Coordinated Scroll Timeline
    // ══════════════════════════════════════════════════════════════
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const isScrolled = window.scrollY > 0
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      entranceTl.from('.reveal-nav', {
        y: -15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
      })
      .fromTo('.hero-curtain',
        { yPercent: 0 },
        { yPercent: -100, duration: 0.9, ease: 'power3.inOut' },
        "-=0.3"
      )
      .fromTo('.hero-image',
        { scale: 0.96, opacity: 0, y: 12, filter: 'grayscale(1) brightness(0.85)' },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'premiumReveal', filter: 'grayscale(1) brightness(0.85)' },
        "-=0.6"
      )
      .from('.hero-headline-line', {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      }, "-=0.6")
      .from('.hero-label', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
      }, "-=0.4")
      .from('.hero-scroll', {
        opacity: 0,
        duration: 0.5,
      }, "-=0.2")
      .to('.hero-image', {
        filter: 'grayscale(0) brightness(1)',
        duration: 0.9,
        ease: 'power2.inOut',
      }, "-=0.3")

      if (isScrolled) {
        entranceTl.progress(1)
      }

      const container = containerRef.current
      const lines = container.querySelectorAll('.hero-headline-line')

      // ── Scroll indicator: utility element, exits first independently ──
      // Intentionally outside mobileTl — it vanishes before the main composition begins.
      gsap.to('.hero-scroll', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '15% top',
          scrub: true,
        }
      })

      // ── One coordinated timeline ──
      // Headline lines + labels + image all share a single ScrollTrigger.
      // This replaces the old block-level .hero-text-content fade and the
      // expandTl edge-to-edge technique. The expandTl trigger ('top 78%' on
      // imageWrapper) never fired during Hero scroll — the image loads at ~35%
      // viewport height and moves upward on scroll, away from the 78% mark.
      //
      // 4-phase visual choreography (10-unit internal duration):
      //   Phase 1 (0–35%):   headline leads — image stays near scale 1.0
      //   Phase 2 (35–65%):  headline clearly separated — image growth begins
      //   Phase 3 (65–85%):  text fading — image nearing dominant final state
      //   Phase 4 (85–100%): image settled at max — headline gone — next section begins
      //
      // If pacing feels too fast: widen 'end' only (e.g. '90% top').
      // Do not adjust scale, movement distances, or scrub value.
      const mobileTl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: '+=140%',
    scrub: 0.8,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
})

gsap.set('.hero-image-wrapper', {
  transformOrigin: '50% 55%',
})

gsap.set('.hero-image', {
  transformOrigin: '50% 55%',
})

      mobileTl

  // ═══════════════════════════════════════
  // HEADLINE — SEPARATE FIRST
  // ═══════════════════════════════════════

  // Line 1: most movement happens before fading
  .to(
    lines[0],
    {
      x: -10,
      y: -42,
      ease: 'none',
      duration: 7,
    },
    0
  )

  // Small final movement during fade
  .to(
    lines[0],
    {
      x: -12,
      y: -50,
      ease: 'none',
      duration: 3,
    },
    7
  )


  // Line 2: opposite direction
  .to(
    lines[1],
    {
      x: 8,
      y: 38,
      ease: 'none',
      duration: 7,
    },
    0
  )

  // Small final continuation
  .to(
    lines[1],
    {
      x: 10,
      y: 45,
      ease: 'none',
      duration: 3,
    },
    7
  )


  // Headline stays fully visible through most of the separation
  .to(
    lines[0],
    {
      opacity: 0,
      ease: 'none',
      duration: 3.5,
    },
    6.5
  )

  .to(
    lines[1],
    {
      opacity: 0,
      ease: 'none',
      duration: 3.5,
    },
    6.5
  )


  // ═══════════════════════════════════════
  // SUPPORTING LABELS
  // ═══════════════════════════════════════

  .to(
    '.hero-label',
    {
      y: -20,
      opacity: 0,
      ease: 'none',
      duration: 7,
    },
    2
  )


  // ═══════════════════════════════════════
  // MOBILE IMAGE TAKEOVER
  // ═══════════════════════════════════════
  //
  // The wrapper scales only — no y movement.
  // Moving the clipping frame (overflow:hidden) would shift the entire
  // image box, which reads as the frame floating rather than the image
  // taking over the composition.
  //
  // Compositional reframing comes from moving the INNER image (hero-image)
  // upward within the stationary clipped frame. This creates a camera-pan
  // effect — the viewer is gradually drawn into the architecture.
  //
  // Wrapper: frame grows (scale 1 → 1.10), stays in position
  // Inner:   image pans up within the frame (y: -22) + slight zoom (1.04)

  // Wrapper: scale only, delayed start so headline leads
  .to(
    '.hero-image-wrapper',
    {
      scale: 1.10,
      ease: 'none',
      duration: 6,
    },
    3.5
  )

  // Inner image: camera pan upward within the clipping frame.
  // Negative y reveals more of the upper portion of the building.
  // Scale adds a secondary subtle zoom that compounds with the wrapper.
  .to(
    '.hero-image',
    {
      scale: 1.04,
      y: -22,
      ease: 'none',
      duration: 5.5,
    },
    4.5
  )

  // Final hold: image settled at dominant composition.
  // No further changes — user sees the completed state before Hero releases.
  .to({}, { duration: 1.5 })


    })
  }, { scope: containerRef })

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex flex-col justify-start md:justify-center md:min-h-screen section-padding-x pt-24 pb-10 sm:pt-28 sm:pb-16 md:py-32 bg-ivory overflow-hidden"
    >
      <div className="container-base grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start lg:items-center relative z-10">
        {/* Main Statement */}
        <div className="hero-text-content lg:col-span-7 will-change-transform">
          <div className="mb-4 md:mb-8">
            {hero.headline.map((line, index) => (
              <div key={index} className="overflow-hidden pb-1 md:pb-2">
                <h1
                  className="hero-headline-line display-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight will-change-transform"
                >
                  {line}
                </h1>
              </div>
            ))}
          </div>

          {/* Supporting Label */}
          <div className="mt-4 md:mt-16">
            <p className="hero-label eyebrow">
              {company.name}
            </p>
            <p className="hero-label eyebrow mt-1">
              {hero.label}
            </p>
          </div>
        </div>

        {/* Editorial Image */}
        <div className="hero-image-wrapper col-span-1 lg:col-span-5 h-[48svh] sm:h-[52svh] md:h-[55vh] lg:h-[65vh] w-full mt-6 lg:mt-0 overflow-hidden relative will-change-transform">
          {/* Vertical Curtain Overlay */}
          <div className="hero-curtain absolute inset-0 bg-black z-20 pointer-events-none" />
          <div className="hero-image-inner absolute inset-0">
            {hero.image && (
              <img
                src={hero.image}
                alt={company.name}
                className="hero-image w-full h-full object-cover md:grayscale md:hover:grayscale-0 md:transition-all md:duration-1000 origin-center"
              />
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll relative mt-6 md:mt-0 md:absolute md:bottom-8 md:left-12 lg:left-20 z-10">
        <p className="eyebrow flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-neutral" />
          {hero.scrollIndicator}
        </p>
      </div>
    </section>
  )
}

export default Hero
