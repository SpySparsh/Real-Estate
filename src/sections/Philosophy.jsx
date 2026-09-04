import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

gsap.registerPlugin(ScrollTrigger)

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

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Philosophy({ isActive = false }) {
  const sectionRef = useRef(null)
const stageContainerRef = useRef(null)
const stageRefs = useRef([])
  const bgRefs = useRef([])
  const iconRefs = useRef([])
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
const stageContainer = stageContainerRef.current

if (!section || !stageContainer) return

    const ctx = gsap.context(() => {
      const stages = stageRefs.current.filter(Boolean)
      const isDesktop = window.matchMedia('(min-width: 768px)').matches

      if (isDesktop) {
        gsap.set(stages, {
  autoAlpha: 0,
  y: 20,
})

gsap.set(stages[0], {
  autoAlpha: 0,
  y: 30,
})

        const allBgs = bgRefs.current.filter(Boolean)
        gsap.set(allBgs, {
          autoAlpha: 0,
          scale: 1.05,
        })

        const allIcons = iconRefs.current.flat().filter(Boolean)
        gsap.set(allIcons, {
          autoAlpha: 0,
          scale: 0.85,
        })

// --------------------------------------------------
// EARLY PHILOSOPHY ENTRY
// Reveal Location before the section reaches the pin.
// --------------------------------------------------

const firstStage = stages[0]
const firstBg = bgRefs.current[0]
const firstIcons = (iconRefs.current[0] || []).filter(Boolean)

const entryTl = gsap.timeline({
  scrollTrigger: {
  trigger: stageContainer,
  start: 'top 82%',
  toggleActions: 'play none none reverse',
},
})

if (firstBg) {
  entryTl.to(firstBg, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.7,
    ease: 'power2.out',
  })
}

entryTl.to(
  firstStage,
  {
    autoAlpha: 1,
    y: 0,
    duration: 0.65,
    ease: 'power3.out',
  },
  0.08
)

firstIcons.forEach((iconEl, iconIdx) => {
  const iconData = philosophyStages[0].icons[iconIdx]

  const fromProps = iconData?.from || {
    x: 0,
    y: 30,
    rotate: 0,
  }

  entryTl.fromTo(
    iconEl,
    {
      autoAlpha: 0,
      scale: 0.82,
      x: fromProps.x * 0.6,
      y: fromProps.y * 0.6,
      rotate: fromProps.rotate,
    },
    {
      autoAlpha: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.7,
      ease: 'power3.out',
    },
    0.22 + iconIdx * 0.12
  )
})

        // Master Timeline with Overlapping Stages
        const masterTl = gsap.timeline({
          scrollTrigger: {
            id: 'philosophy-pin',
            trigger: stageContainer,
            start: 'top top',
            end: '+=380%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                philosophyStages.length - 1,
                Math.floor(self.progress * philosophyStages.length)
              )
              setActiveStage(index)
            },
          },
        })

        const STAGE_WINDOW = 3.5

        philosophyStages.forEach((stage, index) => {
          const stageElement = stages[index]
          const bgElement = bgRefs.current[index]
          const stageIcons = (iconRefs.current[index] || []).filter(Boolean)

          const start = index * STAGE_WINDOW

          // 1. Background entrance
if (bgElement && index !== 0) {
            masterTl.to(
              bgElement,
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.7,
                ease: 'power2.out',
              },
              start
            )
          }

          // 2. Editorial statement entrance
if (index !== 0) {
  masterTl.to(
    stageElement,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    },
    start + 0.1
  )
}

          // 3. Foreground Icons entrance
          stageIcons.forEach((iconEl, iconIdx) => {
            const iconData = stage.icons[iconIdx]
            const fromProps = iconData ? iconData.from : { x: 0, y: 30, rotate: 0 }
            const delayOffset = start + 0.25 + iconIdx * 0.18

            masterTl.fromTo(
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
                duration: 0.85,
                ease: 'power3.out',
              },
              delayOffset
            )
          })

          // Exit phase for EVERY stage, including the final Value stage.
          // The final stage must have a terminal exit; otherwise it persists
          // through the tail of the pin and can look like a second presentation.
          if (stageElement) {
            const exitStart = start + 2.5

            // Content recedes
            masterTl.to(
              stageElement,
              {
                autoAlpha: 0,
                y: -18,
                duration: 0.9,
                ease: 'power2.inOut',
              },
              exitStart
            )

            // Background recedes
            if (bgElement) {
              masterTl.to(
                bgElement,
                {
                  autoAlpha: 0,
                  scale: 0.96,
                  duration: 0.9,
                  ease: 'power2.inOut',
                },
                exitStart
              )
            }

            // Icons disperse
            stageIcons.forEach((iconEl, iconIdx) => {
              const iconData = stage.icons[iconIdx]
              const fromProps = iconData ? iconData.from : { x: 0, y: 30, rotate: 0 }

              masterTl.to(
                iconEl,
                {
                  autoAlpha: 0,
                  x: fromProps.x * 1.2,
                  y: fromProps.y * 1.2,
                  scale: 0.9,
                  duration: 0.85,
                  ease: 'power2.inOut',
                },
                exitStart + iconIdx * 0.05
              )
            })
          }
        })
      } else {
  // --------------------------------------------------
  // MOBILE — PINNED SCENE TRANSITIONS
  // --------------------------------------------------

  // 1. Initial State Setup
  // Stage 0 (Location) is preloaded fully visible and focused.
  // Stages 1..3 (Vision, Development, Value) start hidden.
  stages.forEach((stageEl, i) => {
    if (i === 0) {
      gsap.set(stageEl, { autoAlpha: 1, y: 0 })
    } else {
      gsap.set(stageEl, { autoAlpha: 0, y: 20 })
    }
  })

  bgRefs.current.forEach((bgEl, i) => {
    if (!bgEl) return
    if (i === 0) {
      gsap.set(bgEl, { autoAlpha: 1, scale: 1 })
    } else {
      gsap.set(bgEl, { autoAlpha: 0, scale: 1.05 })
    }
  })

  iconRefs.current.forEach((stageIconList, stageIdx) => {
    const icons = (stageIconList || []).filter(Boolean)
    icons.forEach((iconEl) => {
      if (stageIdx === 0) {
        gsap.set(iconEl, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotate: 0 })
      } else {
        gsap.set(iconEl, { autoAlpha: 0, scale: 0.85 })
      }
    })
  })

  const mobileTl = gsap.timeline({
    scrollTrigger: {
      id: 'philosophy-pin',
      trigger: stageContainer,
      start: 'top top',
      end: '+=210%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.min(
          philosophyStages.length - 1,
          Math.floor(
            self.progress * philosophyStages.length
          )
        )
        setActiveStage(index)
      },
    },
  })

  const STAGE_WINDOW = 2.4

  philosophyStages.forEach((stage, index) => {
    const stageElement = stages[index]
    const bgElement = bgRefs.current[index]
    const stageIcons = (iconRefs.current[index] || []).filter(Boolean)
    const start = index * STAGE_WINDOW

    // Background Enter (for Vision, Development, Value)
    if (bgElement && index !== 0) {
      mobileTl.to(
        bgElement,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
        },
        start
      )
    }

    // Stage Content Enter (for Vision, Development, Value)
    if (index !== 0) {
      mobileTl.to(
        stageElement,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        start + 0.1
      )
    }

    // Icon Enter (for Vision, Development, Value)
    if (index !== 0) {
      stageIcons.forEach((iconEl, iconIdx) => {
        const iconData = stage.icons[iconIdx]
        const fromProps = iconData
          ? iconData.from
          : { x: 0, y: 30, rotate: 0 }
        const delayOffset = start + 0.25 + iconIdx * 0.18

        mobileTl.fromTo(
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
            duration: 0.85,
            ease: 'power3.out',
          },
          delayOffset
        )
      })
    }

    // Exits for stages 0, 1, 2 (Location, Vision, Development).
    // The final Value (04) stage remains visually active and stable until Philosophy section completes.
    if (stageElement && index < philosophyStages.length - 1) {
      const exitStart = start + 1.8

      // Content exits
      mobileTl.to(
        stageElement,
        {
          autoAlpha: 0,
          y: -18,
          duration: 0.9,
          ease: 'power2.inOut',
        },
        exitStart
      )

      // Background exits
      if (bgElement) {
        mobileTl.to(
          bgElement,
          {
            autoAlpha: 0,
            scale: 0.96,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          exitStart
        )
      }

      // Icons exit
      stageIcons.forEach((iconEl, iconIdx) => {
        const iconData = stage.icons[iconIdx]
        const fromProps = iconData
          ? iconData.from
          : { x: 0, y: 30, rotate: 0 }

        mobileTl.to(
          iconEl,
          {
            autoAlpha: 0,
            x: fromProps.x * 1.2,
            y: fromProps.y * 1.2,
            scale: 0.9,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          exitStart + iconIdx * 0.05
        )
      })
    }
  })
}
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`philosophy-section ${isActive ? 'is-active' : ''}`}
      id="philosophy"
    >
      {/* HEADER */}
      <div className="philosophy-header">
        <span className="philosophy-eyebrow">OUR PHILOSOPHY</span>
        <p className="philosophy-intro">
          A considered approach to identifying opportunity, shaping possibility and
          creating lasting value.
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
              <span className="philosophy-stage-title">{stage.title}</span>
              <h2 className="philosophy-stage-statement">{stage.statement}</h2>
              <p className="philosophy-stage-support">{stage.support}</p>
            </div>
          </article>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="philosophy-progress">
        {philosophyStages.map((stage, index) => (
          <span
            key={stage.id}
            className={`philosophy-progress-item ${
              activeStage === index ? 'is-active' : ''
            }`}
          >
            {stage.number}
          </span>
        ))}
      </div>
    </section>
  )
}