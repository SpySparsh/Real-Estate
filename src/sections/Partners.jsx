import { useState, useRef, useEffect } from 'react'
import { partners } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger)

function Partners({ isActive = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
const [incomingIndex, setIncomingIndex] = useState(null)
const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef(null)
  const currentImageRef = useRef(null)
  const nextImageRef = useRef(null)
  const contentRef = useRef(null)
  const transitionTimeoutRef = useRef(null)
  const autoplayTimerRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const currentPartner = partners[activeIndex]

  // Handle partner navigation
  const handleSelectPartner = (index) => {
    if (index === activeIndex || isTransitioning) return
    transitionToPartner(index)
  }

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? partners.length - 1 : activeIndex - 1
    handleSelectPartner(newIndex)
  }

  const handleNext = () => {
    const newIndex = activeIndex === partners.length - 1 ? 0 : activeIndex + 1
    handleSelectPartner(newIndex)
  }

  const handlePointerDown = (event) => {
    isDraggingRef.current = true
    touchStartX.current = event.clientX || (event.touches && event.touches[0].clientX)
    touchStartY.current = event.clientY || (event.touches && event.touches[0].clientY)
  }

  const handlePointerUp = (event) => {
    isDraggingRef.current = false
    if (isTransitioning) return

    const touchEndX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX)
    const touchEndY = event.clientY || (event.changedTouches && event.changedTouches[0].clientY)
    
    if (touchEndX === undefined || touchStartX.current === undefined) return

    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current

    // Ignore gestures that are primarily vertical.
    if (Math.abs(deltaY) >= Math.abs(deltaX)) return

    const swipeThreshold = 50

    if (Math.abs(deltaX) < swipeThreshold) return

    if (deltaX < 0) {
      handleNext()
    } else {
      handlePrevious()
    }
  }

  const transitionToPartner = (newIndex) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setIncomingIndex(newIndex)

    // Kill any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    const oldImage = currentImageRef.current
    const newImage = nextImageRef.current

    if (!oldImage || !newImage) {
      setActiveIndex(newIndex)
      gsap.set(oldImage, {
        opacity: 1,
        x: 0,
        })

        gsap.set(newImage, {
        opacity: 0,
        x: 0,
        })
      setIsTransitioning(false)
      return
    }

    const content = contentRef.current

    // Animate out current content and image
    gsap.to(oldImage, {
      opacity: 0,
      x: 30,
      duration: 0.75,
      ease: 'power2.inOut',
    })

    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: 'power2.inOut',
      })
    }

    // Animate in new image from left
    gsap.set(newImage, { opacity: 0, x: -30 })
    gsap.to(newImage, {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'power2.inOut',
      delay: 0.1,
    })

    // Set the new active partner
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveIndex(newIndex)

      // Animate in new content after index changes
      if (content) {
        gsap.set(content, { opacity: 0, y: 16 })
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          delay: 0.1,
        })
      }

      // Mark transition as complete
      transitionTimeoutRef.current = setTimeout(() => {
        setIncomingIndex(null)
        setIsTransitioning(false)
      }, 850)
    }, 450)
  }

  // Entrance animation on mount
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from('.partners-section-intro', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'partners-intro',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 80%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.partners-stage', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'partners-stage',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 75%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.partners-nav-container', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'partners-nav',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 70%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      })
    })
  }, { scope: containerRef })

  // Autoplay logic
  const startAutoplay = () => {
    clearTimeout(autoplayTimerRef.current)
    autoplayTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isDraggingRef.current && !isTransitioning) {
        handleNext()
      } else {
        startAutoplay() // Retry
      }
    }, 5000)
  }

  useEffect(() => {
    startAutoplay()
    return () => clearTimeout(autoplayTimerRef.current)
  }, [activeIndex, isTransitioning])

  const handleMouseEnter = () => {
    isHoveredRef.current = true
    clearTimeout(autoplayTimerRef.current)
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false
    startAutoplay()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [])

  return (
    <section
      id="partners"
      ref={containerRef}
      className="section-padding-x bg-ivory relative overflow-hidden"
    >
      {/* Desktop: ~100vh stage */}
      <div className="hidden md:block md:min-h-screen flex flex-col justify-center py-20">
        <div className="container-base">
          {/* Introduction */}
          <div className="partners-section-intro mb-20">
            <p className="eyebrow mb-4">Strategic Partners</p>
            <h2 className="display-heading text-5xl md:text-6xl lg:text-7xl max-w-2xl">
              Trusted by long-term thinkers.
            </h2>
          </div>

          {/* Main presentation stage */}
          <div 
            className="partners-stage grid grid-cols-2 gap-16 items-center select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Left: Partner information */}
            <div ref={contentRef} className="flex flex-col space-y-6">
              {/* Partner counter */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-neutral/80">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(partners.length).padStart(2, '0')}
                </span>
              </div>

              {/* Partner name */}
              <div>
                <h3 className="font-display text-5xl md:text-6xl text-black leading-none tracking-tight mb-3">
                  {currentPartner.name}
                </h3>

                {/* Role */}
                <p className="font-body text-xs md:text-sm tracking-[0.15em] uppercase text-accent font-medium">
                  {currentPartner.role}
                </p>
              </div>

              {/* Focus area */}
              <p className="font-body text-xs tracking-[0.18em] uppercase text-neutral/70">
                {currentPartner.focus}
              </p>

              {/* Description */}
              <p className="body-copy max-w-md text-base md:text-lg leading-relaxed pt-4">
                {currentPartner.description}
              </p>

              {/* Qualities */}
              <ul className="flex flex-wrap gap-2 pt-4">
                {currentPartner.qualities.map((quality) => (
                  <li
                    key={quality}
                    className="rounded-full border border-neutral/30 bg-ivory px-3 py-1.5 text-xs font-medium tracking-[0.12em] uppercase text-black/70"
                  >
                    {quality}
                  </li>
                ))}
              </ul>

              {/* Navigation controls */}
              <div className="flex items-center gap-6 pt-8 border-t border-neutral/20">
                <button
                  onClick={handlePrevious}
                  disabled={isTransitioning}
                  className="cta-link disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous partner"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="cta-link disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next partner"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Right: Partner image stage */}
            <div className="relative h-[600px] rounded-[2rem] overflow-hidden bg-neutral/5 border border-neutral/20 shadow-[0_18px_40px_rgba(23,23,22,0.08)]">
              {/* Current image */}
              <img
                ref={currentImageRef}
                src={currentPartner.image}
                alt={currentPartner.name}
                className="partner-stage-image absolute inset-0 z-10 w-full h-full object-cover object-center"
                />

                <img
                ref={nextImageRef}
                src={
  partners[
    incomingIndex !== null
      ? incomingIndex
      : activeIndex
  ].image
}
                alt=""
                aria-hidden="true"
                className="partner-stage-image-next absolute inset-0 z-0 w-full h-full object-cover object-center opacity-0 pointer-events-none"
                />
            </div>
          </div>

          {/* Partner selector navigation */}
          <div className="partners-nav-container mt-20 flex flex-wrap gap-12 justify-start">
            {partners.map((partner, index) => (
              <button
                key={partner.id}
                onClick={() => handleSelectPartner(index)}
                disabled={isTransitioning}
                className={`flex flex-col gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  index === activeIndex
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
                aria-pressed={index === activeIndex}
                aria-label={`Select ${partner.name}`}
              >
                <span className="font-mono text-xs tracking-[0.18em] uppercase font-bold">
                  {partner.number}
                </span>
                <span className="font-body text-xs tracking-[0.12em] uppercase text-black">
                  {partner.name.split(' ')[0]}
                </span>
                {index === activeIndex && (
                  <span className="w-6 h-px bg-black mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden py-12 sm:py-16">
        <div className="container-base">
          {/* Introduction */}
          <div className="partners-section-intro mb-8">
            <p className="eyebrow mb-3">Strategic Partners</p>
            <h2 className="display-heading text-3xl sm:text-4xl">
              Trusted by long-term thinkers.
            </h2>
          </div>

          {/* Partner counter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs tracking-[0.18em] uppercase text-neutral/80">
              {String(activeIndex + 1).padStart(2, '0')} / {String(partners.length).padStart(2, '0')}
            </span>
          </div>

          {/* Swipeable container for mobile */}
          <div 
            className="mobile-swipe-area select-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Image stage */}
            <div
              className="partners-stage relative w-full h-[300px] sm:h-[360px] rounded-2xl overflow-hidden bg-neutral/5 border border-neutral/20 mb-6 touch-pan-y"
            >
              <img
              ref={currentImageRef}
              src={currentPartner.image}
              alt={currentPartner.name}
              className="partner-stage-image relative z-10 w-full h-full object-cover object-center"
              />

              <img
    ref={nextImageRef}
   src={
    partners[
      incomingIndex !== null
        ? incomingIndex
        : activeIndex
    ].image
  }
    alt=""
    aria-hidden="true"
    className="partner-stage-image-next absolute inset-0 z-0 w-full h-full object-cover object-center opacity-0 pointer-events-none"
  />
            </div>

            {/* Partner content */}
            <div ref={contentRef} className="space-y-4 mb-8">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-black leading-tight mb-2">
                  {currentPartner.name}
                </h3>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-accent font-medium">
                  {currentPartner.role}
                </p>
              </div>

              <p className="font-body text-xs tracking-[0.18em] uppercase text-neutral/70">
                {currentPartner.focus}
              </p>

              <p className="body-copy text-sm leading-relaxed">
                {currentPartner.description}
              </p>

              {/* Qualities */}
              <ul className="flex flex-wrap gap-2 pt-2">
                {currentPartner.qualities.map((quality) => (
                  <li
                    key={quality}
                    className="rounded-full border border-neutral/30 bg-ivory px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] uppercase text-black/70"
                  >
                    {quality}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between gap-4 mb-8 py-4 border-t border-b border-neutral/20">
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className="cta-link disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous partner"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="cta-link disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next partner"
            >
              Next →
            </button>
          </div>

          {/* Partner selector */}
          <div className="partners-nav-container flex flex-wrap gap-4 justify-center">
            {partners.map((partner, index) => (
              <button
                key={partner.id}
                onClick={() => handleSelectPartner(index)}
                disabled={isTransitioning}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral/30 ${
                  index === activeIndex
                    ? 'bg-black text-ivory border-black'
                    : 'bg-transparent hover:bg-neutral/10'
                }`}
                aria-pressed={index === activeIndex}
                aria-label={`Select ${partner.name}`}
              >
                <span className="font-mono text-xs font-bold">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
