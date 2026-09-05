import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import introImage1 from '../assets/intro-image-1.png'
import introImage2 from '../assets/intro-image-2.png'

gsap.registerPlugin(ScrollTrigger)

/* ─── Scale Data ─────────────────────────────────────────────────────────── */

const STATES = [
  {
    image: introImage1,
    imageAlt: 'Site planning and land mapping stage',
    label: 'Planning',
    note: 'Indicative analysis — planning stage',
    scales: [
      {
        id: 'value',
        label: 'Value',
        value: 0.27,           // low ~25–30%
      },
      {
        id: 'potential',
        label: 'Potential',
        value: 0.82,           // high ~80–85%
      },
      {
        id: 'opportunity',
        label: 'Opportunity',
        value: 0.72,           // high ~70–75%
      },
    ],
  },
  {
    image: introImage2,
    imageAlt: 'Completed development structure',
    label: 'Developed',
    note: 'Indicative analysis — developed stage',
    scales: [
      {
        id: 'value',
        label: 'Value Created',
        value: 0.94,           // very high ~90–95%
      },
      {
        id: 'potential',
        label: 'Development',
        value: 0.90,           // high ~80–85%
      },
      {
        id: 'opportunity',
        label: 'Market Presence',
        value: 0.80,           // high ~75–80%
      },
    ],
  },
]

const HOLD_MS      = 4000
const TRANS_MS     = 900   // crossfade duration (ms)
const SCALE_MS     = 750   // scale indicator animation (ms)

/* ─── Sub-component: single architectural scale ─────────────────────────── */

