import { useRef } from 'react'
import { introduction } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import introArchitecture from '../assets/introduction-architecture.png'

gsap.registerPlugin(ScrollTrigger)

function Introduction() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Cohesive Choreographed Entrance Timeline
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      })

      // Phase 1: Eyebrow entrance
      entranceTl.from('.intro-eyebrow', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power3.out',
      })

      // Phase 1: Headline lines reveal via vertical overflow mask
      const headlineLines = gsap.utils.toArray('.intro-headline-line')
      entranceTl.from(headlineLines, {
        yPercent: 100,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power4.out',
      }, '-=0.25')

      // Phase 2: Architectural visual frame emerges with choreographed overlap
      entranceTl.from('.intro-architecture-frame', {
        opacity: 0,
        y: 40,
        scale: 0.98,
        clipPath: 'inset(6% 0% 6% 0%)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.45') // Overlaps naturally as headline line 2 settles

     // Phase 3: Subtle editorial architectural push

// The image already enters at its primary presentation scale
gsap.set('.intro-architecture-img', {
  scale: 1.35,
  xPercent: 0,
})

// A long, subtle camera push as the user moves through the section
const focusTl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top 75%',
    end: 'bottom 35%',
    scrub: 1.5,
  },
})

focusTl.to('.intro-architecture-img', {
  scale: 1.44,
  xPercent: -12,
  ease: 'none',
})
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative section-padding-x pt-10 sm:pt-14 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-24 lg:pb-28 bg-ivory overflow-hidden"
    >
      <div className="container-base relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-10 items-start lg:items-center">
          {/* Left Column: Text Statement */}
          <div className="lg:col-span-5 xl:col-span-5 z-10 lg:self-start lg:pt-2">
            {/* Section Label */}
            <p className="intro-eyebrow eyebrow mb-6 sm:mb-8 md:mb-10">
              Introduction
            </p>

            {/* Large Editorial Headline */}
           <div className="intro-statement relative z-10 mb-6 sm:mb-8 lg:mb-0">
              {introduction.statement.map((line, index) => (
                <div key={index} className="overflow-hidden pb-1 md:pb-2">
                  <h2
                    className={`intro-headline-line ${
                      index === 1 ? 'intro-headline-line-2' : ''
                    } display-heading text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl block transform-gpu`}
                  >
                    {line}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Integrated Architectural Visual Layer */}
          <div className="intro-architecture-wrapper lg:col-span-7 xl:col-span-7 w-full flex justify-start lg:justify-end -mt-8 sm:-mt-10 lg:mt-0">
            <div className="intro-architecture-frame relative w-full overflow-visible flex justify-start lg:justify-end items-center transform-gpu">
              <div className="intro-architecture-inner relative w-full flex justify-start lg:justify-end items-center overflow-visible">
                <img
                  src={introArchitecture}
                  alt="Shri Radhika Developers architectural presentation"
                  className="intro-architecture-img w-[140%] max-w-none sm:w-[130%] lg:w-[115%] lg:max-w-none h-auto max-h-[140vh] sm:max-h-[150vh] md:max-h-[160vh] lg:max-h-[82vh] object-contain block origin-left lg:origin-center mix-blend-multiply transform-gpu pointer-events-none -ml-32 sm:-ml-36 lg:ml-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Introduction



