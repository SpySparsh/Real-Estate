import { useRef } from 'react'
import { hero, company } from '../data/siteData'
import backPng from '../assets/back.png'
import leftTopFoliage from '../assets/left-top-foliage.png'
import rightTopFoliage from '../assets/right-top-foliage.png'
import leftBottomFoliage from '../assets/left-bottom-foliage.png'
import rightBottomFoliage from '../assets/right-bottom-foliage.png'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '../hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('premiumReveal', '0.22, 1, 0.36, 1')

function Hero() {
  const containerRef = useRef(null)
  const { language, t, tArray } = useTranslation()

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
          end: '+=200%',
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      })

      mobileTl
        // ═══════════════════════════════════════
        // PHASE 1: ORIGINAL HEADLINE & LABELS SEPARATION & FADE
        // ═══════════════════════════════════════
        .set('.hero-curtain', { opacity: 0 }, 0)
        .to(lines[0], { x: -10, y: -42, ease: 'none', duration: 4.5 }, 0)
        .to(lines[1], { x: 8, y: 38, ease: 'none', duration: 4.5 }, 0)
        .to(lines[0], { opacity: 0, ease: 'none', duration: 2.8 }, 1.5)
        .to(lines[1], { opacity: 0, ease: 'none', duration: 2.8 }, 1.5)
        .to('.hero-label', { y: -20, opacity: 0, ease: 'none', duration: 3 }, 1)

        // ═══════════════════════════════════════
        // PHASE 2: BUILDING IMAGE FADES OUT COMPLETELY
        // (Starts after headline begins disappearing; fully gone by 7.0)
        // ═══════════════════════════════════════
        .to('.hero-image', { opacity: 0, ease: 'power1.inOut', duration: 3.0 }, 4.0)

        // ═══════════════════════════════════════
        // PHASE 3: REVEAL back.png (ONLY AFTER building is completely invisible)
        // (Zero crossfade: 7.0 to 7.8 is clear ivory gap)
        // ═══════════════════════════════════════
        .fromTo('.hero-stone-image',
          { opacity: 0 },
          { opacity: 1, ease: 'power1.inOut', duration: 3.6 },
          7.8
        )

        // ═══════════════════════════════════════
        // PHASE 4: REVEAL NEW TYPOGRAPHY INSIDE CENTRAL STONE
        // (Once back.png is substantially/fully visible at 11.4+)
        // ═══════════════════════════════════════
        // Line 1 emerges
        .fromTo('.hero-stone-line-upper',
          { opacity: 0, y: 16, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 2.8 },
          11.6
        )
        // Divider resolves
        .fromTo('.hero-stone-divider',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, ease: 'power2.out', duration: 2.0 },
          12.6
        )
        // Line 2 emerges
        .fromTo('.hero-stone-line-lower',
          { opacity: 0, y: 16, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 2.4 },
          13.4
        )

        // ═══════════════════════════════════════
        // PHASE 4B: ORGANIC FOLIAGE ENTRANCE
        // (Begins with text at 11.6, subtle stagger, completes slightly after text at 16.35)
        // ═══════════════════════════════════════
        // 1. Top-Left: first (anchored further out toward top-left edge)
        .fromTo('.hero-foliage-tl',
          { x: -140, y: -120, opacity: 0, rotate: -6 },
          { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 4.2 },
          11.6
        )
        // 2. Top-Right: slightly after
        .fromTo('.hero-foliage-tr',
          { x: 150, y: -130, opacity: 0, rotate: 6 },
          { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 4.15 },
          11.85
        )
        // 3. Bottom-Left: enters from left edge, moving inward and slightly upward (↗)
        .fromTo('.hero-foliage-bl',
          { x: -150, y: 40, opacity: 0, rotate: 4 },
          { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 4.05 },
          12.1
        )
        // 4. Bottom-Right: enters from right edge, moving inward and slightly upward (↖)
        .fromTo('.hero-foliage-br',
          { x: 150, y: 40, opacity: 0, rotate: -4 },
          { x: 0, y: 0, opacity: 1, rotate: 0, ease: 'power2.out', duration: 4.0 },
          12.35
        )

        // SUBTLE FINAL TYPOGRAPHY GROWTH
        .to('.hero-stone-text', {
          scale: 1.06,
          ease: 'power2.out',
          duration: 1.8,
        }, 16.4)

        // FINAL HOLD
        .to({}, { duration: 3.2 })

    })
  }, { scope: containerRef })

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex flex-col justify-start md:justify-center min-h-[100svh] section-padding-x pt-24 pb-10 sm:pt-28 sm:pb-16 md:py-32 bg-ivory overflow-hidden"
    >
      <div className="container-base grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-start lg:items-center relative z-10">
        {/* Main Statement */}
        <div className="hero-text-content lg:col-span-7 will-change-transform">
          <div className="mb-4 md:mb-8">
            {tArray('hero.headlineLines').map((line, index) => (
              <div
                key={index}
                className={`hero-headline-wrapper overflow-hidden pb-1 md:pb-2 ${
                  language === 'hi' ? 'hero-headline-clip-hi' : ''
                }`}
              >
                <h1
                  className={`hero-headline-line display-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight will-change-transform${language === 'hi' ? ' lang-devanagari' : ''}`}
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
            <p className={`hero-label eyebrow mt-1${language === 'hi' ? ' lang-devanagari' : ''}`}>
              {t('hero.label')}
            </p>
          </div>
        </div>

        {/* Editorial Image */}
        <div className="hero-image-wrapper col-span-1 lg:col-span-5 h-[48svh] sm:h-[52svh] md:h-[55vh] lg:h-[65vh] w-full mt-6 lg:mt-0 overflow-hidden relative will-change-transform border-0 bg-transparent">
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

      {/* Mobile Full-Hero Stone Background — separate absolute layer covering the entire Hero */}
      <img
        src={backPng}
        alt="Stone Texture"
        className="hero-stone-image md:hidden absolute inset-0 w-full h-full object-cover object-[50%_48%] opacity-0 pointer-events-none z-[1]"
      />

      {/* Mobile Foliage Layers — independent Hero-level layers (z-[10], below typography z-20) */}
      <div className="hero-foliage-layer md:hidden absolute inset-0 overflow-hidden pointer-events-none z-[10]">
        {/* Top-Left Foliage — clearly enters from top + left edges */}
        <img
          src={leftTopFoliage}
          alt=""
          aria-hidden="true"
          className="hero-foliage hero-foliage-tl absolute -top-[3%] -left-[6%] w-[60vw] max-w-[245px] opacity-0 will-change-transform"
        />

        {/* Top-Right Foliage */}
        <img
          src={rightTopFoliage}
          alt=""
          aria-hidden="true"
          className="hero-foliage hero-foliage-tr absolute -top-[3%] -right-[6%] w-[68vw] max-w-[280px] opacity-0 will-change-transform"
        />

        {/* Bottom-Left Foliage — originates from left side in lower 70-80% area, above bottom edge */}
        <img
          src={leftBottomFoliage}
          alt=""
          aria-hidden="true"
          className="hero-foliage hero-foliage-bl absolute top-[57%] -left-[7%] w-[60vw] max-w-[245px] opacity-0 will-change-transform"
        />

        {/* Bottom-Right Foliage — originates from right side in lower 70-80% area, above bottom edge */}
        <img
          src={rightBottomFoliage}
          alt=""
          aria-hidden="true"
          className="hero-foliage hero-foliage-br absolute top-[57%] -right-[7%] w-[60vw] max-w-[245px] opacity-0 will-change-transform"
        />
      </div>

      {/* Mobile Stone Typography — emerges inside the large central stone of back.png */}
      <div className="hero-stone-overlay md:hidden absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="hero-stone-text-container relative w-[80%] max-w-[320px] flex flex-col items-center justify-center overflow-visible py-3 translate-y-[2%]">
          <div className="hero-stone-text w-full flex flex-col items-center justify-center text-center">
            
            {/* FIRST LINE */}
            <div
              className={`hero-stone-line hero-stone-line-upper opacity-0 will-change-transform flex w-full justify-center text-center font-display font-normal text-[clamp(19px,5.6vw,26px)] leading-[1.15] tracking-[0.14em] uppercase text-[#F2E7D5] whitespace-nowrap${language === 'hi' ? ' lang-devanagari' : ''}`}
              style={{ textShadow: '0 2px 6px rgba(55, 35, 22, 0.45)' }}
            >
              {t('hero.transition.line1')}
            </div>

            {/* DIVIDER */}
            <div className="hero-stone-divider will-change-transform flex items-center justify-center w-[95px] sm:w-[110px] my-2.5 sm:my-3 opacity-0">
              <div className="h-[1px] flex-grow bg-[#F2E7D5]/70"></div>
              <svg className="mx-2 w-[8px] h-[8px] shrink-0" viewBox="0 0 24 24" fill="#F2E7D5" style={{ filter: 'drop-shadow(0px 2px 4px rgba(55, 35, 22, 0.45))' }}>
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <div className="h-[1px] flex-grow bg-[#F2E7D5]/70"></div>
            </div>

            {/* SECOND LINE */}
            <div
              className={`hero-stone-line hero-stone-line-lower opacity-0 will-change-transform flex w-full justify-center text-center font-display font-normal text-[clamp(19px,5.6vw,26px)] leading-[1.15] tracking-[0.14em] uppercase text-[#F2E7D5] whitespace-nowrap${language === 'hi' ? ' lang-devanagari' : ''}`}
              style={{ textShadow: '0 2px 6px rgba(55, 35, 22, 0.45)' }}
            >
              {t('hero.transition.line2')}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll relative mt-6 md:mt-0 md:absolute md:bottom-8 md:left-12 lg:left-20 z-10">
        <p className="eyebrow flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-neutral" />
          <span className={language === 'hi' ? 'lang-devanagari' : ''}>
            {t('hero.scrollIndicator')}
          </span>
        </p>
      </div>
    </section>
  )
}

export default Hero
