import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { projects } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { getPostPhilosophyStart } from '../utils/animations'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('premiumReveal', '0.22, 1, 0.36, 1')

const INACTIVE_PROJECT_FILTER = 'grayscale(1) brightness(0.85)'
const ACTIVE_PROJECT_FILTER = 'grayscale(0) brightness(1)'

function restoreInactiveProjectMedia(article) {
  const media = article.querySelectorAll('.project-desktop-image-inner .project-image, .project-mobile-image-inner .project-image')
  const wrappers = article.querySelectorAll('.project-image-wrapper, .project-image-inner, .project-media-layer')

  media.forEach((el) => {
    if (el.closest('.project-placeholder-media, .project-gallery-frame')) return
    gsap.killTweensOf(el)
    gsap.set(el, {
      filter: INACTIVE_PROJECT_FILTER,
      opacity: 1,
      mixBlendMode: 'normal',
      boxShadow: 'none',
      backdropFilter: 'none',
    })
  })

  wrappers.forEach((el) => {
    gsap.set(el, {
      mixBlendMode: 'normal',
      boxShadow: 'none',
      backdropFilter: 'none',
      filter: 'none',
    })
  })
}

const TAB_OUT_DURATION = 0.28
const TAB_IN_DURATION = 0.4
const GALLERY_FADE = 0.38

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getProjectArticle(container, projectId) {
  return container?.querySelector(`[data-project-id="${projectId}"]`)
}

function getMediaLayer(article, layer) {
  return article?.querySelector(
    layer === 'desktop'
      ? '.project-desktop-image-inner .project-media-layer'
      : '.project-mobile-image-inner .project-media-layer'
  )
}

function syncProjectMediaFilter(article, isFocused) {
  if (!article) return

  const media = article.querySelectorAll('.project-desktop-image-inner .project-image, .project-mobile-image-inner .project-image')
  media.forEach((el) => {
    if (el.closest('.project-placeholder-media, .project-gallery-frame')) return
    gsap.killTweensOf(el)
    gsap.set(el, {
      filter: isFocused ? ACTIVE_PROJECT_FILTER : INACTIVE_PROJECT_FILTER,
      opacity: 1,
      mixBlendMode: 'normal',
      boxShadow: 'none',
      backdropFilter: 'none',
    })
  })
}

function applyProjectFocusState(container, activeIndex, isActive) {
  if (!container) return

  const articles = Array.from(container.querySelectorAll('.project-article'))
  const isMobile = window.matchMedia('(max-width: 767px)').matches

  articles.forEach((article, index) => {
    const isFocused = isActive && index === activeIndex
    const media = article.querySelectorAll('.project-desktop-image-inner .project-image, .project-mobile-image-inner .project-image')

    if (!isFocused) {
      restoreInactiveProjectMedia(article)
    } else {
      media.forEach((el) => {
        if (el.closest('.project-placeholder-media, .project-gallery-frame')) return

        gsap.killTweensOf(el)

        gsap.set(el, {
          opacity: 1,
          mixBlendMode: 'normal',
          boxShadow: 'none',
          backdropFilter: 'none',
        })

        gsap.to(el, {
          filter: ACTIVE_PROJECT_FILTER,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => {
            gsap.set(el, {
              filter: ACTIVE_PROJECT_FILTER,
              opacity: 1,
              mixBlendMode: 'normal',
              boxShadow: 'none',
              backdropFilter: 'none',
            })
          },
        })
      })
    }

    if (isMobile) {
      gsap.killTweensOf(article)
      gsap.to(article, {
        opacity: isFocused ? 1 : 0.78,
        y: isFocused ? 0 : index < activeIndex ? -10 : 14,
        duration: 0.38,
        ease: 'power3.out',
        overwrite: true,
      })
    }
  })
}