function ArchScale({ label, value, index }) {
  const trackRef   = useRef(null)
  const dotRef     = useRef(null)
  const tweenRef   = useRef(null)
  const valueRef   = useRef(value)   // tracks latest target without triggering effects
  const mountedRef = useRef(false)   // prevents animation on first render

  // ── Mount: set initial dot position immediately, attach resize handler ──
  useEffect(() => {
    const track = trackRef.current
    const dot   = dotRef.current
    if (!track || !dot) return

    const place = () => {
      const tw = track.getBoundingClientRect().width
      if (!tw) return
      // On resize, snap to wherever valueRef says (the current target)
      gsap.set(dot, { x: valueRef.current * tw })
    }

    place()             // set initial position instantly on first paint
    mountedRef.current = true

    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])   // ← no value dependency — only runs on mount / unmount

  // ── Value change: animate the dot to the new position ──
  useEffect(() => {
    // Skip the very first render; the mount effect already handled it
    if (!mountedRef.current) return

    const track = trackRef.current
    const dot   = dotRef.current
    if (!track || !dot) return

    valueRef.current = value   // update ref immediately so resize reads correctly

    const tw = track.getBoundingClientRect().width
    if (!tw) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (tweenRef.current) tweenRef.current.kill()

    if (prefersReduced) {
      gsap.set(dot, { x: value * tw })
    } else {
      tweenRef.current = gsap.to(dot, {
        x: value * tw,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: index * 0.06,   // gentle stagger between the three rows
      })
    }

    return () => {
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [value, index])

  const TICKS = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="intro-scale-row">
      <span className="intro-scale-label">{label}</span>
      <div className="intro-scale-track-wrapper">
        {/* Baseline line */}
        <div className="intro-scale-baseline" ref={trackRef}>
          {/* Tick marks */}
          {TICKS.map((t) => (
            <span
              key={t}
              className="intro-scale-tick"
              style={{ left: `${t * 100}%` }}
            />
          ))}
          {/* Indicator dot — positioned via GSAP */}
          <span className="intro-scale-dot" ref={dotRef} />
        </div>
        {/* Range labels */}
        <div className="intro-scale-range-labels">
          <span>—</span>
          <span>+</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function Introduction() {
  const containerRef = useRef(null)
  const img1Ref      = useRef(null)
  const img2Ref      = useRef(null)
  const timerRef     = useRef(null)
  const crossfadeRef = useRef(null)
  const isRunningRef = useRef(false)

  const [activeState, setActiveState] = useState(0)

  /* Entrance animation — unchanged from original intent */
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      tl.from('.intro-eyebrow', {
        opacity: 0,
        y: 14,
        duration: 0.5,
        ease: 'power3.out',
      })
        .from(
          '.intro-main-headline',
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          '.intro-scale-row',
          {
            opacity: 0,
            y: 16,
            stagger: 0.1,
            duration: 0.55,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        .from(
          '.intro-image-frame',
          {
            opacity: 0,
            y: 20,
            scale: 0.99,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.35'
        )
    })
  }, { scope: containerRef })

  /* Crossfade between images */
  const crossfadeTo = (nextIdx) => {
    const img1 = img1Ref.current
    const img2 = img2Ref.current
    if (!img1 || !img2) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = prefersReduced ? 0.01 : TRANS_MS / 1000

    if (crossfadeRef.current) crossfadeRef.current.kill()

    // img1 = state 0, img2 = state 1
    const toOpacity0 = nextIdx === 0 ? 1 : 0
    const toOpacity1 = nextIdx === 1 ? 1 : 0

    crossfadeRef.current = gsap.timeline()
    crossfadeRef.current
      .to(img1, { opacity: toOpacity0, duration: dur, ease: 'power2.inOut' }, 0)
      .to(img2, { opacity: toOpacity1, duration: dur, ease: 'power2.inOut' }, 0)
  }

  /* Cycle timer */
  const scheduleNext = (currentIdx) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const nextIdx = (currentIdx + 1) % STATES.length
      crossfadeTo(nextIdx)
      setActiveState(nextIdx)
    }, HOLD_MS)
  }

  /* Manual switch */
  const switchTo = (idx) => {
    if (idx === activeState) return
    if (timerRef.current) clearTimeout(timerRef.current)
    crossfadeTo(idx)
    setActiveState(idx)
  }

  /* Start / resume cycle when activeState changes */
  useEffect(() => {
    scheduleNext(activeState)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [activeState])

  /* Pause when tab is hidden */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearTimeout(timerRef.current)
      } else {
        scheduleNext(activeState)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [activeState])

  /* Init: ensure img1 visible, img2 hidden */
  useEffect(() => {
    if (img1Ref.current) gsap.set(img1Ref.current, { opacity: 1 })
    if (img2Ref.current) gsap.set(img2Ref.current, { opacity: 0 })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (crossfadeRef.current) crossfadeRef.current.kill()
    }
  }, [])

  const current = STATES[activeState]

  return (
    <section
      ref={containerRef}
      className="intro-section"
      id="introduction"
      aria-label="Introduction — Planning to Development"
    >
      <div className="container-base intro-inner">

        {/* ── Eyebrow ─────────────────────────────────────────────────── */}
        <p className="intro-eyebrow eyebrow">Introduction</p>

        {/* ── Two-column layout ──────────────────────────────────────── */}
        <div className="intro-grid">

          {/* Left: Scales ─────────────────────────────────────────── */}
          <div className="intro-scales-col">

            <h2 className="intro-main-headline display-heading text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-12 lg:mb-16">
              See Beyond the Site.
            </h2>

            {/* State label / stage indicator */}
            <div className="intro-stage-indicators">
              {STATES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className={`intro-stage-btn${activeState === i ? ' is-active' : ''}`}
                  onClick={() => switchTo(i)}
                  aria-pressed={activeState === i}
                  aria-label={`View ${s.label} stage`}
                >
                  <span className="intro-stage-dot-indicator" />
                  <span className="intro-stage-btn-label">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Scales */}
            <div className="intro-scales-list">
              {current.scales.map((sc, i) => (
                <ArchScale
                  key={sc.id}
                  label={sc.label}
                  value={sc.value}
                  index={i}
                />
              ))}
            </div>

            {/* Sub-note */}
            <p className="intro-scales-note">
              {current.note}
            </p>
          </div>

          {/* Right: Image ──────────────────────────────────────────── */}
          <div className="intro-image-col">
            <div className="intro-image-frame">
              {/* Image 1 (state 0) */}
              <img
                ref={img1Ref}
                src={STATES[0].image}
                alt={STATES[0].imageAlt}
                className="intro-img intro-img--1"
              />
              {/* Image 2 (state 1) */}
              <img
                ref={img2Ref}
                src={STATES[1].image}
                alt={STATES[1].imageAlt}
                className="intro-img intro-img--2"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
