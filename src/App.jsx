import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/layout/Navigation'
import Hero from './sections/Hero'
import Introduction from './sections/Introduction'
import Philosophy from './sections/Philosophy'
import Projects from './sections/Projects'
import PortfolioImpact from './sections/PortfolioImpact'
import Vision from './sections/Vision'
import ClosingCTA from './sections/ClosingCTA'
import Partners from './sections/Partners'
import Enquiry from './sections/Enquiry'
import Footer from './components/layout/Footer'
import { useEditorialScroll } from './hooks/useEditorialScroll'

gsap.registerPlugin(ScrollTrigger)

if (typeof window !== 'undefined') {
  window.ScrollTrigger = ScrollTrigger
  window.gsap = gsap
  window.inspectTriggers = () => {
    return ScrollTrigger.getAll().map(t => ({
      id: t.vars.id || 'anonymous',
      trigger: t.trigger?.className || t.trigger?.id || 'none',
      start: t.start,
      end: t.end,
      progress: typeof t.progress === 'number' ? Number(t.progress.toFixed(3)) : t.progress,
      isActive: t.isActive,
      animationProgress: typeof t.animation?.progress === 'function' ? Number(t.animation.progress().toFixed(3)) : null,
      animationReversed: typeof t.animation?.reversed === 'function' ? t.animation.reversed() : null,
    }))
  }
}

function App() {
  const progressRef = useRef(null)
  const philosophyRef = useRef(null)
  const projectsRef = useRef(null)
  const { activeSection, activePhilosophyIndex, activeProjectIndex } = useEditorialScroll(
    philosophyRef,
    projectsRef,
  )

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !progressRef.current) return

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`
        }
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      {/* Global Scroll Progress */}
      <div ref={progressRef} className="scroll-progress" />

      <Navigation />
      <main>
        <Hero />
        <Introduction />
        <div ref={philosophyRef}>
          <Philosophy
            isActive={activeSection === 'philosophy'}
            activeIndex={activePhilosophyIndex}
          />
        </div>
        <div ref={projectsRef}>
          <Projects
            isActive={activeSection === 'projects'}
            activeIndex={activeProjectIndex}
          />
        </div>
        <Partners />
        <PortfolioImpact />
        <Vision />
        <ClosingCTA />
        <Enquiry />
      </main>
      <Footer />
    </>
  )
}

export default App