function Projects({ isActive = false, activeIndex = 0 }) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const projectProgressWrapRef = useRef(null)
  const projectProgressLineRef = useRef(null)
  const [activeMedia, setActiveMedia] = useState(
    Object.fromEntries(projects.map(p => [p.id, 0]))
  )
  const [activeMobileView, setActiveMobileView] = useState(
    Object.fromEntries(projects.map(p => [p.id, 'overview']))
  )
  const [activeDesktopView, setActiveDesktopView] = useState(
  Object.fromEntries(projects.map(p => [p.id, 'overview']))
)
  const [mediaTransitioning, setMediaTransitioning] = useState(
    Object.fromEntries(projects.map(p => [p.id, false]))
  )
  const [activeGallery, setActiveGallery] = useState(
    Object.fromEntries(projects.map(p => [p.id, 0]))
  )
  const galleryTouchStartRef = useRef({})
  const previousGalleryRef = useRef({})
  const previousMobileViewRef = useRef(
    Object.fromEntries(projects.map(p => [p.id, 'overview']))
  )
  const galleryTimelineRef = useRef({})
  const pendingLayerEnterRef = useRef({})
  const mediaSwapTweenRef = useRef({})

  useEffect(() => {
    applyProjectFocusState(containerRef.current, activeIndex, isActive)

    const total = Math.max(1, projects.length)
    if (projectProgressLineRef.current) {
      gsap.to(projectProgressLineRef.current, {
        width: `${((activeIndex + 1) / total) * 100}%`,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    if (projectProgressWrapRef.current) {
      gsap.to(projectProgressWrapRef.current, {
        opacity: isActive ? 1 : 0,
        duration: 0.25,
        overwrite: true,
      })
      projectProgressWrapRef.current.style.visibility = isActive ? 'visible' : 'hidden'
    }
  }, [activeIndex, isActive])

  useLayoutEffect(() => {
    Object.entries(pendingLayerEnterRef.current).forEach(([projectId, layer]) => {
      if (!layer) return
      pendingLayerEnterRef.current[projectId] = null

      const article = getProjectArticle(containerRef.current, projectId)
      const el = getMediaLayer(article, layer)
      const isFocused = isActive && projects[activeIndex]?.id === projectId
      syncProjectMediaFilter(article, isFocused)
      const finish = () => {
        if (el) gsap.set(el, { clearProps: 'transform' })
        setMediaTransitioning((prev) => ({ ...prev, [projectId]: false }))
      }

      if (!el || prefersReducedMotion()) {
        if (el) gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' })
        finish()
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: TAB_IN_DURATION,
          ease: 'power2.out',
          overwrite: true,
          onComplete: finish,
        },
      )
    })
}, [
  activeMobileView,
  activeDesktopView,
  activeMedia,
  activeGallery,
  activeIndex,
  isActive,
])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    projects.forEach((project) => {
      const isDesktop =
  window.matchMedia('(min-width: 768px)').matches

const view = isDesktop
  ? activeDesktopView[project.id] || 'overview'
  : activeMobileView[project.id] || 'overview'
      const previousView = previousMobileViewRef.current[project.id]
      const enteredGallery = view === 'gallery' && previousView !== 'gallery'
      previousMobileViewRef.current[project.id] = view

      if (view !== 'gallery') {
        galleryTimelineRef.current[project.id]?.kill()
        return
      }

      const nextIndex = activeGallery[project.id] || 0
      if (!enteredGallery && previousGalleryRef.current[project.id] === nextIndex) return

      const stage = containerRef.current?.querySelector(`[data-gallery-project-id="${project.id}"]`)
      if (!stage) return

      const frames = stage.querySelectorAll('.project-gallery-frame')
      const previousIndex = previousGalleryRef.current[project.id]
      const activeFrame = stage.querySelector(`[data-gallery-index="${nextIndex}"]`)
      const previousFrame = typeof previousIndex === 'number'
        ? stage.querySelector(`[data-gallery-index="${previousIndex}"]`)
        : null

      galleryTimelineRef.current[project.id]?.kill()
      if (!activeFrame) return

      const showActiveOnly = () => {
        gsap.set(frames, { autoAlpha: 0, scale: 1, zIndex: 1 })
        gsap.set(activeFrame, { autoAlpha: 1, scale: 1, zIndex: 2 })
        previousGalleryRef.current[project.id] = nextIndex
      }

      if (enteredGallery || previousIndex === undefined || !previousFrame || previousFrame === activeFrame) {
        showActiveOnly()
        return
      }

      gsap.set(frames, { autoAlpha: 0, scale: 1, zIndex: 1 })
      gsap.set(previousFrame, { autoAlpha: 1, scale: 1, zIndex: 1 })
      gsap.set(activeFrame, { autoAlpha: 0, scale: 1.02, zIndex: 2 })

      galleryTimelineRef.current[project.id] = gsap.timeline({
        defaults: { ease: 'power2.inOut', overwrite: true },
      })
        .to(previousFrame, {
          autoAlpha: 0,
          scale: 0.995,
          duration: GALLERY_FADE,
        }, 0)
        .to(activeFrame, {
          autoAlpha: 1,
          scale: 1,
          duration: GALLERY_FADE + 0.04,
          ease: 'power2.out',
        }, 0.04)

      previousGalleryRef.current[project.id] = nextIndex
    })
  }, [
  activeGallery,
  activeMobileView,
  activeDesktopView,
])

  useEffect(() => {
    return () => {
      Object.values(galleryTimelineRef.current).forEach((timeline) => timeline?.kill())
      Object.values(mediaSwapTweenRef.current).forEach((tween) => tween?.kill())
    }
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()

    const getArticles = () => gsap.utils.toArray('.project-article')

    // ══════════════════════════════════════════════════════════════
    // DESKTOP — Curtain Reveal + Media Selector + Explore Cursor
    // ══════════════════════════════════════════════════════════════
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cleanupFns = []

      // Section intro text — appears first, leading the reveal
      gsap.from('.projects-intro-text', {
        opacity: 0,
        y: 22,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          id: 'projects-intro',
          trigger: '.projects-intro',
          start: getPostPhilosophyStart('top 80%'),
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      })

      const articles = getArticles()
      articles.forEach((article, index) => {
        const imageWrapper = article.querySelector('.project-image-wrapper')
        const image = article.querySelector('.project-desktop-image-inner .project-image')
        const curtain = article.querySelector('.project-curtain')
        const metaEls = article.querySelectorAll('.project-meta')
        const descEl = article.querySelector('.project-desc')
        const numberEl = article.querySelector('.project-chapter-number')
        const mediaNav = article.querySelector('.project-media-nav')

        // Chapter number — rises gently from below, leads the article
        if (numberEl) {
          gsap.from(numberEl, {
            yPercent: 100,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              id: `projects-desktop-number-${index}`,
              trigger: article,
              start: getPostPhilosophyStart('top 85%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        // Curtain wipe + image scale — the primary cinematic moment
        if (curtain && imageWrapper) {
          const curtainTl = gsap.timeline({
            scrollTrigger: {
              id: `projects-desktop-curtain-${index}`,
              trigger: imageWrapper,
              start: getPostPhilosophyStart('top 75%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })

          curtainTl
            .to(curtain, {
              yPercent: -100,
              duration: 1.6,           // slower wipe
              ease: 'power2.inOut',    // controlled, no sharp stop
            })
            .fromTo(image, 
              { scale: 0.96, opacity: 0, y: 12 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'premiumReveal',
              },
              '-=1.2'
            )
        }

        if (image) {
          gsap.set(image, { filter: 'grayscale(1) brightness(0.85)' })
        }

        // Meta labels — follow the image, gentle stagger
        if (metaEls.length) {
          gsap.from(metaEls, {
            opacity: 0,
            y: 14,
            duration: 0.95,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              id: `projects-desktop-meta-${index}`,
              trigger: article,
              start: getPostPhilosophyStart('top 70%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        // Description — settles in last after meta
        if (descEl) {
          gsap.from(descEl, {
            opacity: 0,
            y: 14,
            duration: 1.0,
            ease: 'power2.out',
            scrollTrigger: {
              id: `projects-desktop-desc-${index}`,
              trigger: descEl,
              start: getPostPhilosophyStart('top 88%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        // Media nav — smallest detail, last to arrive
        if (mediaNav) {
          gsap.from(mediaNav, {
            opacity: 0,
            y: 8,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              id: `projects-desktop-nav-${index}`,
              trigger: mediaNav,
              start: getPostPhilosophyStart('top 90%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        if (imageWrapper) {
          const currentDesktopImage = () =>
            article.querySelector('.project-desktop-image-inner .project-image')
          const onEnter = () => {
            const current = currentDesktopImage()
            if (current) gsap.to(current, { scale: 1.04, duration: 0.6, ease: 'power2.out' })
          }
          const onLeave = () => {
            const current = currentDesktopImage()
            if (current) gsap.to(current, { scale: 1, duration: 0.8, ease: 'power2.out' })
          }
          imageWrapper.addEventListener('mouseenter', onEnter)
          imageWrapper.addEventListener('mouseleave', onLeave)
          cleanupFns.push(() => {
            imageWrapper.removeEventListener('mouseenter', onEnter)
            imageWrapper.removeEventListener('mouseleave', onLeave)
          })
        }

        const cursor = cursorRef.current
        if (cursor && imageWrapper) {
          const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
          const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })

          const onCursorEnter = () => {
            gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 })
          }
          const onCursorLeave = () => {
            gsap.to(cursor, { opacity: 0, scale: 0.7, duration: 0.3 })
          }
          const onCursorMove = (e) => {
            xTo(e.clientX + 16)
            yTo(e.clientY + 16)
          }
          imageWrapper.addEventListener('mouseenter', onCursorEnter)
          imageWrapper.addEventListener('mouseleave', onCursorLeave)
          imageWrapper.addEventListener('mousemove', onCursorMove)
          cleanupFns.push(() => {
            imageWrapper.removeEventListener('mouseenter', onCursorEnter)
            imageWrapper.removeEventListener('mouseleave', onCursorLeave)
            imageWrapper.removeEventListener('mousemove', onCursorMove)
          })
        }
      })

      return () => cleanupFns.forEach((cleanup) => cleanup())
    })

    // ══════════════════════════════════════════════════════════════
    // MOBILE — Chapter Transitions + Curtain + Edge-to-Edge
    // ══════════════════════════════════════════════════════════════
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const articles = getArticles()

      articles.forEach((article, index) => {
        gsap.set(article, {
          opacity: index === 0 ? 1 : 0.78,
          y: index === 0 ? 0 : 14,
        })
      })

      articles.forEach((article, index) => {
        const imageWrapper = article.querySelector('.project-image-wrapper')
        const imageInner = article.querySelector('.project-mobile-image-inner')
        const curtain = article.querySelector('.project-curtain')
        const numberEl = article.querySelector('.project-chapter-number')
        const metaEls = article.querySelectorAll('.project-meta')

        // Chapter number — gentle upward reveal
        if (numberEl) {
          gsap.from(numberEl, {
            yPercent: 80,
            opacity: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              id: `projects-mobile-number-${index}`,
              trigger: article,
              start: getPostPhilosophyStart('top 92%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        // Meta — slightly after number, subtle stagger
        if (metaEls.length) {
          gsap.from(metaEls, {
            opacity: 0,
            y: 12,
            duration: 0.9,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
              id: `projects-mobile-meta-${index}`,
              trigger: article,
              start: getPostPhilosophyStart('top 88%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }

        // Curtain wipe — primary cinematic moment on mobile
        if (curtain && imageWrapper) {
          const mobileImage = article.querySelector('.project-mobile-image-inner .project-image')
          const curtainTl = gsap.timeline({
            scrollTrigger: {
              id: `projects-mobile-curtain-${index}`,
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
              duration: 1.5,           // slower, more deliberate wipe
              ease: 'power2.inOut',    // controlled without sharp stop
            }
          )
          
          if (mobileImage) {
            curtainTl.fromTo(mobileImage,
              { scale: 0.96, opacity: 0, y: 12 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'premiumReveal',
              },
              '-=1.1'
            )
          }
        }

        article.querySelectorAll('.project-image').forEach((imageEl) => {
          if (imageEl.closest('.project-placeholder-media, .project-gallery-frame')) return
          gsap.set(imageEl, { filter: 'grayscale(1) brightness(0.85)' })
        })

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
              id: `projects-mobile-edge-${index}`,
              trigger: imageWrapper,
              start: getPostPhilosophyStart('top 76%'),
              end: 'top 20%',
              scrub: 0.85,
              invalidateOnRefresh: true,
            }
          })

          edgeTl.to(imageWrapper, {
            scaleX: getEdgeScale,
            ease: 'none',
          }, 0).to(imageInner, {
            scaleX: () => 1 / getEdgeScale(),
            ease: 'none',
          }, 0)
        }

        // Description — last to settle in
        const descEl = article.querySelector('.project-mobile-desc')
        if (descEl) {
          gsap.from(descEl, {
            opacity: 0,
            y: 14,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              id: `projects-mobile-desc-${index}`,
              trigger: descEl,
              start: getPostPhilosophyStart('top 92%'),
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            }
          })
        }
      })
    })

  }, { scope: containerRef })

  const swapMediaLayer = (projectId, layer, commit) => {
    const article = getProjectArticle(containerRef.current, projectId)
    const el = getMediaLayer(article, layer)

    mediaSwapTweenRef.current[projectId]?.kill()

    const finishSwap = () => {
      pendingLayerEnterRef.current[projectId] = layer
      commit()
    }

    if (!el || prefersReducedMotion()) {
      if (el) gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' })
      finishSwap()
      return
    }

    setMediaTransitioning((prev) => ({ ...prev, [projectId]: true }))
    mediaSwapTweenRef.current[projectId] = gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: TAB_OUT_DURATION,
      ease: 'power2.inOut',
      overwrite: true,
      onComplete: finishSwap,
    })
  }

  const handleMediaChange = (projectId, mediaIndex) => {
    if (activeMedia[projectId] === mediaIndex || mediaTransitioning[projectId]) return
    swapMediaLayer(projectId, 'desktop', () => {
      setActiveMedia((prev) => ({ ...prev, [projectId]: mediaIndex }))
    })
  }

  const handleMobileViewChange = (projectId, view) => {
    if (activeMobileView[projectId] === view || mediaTransitioning[projectId]) return
    swapMediaLayer(projectId, 'mobile', () => {
      setActiveMobileView((prev) => ({ ...prev, [projectId]: view }))
    })
  }
  const handleDesktopViewChange = (projectId, view) => {
  if (
    activeDesktopView[projectId] === view ||
    mediaTransitioning[projectId]
  ) {
    return
  }

  swapMediaLayer(projectId, 'desktop', () => {
    setActiveDesktopView((prev) => ({
      ...prev,
      [projectId]: view,
    }))
  })
}
  const handleGalleryChange = (projectId, total, nextIndex) => {
    const next = (nextIndex + total) % total
    if ((activeGallery[projectId] || 0) === next) return
    setActiveGallery((prev) => ({
      ...prev,
      [projectId]: next,
    }))
  }

  const handleGalleryTouchStart = (projectId, event) => {
    galleryTouchStartRef.current[projectId] = event.touches[0]?.clientX ?? 0
  }

  const handleGalleryTouchEnd = (projectId, total, event) => {
    const startX = galleryTouchStartRef.current[projectId]
    const endX = event.changedTouches[0]?.clientX ?? startX
    const delta = endX - startX
    if (Math.abs(delta) < 36) return
    const currentIndex = activeGallery[projectId] || 0
    handleGalleryChange(projectId, total, currentIndex + (delta < 0 ? 1 : -1))
  }

  // Helper: get active media item for a project
  const getActiveMediaItem = (project) => {
    const idx = activeMedia[project.id] || 0
    if (project.media && project.media.length > 0) {
      return project.media[idx]
    }
    return null
  }

  const getMediaGroupLabel = (item, idx) => {
    if (item.type === 'image') return idx === 0 ? 'Cover' : 'Gallery'
    if (item.type === 'video') return 'Film'
    if (item.type === 'location') return 'Location'
    return item.label
  }

  const getMobileView = (project, view) => {
    const mediaViews = project.mediaViews || {}
    return mediaViews[view] || mediaViews.overview || project.media?.[0] || null
  }

  const getDesktopMediaItem = (project, view, galleryIndex = 0) => {
  const mediaViews = project.mediaViews || {}

  if (view === 'gallery') {
    const gallery = mediaViews.gallery

    if (Array.isArray(gallery) && gallery.length > 0) {
      const index = Math.min(
        galleryIndex,
        gallery.length - 1
      )

      return gallery[index]
    }
  }

  return (
    mediaViews[view] ||
    mediaViews.overview ||
    project.media?.[0] ||
    null
  )
}

  const renderMediaItem = (item, project, className = '') => {
    if (!item) {
      return (
        <div className={`project-image w-full h-full flex items-center justify-center bg-neutral/5 ${className}`}>
          <p className="eyebrow">Project Media</p>
        </div>
      )
    }

    if (item.type === 'video' && item.src) {
      return (
        <video
          src={item.src}
          poster={item.poster}
          className={`project-image project-active-media w-full h-full object-cover origin-center ${className}`}
          autoPlay muted loop playsInline
        />
      )
    }

    if (item.type === 'image' && item.src) {
      return (
        <img
          src={item.src}
          alt={item.alt || project.name}
          className={`project-image project-active-media w-full h-full object-cover origin-center will-change-transform ${className}`}
        />
      )
    }

    return (
      <div className={`project-image w-full h-full flex items-center justify-center bg-neutral/5 ${className}`}>
        <div className="text-center px-8">
          <p className="eyebrow text-neutral/50 mb-2">{item.label}</p>
          <p className="font-body text-xs leading-relaxed text-neutral/45">
            {item.type === 'location'
              ? project.locationMedia?.description || 'Location media coming soon'
              : 'Media coming soon'}
          </p>
        </div>
      </div>
    )
  }

  const renderMobileView = (project, view, galleryIndex = 0) => {
    const content = getMobileView(project, view)

    if (view === 'gallery' && Array.isArray(content)) {
      const activeIndex = Math.min(galleryIndex, content.length - 1)

      return (
        <div
          className="project-gallery-stage"
          data-gallery-project-id={project.id}
          onTouchStart={(event) => handleGalleryTouchStart(project.id, event)}
          onTouchEnd={(event) => handleGalleryTouchEnd(project.id, content.length, event)}
        >
          {content.map((item, index) => (
            <figure
              key={`${item.src}-${index}`}
              className={`project-gallery-frame ${index === activeIndex ? 'active' : ''}`}
              data-gallery-index={index}
            >
              {renderMediaItem(item, project)}
              <figcaption>
                {String(activeIndex + 1).padStart(2, '0')} / {String(content.length).padStart(2, '0')}
              </figcaption>
            </figure>
          ))}
          <div className="project-gallery-controls">
            <button
              type="button"
              onClick={() => handleGalleryChange(project.id, content.length, activeIndex - 1)}
              aria-label="Previous gallery image"
            >
              Prev
            </button>
            <div className="project-gallery-dots" aria-label="Gallery image selection">
              {content.map((item, index) => (
                <button
                  key={`${item.src}-dot`}
                  type="button"
                  onClick={() => handleGalleryChange(project.id, content.length, index)}
                  className={index === activeIndex ? 'active' : ''}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleGalleryChange(project.id, content.length, activeIndex + 1)}
              aria-label="Next gallery image"
            >
              Next
            </button>
          </div>
        </div>
      )
    }

    if (view === 'film') {
      return (
        <div className="project-placeholder-media project-film-placeholder">
          {content?.poster && (
            <img
              src={content.poster}
              alt={`${project.name} film poster`}
              className="project-image"
            />
          )}
          <div className="project-placeholder-overlay">
            <p className="eyebrow text-ivory/70">Project Film</p>
            <span className="project-play-mark" aria-hidden="true" />
            <p className="font-display text-2xl text-ivory">Coming Soon</p>
          </div>
        </div>
      )
    }

    if (view === 'location') {
      return (
        <div className="project-placeholder-media project-location-placeholder">
          {content?.placeholderImage && (
            <img
              src={content.placeholderImage}
              alt={`${project.name} location placeholder`}
              className="project-image"
            />
          )}
          <div className="project-map-grid" aria-hidden="true" />
          <div className="project-placeholder-overlay">
            <p className="eyebrow text-ivory/70">Project Location</p>
            <p className="font-display text-2xl text-ivory">Location Map</p>
            <p className="eyebrow text-ivory/70">{project.location}</p>
            <p className="font-body text-xs leading-relaxed text-ivory/65 max-w-[15rem]">
              {content?.description || 'Map integration coming soon.'}
            </p>
          </div>
        </div>
      )
    }

    return renderMediaItem(content, project)
  }

  const renderDesktopView = (project, view, galleryIndex = 0) => {
  const content = getMobileView(project, view)

  // Overview
  if (view === 'overview') {
    return renderMediaItem(content, project)
  }

  // Gallery
  if (view === 'gallery' && Array.isArray(content)) {
    const activeIndex = Math.min(
      galleryIndex,
      content.length - 1
    )

    return (
      <div
        className="project-gallery-desktop-shell"
        data-gallery-project-id={project.id}
      >
        <div className="project-gallery-desktop-main">
          <div className="project-gallery-desktop-main-media">
            {renderMediaItem(
              content[activeIndex],
              project,
              'project-gallery-desktop-main-image'
            )}
          </div>

          <div className="project-gallery-desktop-bottom-overlay" aria-hidden="true" />

          <div className="project-gallery-desktop-counter">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(content.length).padStart(2, '0')}
          </div>

          <div
            className="project-gallery-desktop-rail"
            aria-label="Project gallery preview list"
          >
            {content.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={() =>
                    handleGalleryChange(
                      project.id,
                      content.length,
                      index
                    )
                  }
                  className={`project-gallery-desktop-preview ${
                    isActive ? 'active' : ''
                  }`}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-pressed={isActive}
                >
                  <span className="project-gallery-desktop-preview-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="project-gallery-desktop-preview-figure">
                    {renderMediaItem(
                      item,
                      project,
                      'project-gallery-desktop-preview-image'
                    )}
                  </span>

                  {isActive && (
                    <span
                      className="project-gallery-desktop-preview-indicator"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Video
  if (view === 'film') {
    return (
      <div className="project-placeholder-media project-film-placeholder">
        {content?.poster && (
          <img
            src={content.poster}
            alt={`${project.name} film poster`}
            className="project-image"
          />
        )}

        <div className="project-placeholder-overlay">
          <p className="eyebrow text-ivory/70">
            Project Film
          </p>

          <span
            className="project-play-mark"
            aria-hidden="true"
          />

          <p className="font-display text-2xl text-ivory">
            Coming Soon
          </p>
        </div>
      </div>
    )
  }

  // Location
  if (view === 'location') {
    return (
      <div className="project-placeholder-media project-location-placeholder">
        {content?.placeholderImage && (
          <img
            src={content.placeholderImage}
            alt={`${project.name} location placeholder`}
            className="project-image"
          />
        )}

        <div
          className="project-map-grid"
          aria-hidden="true"
        />

        <div className="project-placeholder-overlay">
          <p className="eyebrow text-ivory/70">
            Project Location
          </p>

          <p className="font-display text-2xl text-ivory">
            Location Map
          </p>

          <p className="eyebrow text-ivory/70">
            {project.location}
          </p>

          <p className="font-body text-xs leading-relaxed text-ivory/65 max-w-[15rem]">
            {content?.description ||
              'Map integration coming soon.'}
          </p>
        </div>
      </div>
    )
  }

  return renderMediaItem(content, project)
}

  return (
    <>
      {/* Explore Cursor (Desktop Only) */}
      <div ref={cursorRef} className="explore-cursor hidden md:block">
        Explore →
      </div>

      <div
        ref={projectProgressWrapRef}
        className="project-progress md:hidden fixed top-20 right-5 z-40 opacity-0 pointer-events-none bg-ivory/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral/30 shadow-sm flex flex-col items-end gap-1"
        aria-hidden={!isActive}
      >
        <span className="font-mono text-[10px] font-medium tracking-widest text-black/80">
          {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <div className="w-10 h-0.5 bg-neutral/20 relative rounded-full overflow-hidden">
          <div ref={projectProgressLineRef} className="absolute top-0 left-0 h-full bg-black/80 transition-all duration-300" style={{ width: '25%' }} />
        </div>
      </div>

      <section id="projects" ref={containerRef} className="section-padding-x py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-ivory">
        <div className="container-base">

          {/* Section Introduction */}
          <div className="projects-intro mb-10 md:mb-32">
            <p className="projects-intro-text eyebrow mb-4 md:mb-6">
              Portfolio
            </p>
            <h2 className="projects-intro-text display-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Selected<br />Projects.
            </h2>
          </div>

          {/* Project List */}
          <div className="space-y-16 md:space-y-48">
            {projects.map((project, projectIndex) => {
              const activeIdx = activeMedia[project.id] || 0

const desktopView =
  activeDesktopView[project.id] || 'overview'

const mobileView =
  activeMobileView[project.id] || 'overview'

const galleryIndex =
  activeGallery[project.id] || 0


const mediaOptions = [
  ['overview', 'Overview'],
  ['gallery', 'Gallery'],
  ['film', 'Video'],
  ['location', 'Location'],
]

const mobileOptions = mediaOptions

              return (
                <article
                  key={project.id}
                  data-project-id={project.id}
                  className="project-article relative"
                >
                  {/* Chapter Transition Divider */}
                  <div className="mb-6 md:mb-12 flex items-center gap-4">
                    <div className="overflow-hidden">
                      <span className="project-chapter-number font-display text-4xl md:text-7xl font-medium text-black/10 leading-none block">
                        {project.id}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-neutral/20" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-10 relative">

                    {/* Sticky Metadata Column */}
                    <div className="md:col-span-5 md:sticky md:top-32 self-start">
                      {/* Project Number */}
                      <p className="project-meta eyebrow text-neutral mb-3 md:mb-6">
                        {project.id} / {String(projects.length).padStart(2, '0')}
                      </p>

                      {/* Project Name */}
                      <h3 className="project-meta font-display text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-3 md:mb-4 tracking-tight">
                        {project.name}
                      </h3>

                      {/* Details */}
                      <div className="space-y-1 mb-4 md:mb-6">
                        <p className="project-meta font-body text-xs tracking-[0.15em] uppercase text-neutral">
                          {project.category}
                        </p>
                        <p className="project-meta hidden md:block font-body text-xs tracking-[0.15em] uppercase text-neutral">
                          {project.location}
                        </p>
                        <p className="project-meta font-body text-xs tracking-[0.15em] uppercase text-accent font-medium">
                          {project.status}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="project-desc hidden md:block mb-4 md:mb-0">
                        <p className="body-copy max-w-md">
                          {project.description}
                        </p>
                      </div>

                      {/* Media Selector (Desktop) */}
<div className="project-media-nav hidden md:flex flex-wrap gap-4 mt-8 pt-6 border-t border-neutral/20">
  {mediaOptions.map(([view, label], idx) => (
    <button
      key={view}
      type="button"
      onClick={() =>
        handleDesktopViewChange(project.id, view)
      }
      className={`media-selector-item ${
        desktopView === view ? 'active' : ''
      }`}
      disabled={mediaTransitioning[project.id]}
      aria-pressed={desktopView === view}
    >
      <span className="text-neutral/60 mr-1.5">
        0{idx + 1}
      </span>

      {label}
    </button>
  ))}
</div>
                    </div>

                    {/* Project Media Column */}
                    <div className="md:col-span-7 flex flex-col">
                      <div className="project-mobile-switcher md:hidden">
                        <p className="project-switcher-label">Project Media</p>
                        <div
                          className="project-mobile-media-nav"
                          style={{ '--active-tab-index': mobileOptions.findIndex(([view]) => view === mobileView) }}
                        >
                          {mobileOptions.map(([view, label], idx) => (
                            <button
                              key={view}
                              type="button"
                              onClick={() => handleMobileViewChange(project.id, view)}
                              className={mobileView === view ? 'active' : ''}
                              aria-pressed={mobileView === view}
                              disabled={mediaTransitioning[project.id]}
                            >
                              <span>0{idx + 1}</span>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Image/Media Area */}
                      <div className={`project-image-wrapper project-media-${mobileView} aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/2] bg-neutral/10 overflow-hidden relative`}>
                        <div className="project-curtain" />

                        <div className="project-image-inner project-desktop-image-inner absolute inset-0 hidden md:block">
  <div className="project-media-layer h-full">
    {renderDesktopView(
      project,
      desktopView,
      galleryIndex
    )}
  </div>
</div>

                        <div className="project-image-inner project-mobile-image-inner absolute inset-0 md:hidden">
                          <div className="project-media-layer h-full">
                            {renderMobileView(project, mobileView, galleryIndex)}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Description */}
                      <div className="project-mobile-desc md:hidden pt-5">
                        <p className="body-copy">
                          {project.description}
                        </p>
                        <div className="project-mobile-facts">
                          <span>{project.location}</span>
                          <span>{project.status}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </article>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}

export default Projects
