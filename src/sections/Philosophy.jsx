import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '../hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger)

// Asset imports
import locationBg from '../assets/images/location/contour-map.svg'
import locationDirection from '../assets/images/location/direction-svgrepo-com.svg'
import locationMap from '../assets/images/location/architecture-blueprint-svgrepo-com.svg'
import locationCompass from '../assets/images/location/compass.svg'

import visionBg from '../assets/images/vision/background.svg'
import visionTelescope from '../assets/images/vision/telescope-4-svgrepo-com.svg'
import visionLens from '../assets/images/vision/lens-svgrepo-com.svg'
import visionSunset from '../assets/images/vision/sun-set-svgrepo-com.svg'

import devBg from '../assets/images/development/floor-plan.png'
import devCrane from '../assets/images/development/construction-crane-svgrepo-com.svg'
import devHousePlans from '../assets/images/development/House Plans-svgfind-com.svg'
import devBlueprint from '../assets/images/development/blueprint-svgrepo-com (1).svg'

import valueBg from '../assets/images/value/pillar.png'
import valueArch from '../assets/images/value/arch-bridge-svgrepo-com.svg'
import valueGrowth from '../assets/images/value/growth-svgrepo-com.svg'
import valueGlobe from '../assets/images/value/globe-alt-svgrepo-com.svg'

/* -------------------------------------------------------------------------- */
/* STAGE DATA                                                                 */
/* -------------------------------------------------------------------------- */

const philosophyStages = [
  {
    id: 'location',
    number: '01',
    title: 'Location',
    statement: 'Every development begins with understanding the place.',
    support:
      'Recognising the character, potential and long-term opportunity within a location.',
    backgroundSvg: locationBg,
    icons: [
      {
        src: locationDirection,
        role: 'primary',
        from: { x: -65, y: -40, rotate: -5 },
      },
      {
        src: locationMap,
        role: 'secondary',
        from: { x: 55, y: -30, rotate: 5 },
      },
      {
        src: locationCompass,
        role: 'tertiary',
        from: { x: -40, y: 40, rotate: -4 },
      },
    ],
  },
  {
    id: 'vision',
    number: '02',
    title: 'Vision',
    statement: 'Seeing potential before it becomes obvious.',
    support:
      'Looking beyond what exists today toward what a place can become.',
    backgroundSvg: visionBg,
    icons: [
      {
        src: visionTelescope,
        role: 'primary',
        from: { x: -75, y: -25, rotate: -5 },
      },
      {
        src: visionLens,
        role: 'secondary',
        from: { x: 50, y: -45, rotate: 7 },
      },
      {
        src: visionSunset,
        role: 'tertiary',
        from: { x: 40, y: 40, rotate: 4 },
      },
    ],
  },
  {
    id: 'development',
    number: '03',
    title: 'Development',
    statement: 'Turning possibility into something real.',
    support:
      'Bringing vision into physical form through precision, purpose and execution.',
    backgroundSvg: devBg,
    icons: [
      {
        src: devCrane,
        role: 'primary',
        from: { x: 70, y: -50, rotate: 5 },
      },
      {
        src: devHousePlans,
        role: 'secondary',
        from: { x: -55, y: 40, rotate: -6 },
      },
      {
        src: devBlueprint,
        role: 'tertiary',
        from: { x: -40, y: -35, rotate: -4 },
      },
    ],
  },
  {
    id: 'value',
    number: '04',
    title: 'Value',
    statement: 'Creating spaces that hold lasting value.',
    support:
      'Developments designed with balance, permanence and long-term relevance in mind.',
    backgroundSvg: valueBg,
    icons: [
      {
        src: valueArch,
        role: 'primary',
        from: { x: -60, y: 45, rotate: -4 },
      },
      {
        src: valueGrowth,
        role: 'secondary',
        from: { x: 55, y: -35, rotate: 5 },
      },
      {
        src: valueGlobe,
        role: 'tertiary',
        from: { x: 40, y: 40, rotate: 4 },
      },
    ],
  },
]

