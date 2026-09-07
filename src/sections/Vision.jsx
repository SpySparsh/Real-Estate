import { useRef } from 'react'
import { vision } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'
import { useTranslation } from '../hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('premiumReveal', '0.22, 1, 0.36, 1')

function Vision() {
  const containerRef = useRef(null)
  const { t, tArray } = useTranslation()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // ══════════════════════════════════════════════════════════════
    // DESKTOP — Parallax reframe + masked typography reveal
    // ══════════════════════════════════════════════════════════════
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.from('.vision-eyebrow', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'vision-desktop-eyebrow',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 80%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })

      gsap.utils.toArray('.vision-headline').forEach((line, i) => {
        gsap.from(line, {
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            id: `vision-desktop-headline-${i}`,
            trigger: line.parentElement || line,
            start: getPostPhilosophyStart('top 85%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        })
      })

      const imageInner = containerRef.current?.querySelector('.vision-image-inner')
      if (imageInner) {
        gsap.fromTo(imageInner,
          { scale: 0.96, opacity: 0, y: 12 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'premiumReveal',
            scrollTrigger: {
              id: 'vision-desktop-reveal',
              trigger: '.vision-image',
              start: getPostPhilosophyStart('top 75%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          }
        )
      }

      const imageEl = containerRef.current?.querySelector('.vision-image img')
      if (imageEl) {
        gsap.fromTo(imageEl,
          { scale: 1.15, yPercent: 8 },
          {
            scale: 1,
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              id: 'vision-desktop-parallax',
              trigger: '.vision-image',
              start: getPostPhilosophyStart('top bottom'),
              end: 'bottom top',
              scrub: 1.5,
              invalidateOnRefresh: true,
            }
          }
        )
      }

      gsap.fromTo('.vision-image',
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            id: 'vision-desktop-clip',
            trigger: '.vision-image',
            start: getPostPhilosophyStart('top 80%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        }
      )

      gsap.from('.vision-desc', {
        opacity: 0,
        y: 25,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          id: 'vision-desktop-desc',
          trigger: '.vision-desc',
          start: getPostPhilosophyStart('top 85%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })
    })

    // ══════════════════════════════════════════════════════════════
    // MOBILE — Curtain + Edge-to-Edge + masked text reveal
    // ══════════════════════════════════════════════════════════════
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.from('.vision-eyebrow', {
        opacity: 0,
        y: 15,
        duration: 0.8,
        scrollTrigger: {
          id: 'vision-mobile-eyebrow',
          trigger: containerRef.current,
          start: getPostPhilosophyStart('top 85%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })

      gsap.utils.toArray('.vision-headline').forEach((line, i) => {
        gsap.from(line, {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          delay: i * 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            id: `vision-mobile-headline-${i}`,
            trigger: line.parentElement || line,
            start: getPostPhilosophyStart('top 88%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        })
      })

      const imageEl = containerRef.current?.querySelector('.vision-image img')
      const imageWrapper = containerRef.current?.querySelector('.vision-image')
      const imageInner = containerRef.current?.querySelector('.vision-image-inner')
      const curtain = containerRef.current?.querySelector('.vision-curtain')

      if (imageEl) {
        gsap.fromTo(imageEl,
          { filter: 'grayscale(1) brightness(0.85)' },
          {
            filter: 'grayscale(0) brightness(1)',
            ease: 'none',
            scrollTrigger: {
              id: 'vision-mobile-filter',
              trigger: imageWrapper,
              start: getPostPhilosophyStart('top 75%'),
              end: 'center 50%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        )
      }

      if (imageWrapper && curtain) {
        const curtainTl = gsap.timeline({
          scrollTrigger: {
            id: 'vision-mobile-curtain',
            trigger: imageWrapper,
            start: getPostPhilosophyStart('top 75%'),
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        })

        curtainTl.fromTo(curtain,
          { yPercent: 0 },
          {
            yPercent: -100,
            duration: 1.05,
            ease: 'power3.inOut',
          }
        )
        
        if (imageInner) {
          curtainTl.fromTo(imageInner,
            { scale: 0.96, opacity: 0, y: 12 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'premiumReveal',
            },
            '-=0.75'
          )
        }
      }

      if (imageWrapper && imageInner) {
        const getEdgeScale = () => window.innerWidth / imageWrapper.getBoundingClientRect().width

        gsap.set(imageWrapper, {
          transformOrigin: 'center center',
          willChange: 'transform',
        })
        gsap.set(imageInner, {
          transformOrigin: 'center center',
          willChange: 'transform',
        })

        const edgeTl = gsap.timeline({
          scrollTrigger: {
            id: 'vision-mobile-edge',
            trigger: imageWrapper,
            start: getPostPhilosophyStart('top 76%'),
            end: 'top 32%',
            scrub: 0.85,
            invalidateOnRefresh: true,
          }
        })

        edgeTl.to(imageWrapper, {
          scaleX: getEdgeScale,
          ease: 'none',
        }, 0)
        .to(imageInner, {
          scaleX: () => 1 / getEdgeScale(),
          ease: 'none',
        }, 0)
      }

      gsap.from('.vision-desc', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        scrollTrigger: {
          id: 'vision-mobile-desc',
          trigger: '.vision-desc',
          start: getPostPhilosophyStart('top 90%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        }
      })
    })
  }, { scope: containerRef })

  return (
    <section id="about" ref={containerRef} className="section-padding-x py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-ivory overflow-hidden">
      <div className="container-base">
        <p className="vision-eyebrow eyebrow mb-6 md:mb-16">
          {t('vision.eyebrow')}
        </p>

        <div className="max-w-5xl mb-8 md:mb-20">
          {tArray('vision.headlineLines').map((line, index) => (
            <div key={index} className="vision-headline-wrapper overflow-hidden pb-1 md:pb-2">
              <h2
                className="vision-headline display-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="md:col-span-8">
            <div className="vision-image aspect-[4/5] sm:aspect-[16/12] md:aspect-[16/9] bg-neutral/10 overflow-hidden relative">
              <div className="vision-curtain absolute inset-0 bg-black z-20 pointer-events-none md:hidden" />
              <div className="vision-image-inner absolute inset-0">
                {vision.image ? (
                  <img
                    src={vision.image}
                    alt="Vision"
                    className="w-full h-full object-cover md:grayscale md:hover:grayscale-0 md:transition-all md:duration-1000 origin-center will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="eyebrow">{t('vision.imageFallback')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex items-end">
            <p className="vision-desc body-copy">
              {t('vision.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Vision