const STAGE_DURATIONS = [5000, 5000, 5000, 5500]

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Philosophy({ isActive = false }) {
  const { t } = useTranslation()

  const sectionRef = useRef(null)
  const stageContainerRef = useRef(null)
  const stageRefs = useRef([])
  const bgRefs = useRef([])
  const iconRefs = useRef([])

  const [activeStage, setActiveStage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const activeStageRef = useRef(0)
  const timerRef = useRef(null)
  const tlRef = useRef(null)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    activeStageRef.current = activeStage
  }, [activeStage])

  // Initial setup on mount: Stage 0 (Location) fully visible & prepared
  useEffect(() => {
    const stages = stageRefs.current.filter(Boolean)
    const bgs = bgRefs.current.filter(Boolean)

    if (!stages.length) return

    stages.forEach((stageEl, i) => {
      if (i === 0) {
        gsap.set(stageEl, { autoAlpha: 1, y: 0 })
      } else {
        gsap.set(stageEl, { autoAlpha: 0, y: 20 })
      }
    })

    bgs.forEach((bgEl, i) => {
      if (!bgEl) return
      if (i === 0) {
        gsap.set(bgEl, { autoAlpha: 1, scale: 1 })
      } else {
        gsap.set(bgEl, { autoAlpha: 0, scale: 1.05 })
      }
    })

    iconRefs.current.forEach((stageIconList, stageIdx) => {
      const icons = (stageIconList || []).filter(Boolean)
      icons.forEach((iconEl, iconIdx) => {
        if (stageIdx === 0) {
          gsap.set(iconEl, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotate: 0 })
        } else {
          const iconData = philosophyStages[stageIdx]?.icons[iconIdx]
          const fromProps = iconData?.from || { x: 0, y: 30, rotate: 0 }
          gsap.set(iconEl, {
            autoAlpha: 0,
            scale: 0.82,
            x: fromProps.x,
            y: fromProps.y,
            rotate: fromProps.rotate,
          })
        }
      })
    })

    return () => {
      if (tlRef.current) tlRef.current.kill()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Opening animation — scroll-controlled, plays ONLY after Philosophy is visually focused
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions.reduceMotion) return

        const { isDesktop } = context.conditions
        // Starts strictly after the Introduction -> Philosophy focus handoff completes
        const startPos = isDesktop ? 'top 22%' : 'top 25%'
        const endPos = isDesktop ? 'top 4%' : 'top 6%'

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'philosophy-reveal',
            trigger: sectionRef.current,
            start: startPos,
            end: endPos,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })

        tl.from('.philosophy-header', {
          opacity: 0,
          y: 16,
          ease: 'none',
        }, 0)
          .from('.philosophy-stage-content', {
            opacity: 0,
            y: 18,
            ease: 'none',
          }, 0.1)
          .from('.philosophy-foreground-layer', {
            opacity: 0,
            scale: 0.88,
            ease: 'none',
          }, 0.15)
          .from('.philosophy-progress', {
            opacity: 0,
            y: 10,
            ease: 'none',
          }, 0.22)
      }
    )
  }, { scope: sectionRef })

  // Observe section visibility (pause off-screen, resume when visible)
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(sectionEl)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false)
      } else if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect()
        const vh = window.innerHeight
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
        )
        setIsVisible(visibleHeight / rect.height >= 0.25)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Stage transition logic using GSAP timeline
  const transitionToStage = (fromIdx, toIdx) => {
    const stages = stageRefs.current.filter(Boolean)
    const bgs = bgRefs.current.filter(Boolean)

    const fromStageEl = stages[fromIdx]
    const fromBgEl = bgs[fromIdx]
    const fromIcons = (iconRefs.current[fromIdx] || []).filter(Boolean)

    const toStageEl = stages[toIdx]
    const toBgEl = bgs[toIdx]
    const toIcons = (iconRefs.current[toIdx] || []).filter(Boolean)

    if (tlRef.current) {
      tlRef.current.kill()
    }

    isTransitioningRef.current = true

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false
        setActiveStage(toIdx)
        activeStageRef.current = toIdx
      },
    })
    tlRef.current = tl

    // Exit phase for current stage (fromIdx)
    if (fromStageEl && fromIdx !== toIdx) {
      tl.to(
        fromStageEl,
        {
          autoAlpha: 0,
          y: -18,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0
      )

      if (fromBgEl) {
        tl.to(
          fromBgEl,
          {
            autoAlpha: 0,
            scale: 0.96,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          0
        )
      }

      fromIcons.forEach((iconEl, iconIdx) => {
        const iconData = philosophyStages[fromIdx]?.icons[iconIdx]
        const fromProps = iconData?.from || { x: 0, y: 30, rotate: 0 }
        tl.to(
          iconEl,
          {
            autoAlpha: 0,
            x: fromProps.x * 1.2,
            y: fromProps.y * 1.2,
            scale: 0.9,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          0 + iconIdx * 0.04
        )
      })
    }

    // Entrance phase for target stage (toIdx)
    if (toStageEl) {
      const enterStart = fromIdx !== toIdx ? 0.22 : 0

      if (toBgEl) {
        tl.fromTo(
          toBgEl,
          { autoAlpha: 0, scale: 1.05 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          enterStart
        )
      }

      tl.fromTo(
        toStageEl,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        },
        enterStart + 0.08
      )

      toIcons.forEach((iconEl, iconIdx) => {
        const iconData = philosophyStages[toIdx]?.icons[iconIdx]
        const fromProps = iconData?.from || { x: 0, y: 30, rotate: 0 }

        tl.fromTo(
          iconEl,
          {
            autoAlpha: 0,
            scale: 0.82,
            x: fromProps.x,
            y: fromProps.y,
            rotate: fromProps.rotate,
          },
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 0.75,
            ease: 'power3.out',
          },
          enterStart + 0.15 + iconIdx * 0.1
        )
      })
    }
  }

  // Automatic progression loop
  useEffect(() => {
    if (!isVisible) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const currentIdx = activeStage
    const duration = STAGE_DURATIONS[currentIdx] || 5000

    timerRef.current = setTimeout(() => {
      const nextIdx = (currentIdx + 1) % philosophyStages.length
      transitionToStage(currentIdx, nextIdx)
    }, duration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isVisible, activeStage])

  // Manual stage selection handler
  const handleStageClick = (targetIdx) => {
    if (targetIdx === activeStageRef.current && !isTransitioningRef.current) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const currentIdx = activeStageRef.current
    transitionToStage(currentIdx, targetIdx)
  }

  return (
    <section
      ref={sectionRef}
      className={`philosophy-section ${isActive ? 'is-active' : ''}`}
      id="philosophy"
    >
      <div className="section-focus-wrapper w-full h-full relative">
      {/* HEADER */}
      <div className="philosophy-header">
        <span className="philosophy-eyebrow intro-eyebrow eyebrow ">{t('philosophy.eyebrow')}</span>
        <p className="philosophy-intro">
         {t('philosophy.intro')}
        </p>
      </div>

      {/* DESKTOP / MOBILE STAGES */}
      <div
        ref={stageContainerRef}
        className="philosophy-stage-container"
      >
        {philosophyStages.map((stage, stageIndex) => (
          <article
            key={stage.id}
            ref={(element) => {
              stageRefs.current[stageIndex] = element
            }}
            className={`principle-item philosophy-stage philosophy-stage--${stage.id}`}
          >
            {/* Layer 1: Background SVG */}
            <div
              className="philosophy-bg-layer"
              ref={(element) => {
                bgRefs.current[stageIndex] = element
              }}
            >
              <img
                src={stage.backgroundSvg}
                alt=""
                className="philosophy-bg-svg"
                aria-hidden="true"
              />
            </div>

            {/* Layer 3: Foreground SVG Icons Layer */}
            <div className="philosophy-foreground-layer">
              {stage.icons.map((icon, iconIndex) => (
                <div
                  key={iconIndex}
                  className={`philosophy-icon-wrapper philosophy-icon--${icon.role} philosophy-icon--${stage.id}-${iconIndex + 1}`}
                  ref={(element) => {
                    if (!iconRefs.current[stageIndex]) {
                      iconRefs.current[stageIndex] = []
                    }
                    iconRefs.current[stageIndex][iconIndex] = element
                  }}
                >
                  <img
                    src={icon.src}
                    alt=""
                    className="philosophy-icon-svg"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>

            {/* Layer 2: Editorial Central Content */}
            <div className="philosophy-stage-content">
              <span className="philosophy-stage-number">{stage.number}</span>
              <span className="philosophy-stage-title">{t(`philosophy.${stage.id}.title`)}</span>
              <h2 className="philosophy-stage-statement">{t(`philosophy.${stage.id}.statement`)}</h2>
              <p className="philosophy-stage-support">{t(`philosophy.${stage.id}.support`)}</p>
            </div>
          </article>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="philosophy-progress">
        {philosophyStages.map((stage, index) => (
          <button
            type="button"
            key={stage.id}
            onClick={() => handleStageClick(index)}
            className={`philosophy-progress-item ${
              activeStage === index ? 'is-active' : ''
            }`}
            aria-label={`Go to stage ${stage.number}: ${t(`philosophy.${stage.id}.title`)}`}
          >
            {stage.number}
          </button>
        ))}
      </div>
      </div>
    </section>
  )
}