import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger globally once
gsap.registerPlugin(ScrollTrigger)

/**
 * Helper to ensure downstream ScrollTriggers never start until after
 * the Philosophy section's pin duration has fully completed.
 * @param {string|number|Function} defaultStart - Default GSAP start position (e.g. 'top 80%')
 * @param {number} buffer - Optional pixel offset after philosophy-pin end (default 20px)
 * @returns {Function} Function returning absolute scrollY position for GSAP ScrollTrigger
 */
export function getPostPhilosophyStart(defaultStart = 'top 80%', buffer = 20) {
  return (self) => {
    const philTrigger = ScrollTrigger.getById('philosophy-pin')

    // If Philosophy is unavailable, let ScrollTrigger use
    // the normal configured start instead of inventing geometry.
    if (
      !philTrigger ||
      typeof philTrigger.start !== 'number' ||
      typeof philTrigger.end !== 'number'
    ) {
      return defaultStart
    }

    const triggerEl = self?.trigger

    if (!(triggerEl instanceof Element)) {
      return defaultStart
    }

    const vh = window.innerHeight
    const scrollY = window.scrollY || window.pageYOffset

    let percent = 0.8

    if (typeof defaultStart === 'string') {
      const match = defaultStart.match(/top\s+(\d+(?:\.\d+)?)%/)

      if (match) {
        percent = Number(match[1]) / 100
      }
    }

    const rect = triggerEl.getBoundingClientRect()

    const baseStart =
      scrollY +
      rect.top -
      vh * percent

    const philosophyPinDistance =
      philTrigger.end - philTrigger.start

    const correctedStart =
      baseStart + philosophyPinDistance

    const minimumStart =
      philTrigger.end + buffer

    const finalStart = Math.max(correctedStart, minimumStart)

    if (typeof window !== 'undefined' && window.__LOG_POST_PHILOSOPHY_START__) {
      console.log(`[getPostPhilosophyStart DIAGNOSTIC] trigger=${self?.vars?.id || 'anon'}, defaultStart="${defaultStart}", baseStart=${baseStart.toFixed(2)}, pinDistance=${philosophyPinDistance.toFixed(2)}, correctedStart=${correctedStart.toFixed(2)}, minimumStart=${minimumStart.toFixed(2)} => finalStart=${finalStart.toFixed(2)}`)
    }

    return finalStart
  }
}

// Global debug capability for inspecting trigger boundaries numerically
if (typeof window !== 'undefined') {
  window.enablePostPhilosophyStartLogging = () => {
    window.__LOG_POST_PHILOSOPHY_START__ = true
    console.log('Post-Philosophy Start logging enabled. Refreshing ScrollTrigger...')
    ScrollTrigger.refresh()
  }

  window.inspectPhilosophyDebug = () => {
    const phil = ScrollTrigger.getById('philosophy-pin')
    const projectsTriggers = ScrollTrigger.getAll().filter(t => t.vars.id?.startsWith('projects-'))
    const projectsFirst = projectsTriggers.sort((a, b) => (a.start || 0) - (b.start || 0))[0]

    const data = {
      philosophyStart: phil?.start ?? null,
      philosophyEnd: phil?.end ?? null,
      philosophyProgress: phil?.progress != null ? Number(phil.progress.toFixed(4)) : null,
      projectsFirstId: projectsFirst?.vars.id ?? null,
      projectsFirstStart: projectsFirst?.start ?? null,
      invariantSatisfied: (projectsFirst?.start != null && phil?.end != null)
        ? projectsFirst.start >= phil.end
        : null,
      gapPixels: (projectsFirst?.start != null && phil?.end != null)
        ? projectsFirst.start - phil.end
        : null,
    }
    console.log('[PHILOSOPHY / PROJECTS BOUNDARY DEBUG]', data)
    return data
  }

  window.inspectProjectsTriggers = () => {
    const philPin = ScrollTrigger.getById('philosophy-pin')
    const philEnd = (philPin && typeof philPin.end === 'number') ? philPin.end : null

    const allTriggers = ScrollTrigger.getAll()
    const projectsTriggers = allTriggers.filter(t => {
      const id = t.vars?.id || ''
      const el = t.trigger
      const className = typeof el?.className === 'string' ? el.className : ''
      const elementId = typeof el?.id === 'string' ? el.id : ''

      if (id.startsWith('projects-') || id.startsWith('impact-')) return true
      if (className.includes('project') || className.includes('impact')) return true
      if (elementId.includes('project') || elementId.includes('impact')) return true

      if (el instanceof Element && (el.closest('#projects') || el.closest('.projects-intro') || el.closest('#partners'))) {
        return true
      }
      return false
    })

    const getPurpose = (t) => {
      const id = t.vars?.id || ''
      if (id === 'projects-intro') return 'Desktop Projects section intro text entrance'
      if (id === 'impact-eyebrow') return 'Portfolio Impact section eyebrow reveal'
      if (id === 'impact-top-divider') return 'Portfolio Impact section divider line wipe'

      const desktopNum = id.match(/^projects-desktop-number-(\d+)$/)
      if (desktopNum) return `Desktop Project #${Number(desktopNum[1]) + 1} chapter number reveal`

      const desktopCurtain = id.match(/^projects-desktop-curtain-(\d+)$/)
      if (desktopCurtain) return `Desktop Project #${Number(desktopCurtain[1]) + 1} image curtain roll-up & scale`

      const desktopMeta = id.match(/^projects-desktop-meta-(\d+)$/)
      if (desktopMeta) return `Desktop Project #${Number(desktopMeta[1]) + 1} metadata reveal`

      const desktopDesc = id.match(/^projects-desktop-desc-(\d+)$/)
      if (desktopDesc) return `Desktop Project #${Number(desktopDesc[1]) + 1} description reveal`

      const desktopNav = id.match(/^projects-desktop-nav-(\d+)$/)
      if (desktopNav) return `Desktop Project #${Number(desktopNav[1]) + 1} media selector nav reveal`

      const mobileNum = id.match(/^projects-mobile-number-(\d+)$/)
      if (mobileNum) return `Mobile Project #${Number(mobileNum[1]) + 1} chapter number reveal`

      const mobileMeta = id.match(/^projects-mobile-meta-(\d+)$/)
      if (mobileMeta) return `Mobile Project #${Number(mobileMeta[1]) + 1} metadata reveal`

      const mobileCurtain = id.match(/^projects-mobile-curtain-(\d+)$/)
      if (mobileCurtain) return `Mobile Project #${Number(mobileCurtain[1]) + 1} image curtain wipe`

      const mobileEdge = id.match(/^projects-mobile-edge-(\d+)$/)
      if (mobileEdge) return `Mobile Project #${Number(mobileEdge[1]) + 1} scrubbed edge-to-edge image expansion`

      const mobileDesc = id.match(/^projects-mobile-desc-(\d+)$/)
      if (mobileDesc) return `Mobile Project #${Number(mobileDesc[1]) + 1} description reveal`

      const statEntry = id.match(/^impact-stat-entry-(\d+)$/)
      if (statEntry) return `Portfolio Impact Stat #${Number(statEntry[1]) + 1} entry reveal`

      const statCounter = id.match(/^impact-stat-counter-(\d+)$/)
      if (statCounter) return `Portfolio Impact Stat #${Number(statCounter[1]) + 1} count-up counter`

      const className = typeof t.trigger?.className === 'string' ? t.trigger.className : ''
      if (className.includes('impact-stat')) return 'Portfolio Impact stat focus emphasis'
      if (className.includes('project')) return 'Project section visual reveal'

      return 'Projects / Portfolio animation'
    }

    const reported = projectsTriggers.map((t, index) => {
      const id = t.vars?.id || `anonymous-projects-${index}`
      const triggerEl = t.trigger
        ? (t.trigger.id ? `#${t.trigger.id}` : `.${(t.trigger.className || '').toString().trim().replace(/\s+/g, '.')}`)
        : 'none'
      const start = Math.round(t.start || 0)
      const end = Math.round(t.end || 0)
      const progress = typeof t.progress === 'number' ? Number(t.progress.toFixed(3)) : 0
      const isActive = !!t.isActive
      const startsBeforePhilosophyEnd = philEnd !== null ? start < philEnd : false

      return {
        id,
        purpose: getPurpose(t),
        triggerElement: triggerEl,
        resolvedStart: start,
        resolvedEnd: end,
        currentProgress: progress,
        isActive,
        startsBeforePhilosophyEnd,
        overlapPixelsWithPhilosophyEnd: startsBeforePhilosophyEnd && philEnd !== null ? Math.round(philEnd - start) : 0,
      }
    }).sort((a, b) => a.resolvedStart - b.resolvedStart)

    console.log('[PROJECTS / PORTFOLIO SCROLLTRIGGERS (SORTED BY START)]', reported)
    return reported
  }

  window.inspectBoundaryOverlap = () => {
    const philPin = ScrollTrigger.getById('philosophy-pin')
    const philStart = philPin ? Math.round(philPin.start) : null
    const philEnd = philPin ? Math.round(philPin.end) : null
    const philProgress = philPin ? Number((philPin.progress || 0).toFixed(4)) : null

    const projectsTriggers = window.inspectProjectsTriggers()
    const earliestTrigger = projectsTriggers[0] || null
    const triggersBeforePhilosophyEnd = projectsTriggers.filter(t => t.startsBeforePhilosophyEnd)

    const nonScrollTriggerAnimations = [
      {
        name: "useEditorialScroll Section Activation (activeSection = 'projects')",
        triggerCondition: "philProgress >= 0.92 OR (projectsRect.top < 0.9*vh AND !philosophyIsPinned)",
        visualEffect: "Sets activeSection to 'projects' while Philosophy master pin is still running (progress 0.92 to 1.0).",
        canOccurBeforePhilosophyEnd: true,
        details: "Triggers React re-render passing isActive=true to Projects.jsx before Philosophy pin ends."
      },
      {
        name: "applyProjectFocusState Media Filter Transition (Projects.jsx)",
        triggerCondition: "Fires in useEffect when activeSection becomes 'projects'",
        visualEffect: "Animates project images from grayscale(1) brightness(0.85) to grayscale(0) brightness(1) over 0.55s.",
        canOccurBeforePhilosophyEnd: true,
        details: "Directly causes visible grayscale-to-color transition on project cover image while Philosophy section is still visually active."
      },
      {
        name: "applyProjectFocusState Mobile Article Position & Opacity Transition (Projects.jsx)",
        triggerCondition: "Fires in useEffect when activeSection becomes 'projects' on mobile",
        visualEffect: "Animates project articles opacity (0.78 -> 1) and y position (14 -> 0) over 0.38s.",
        canOccurBeforePhilosophyEnd: true,
        details: "Causes visible movement and opacity changes on mobile Projects section before Philosophy pin completes."
      },
      {
        name: "Project Progress Indicator Fade-In (Projects.jsx)",
        triggerCondition: "Fires in useEffect when activeSection becomes 'projects'",
        visualEffect: "Fades in the bottom-right project progress indicator (opacity: 0 -> 1 over 0.25s).",
        canOccurBeforePhilosophyEnd: true,
        details: "Makes the project progress bar visible prematurely."
      }
    ]

    const earliestScrollTriggerStart = earliestTrigger ? earliestTrigger.resolvedStart : null
    const isScrollTriggerEarly = earliestScrollTriggerStart !== null && philEnd !== null && earliestScrollTriggerStart < philEnd

    const analysis = {
      philosophyPin: {
        id: 'philosophy-pin',
        resolvedStart: philStart,
        resolvedEnd: philEnd,
        currentProgress: philProgress,
        isActive: philPin ? philPin.isActive : false,
      },
      earliestProjectsScrollTrigger: earliestTrigger ? {
        id: earliestTrigger.id,
        purpose: earliestTrigger.purpose,
        resolvedStart: earliestTrigger.resolvedStart,
        gapPixelsFromPhilosophyEnd: philEnd !== null ? earliestTrigger.resolvedStart - philEnd : null,
        startsBeforePhilosophyEnd: earliestTrigger.startsBeforePhilosophyEnd,
      } : null,
      triggersStartingBeforePhilosophyEnd: triggersBeforePhilosophyEnd,
      nonScrollTriggerAnimations,
      earliestVisualAnimation: {
        name: "useEditorialScroll philProgress threshold (0.92) & applyProjectFocusState filter transition",
        type: "State/Scroll-Observer (Non-ScrollTrigger)",
        triggerPoint: "Philosophy Pin Progress ~92% (approx. " + (philStart !== null && philEnd !== null ? Math.round(philStart + (philEnd - philStart) * 0.92) : "before end") + "px scrollY)",
        isBeforePhilosophyEnd: true,
      },
      mostLikelyCauseOfEarlyTransition: "useEditorialScroll activates activeSection = 'projects' when philProgress >= 0.92 (before philosophy-pin completes at 1.0). This triggers applyProjectFocusState in Projects.jsx, which immediately starts a 0.55s GSAP transition animating project image grayscale filter to full color while Philosophy Stage 4 is still pinned and visually active."
    }

    console.log('[PHILOSOPHY / PROJECTS BOUNDARY DIAGNOSTIC OVERLAP REPORT]', analysis)
    return analysis
  }

  // Real-time Mutation / Style Watcher to detect early visual changes
  window.__FIRST_PROJECTS_VISUAL_CHANGE__ = null
  window.__PROJECTS_MUTATIONS_LOG__ = []

  const PROPS_TO_WATCH = [
    'opacity',
    'transform',
    'filter',
    'clipPath',
    'visibility',
    'display',
    'backgroundColor',
    'height',
    'width',
    'position',
    'zIndex',
  ]

  const getElementIdentifier = (el) => {
    if (!el) return 'none'
    if (el.id) return `#${el.id}`
    const tag = el.tagName ? el.tagName.toLowerCase() : ''
    const cls = typeof el.className === 'string' ? el.className.trim().replace(/\s+/g, '.') : ''
    return cls ? `${tag}.${cls}` : tag
  }

  const captureElementBaseline = (el) => {
    if (!el || !(el instanceof Element)) return null
    const computed = window.getComputedStyle(el)
    const baseline = {}
    PROPS_TO_WATCH.forEach(prop => {
      baseline[prop] = computed[prop] || el.style[prop] || ''
    })
    baseline.className = el.className || ''
    baseline.dataset = { ...el.dataset }
    baseline.rectTop = el.getBoundingClientRect().top
    return baseline
  }

  let elementBaselines = new Map()
  let isWatching = false

  const startVisualWatcher = () => {
    if (isWatching || typeof window === 'undefined') return
    isWatching = true

    const queryTargetElements = () => {
      const targets = [
        ...document.querySelectorAll('#philosophy, .philosophy-section, [data-stage], .principle-item'),
        ...document.querySelectorAll('#projects, .projects-intro, .projects-intro-text, .project-article, .project-image-wrapper, .project-image-inner, .project-image, .project-curtain, .project-meta, .project-desc, .project-chapter-number, .project-media-nav, .project-mobile-desc'),
        ...document.querySelectorAll('.pin-spacer, #partners, #portfolio-impact, header nav')
      ]
      return Array.from(new Set(targets))
    }

    queryTargetElements().forEach(el => {
      elementBaselines.set(el, captureElementBaseline(el))
    })

    const checkVisualChanges = () => {
      const philPin = ScrollTrigger.getById('philosophy-pin')
      const philEnd = (philPin && typeof philPin.end === 'number') ? philPin.end : null
      const currentScrollY = window.scrollY || window.pageYOffset

      if (philEnd !== null && currentScrollY < philEnd) {
        const targets = queryTargetElements()
        targets.forEach(el => {
          if (!elementBaselines.has(el)) {
            elementBaselines.set(el, captureElementBaseline(el))
            return
          }

          const base = elementBaselines.get(el)
          if (!base) return

          const computed = window.getComputedStyle(el)
          const isProjectsOrPartnerOrImpact = el.closest('#projects') || el.closest('#partners') || el.closest('#portfolio-impact') || (typeof el.className === 'string' && (el.className.includes('project') || el.className.includes('impact')))

          PROPS_TO_WATCH.forEach(prop => {
            const currentVal = computed[prop] || el.style[prop] || ''
            const baseVal = base[prop]

            if (baseVal && currentVal !== baseVal) {
              if (prop === 'position' || prop === 'zIndex' || prop === 'display' || prop === 'visibility' || prop === 'opacity' || prop === 'transform' || prop === 'filter' || prop === 'clipPath' || prop === 'backgroundColor') {
                const changeRecord = {
                  timestamp: performance.now(),
                  scrollY: Math.round(currentScrollY),
                  philosophyPinEnd: Math.round(philEnd),
                  element: getElementIdentifier(el),
                  property: prop,
                  oldValue: baseVal,
                  newValue: currentVal,
                  owner: el.closest('#projects') ? 'Projects Component / Layout / GSAP' : (el.closest('#portfolio-impact') ? 'PortfolioImpact Component' : 'DOM / CSS / GSAP'),
                  domElement: el,
                }

                if (!window.__FIRST_PROJECTS_VISUAL_CHANGE__ && isProjectsOrPartnerOrImpact) {
                  window.__FIRST_PROJECTS_VISUAL_CHANGE__ = changeRecord
                  console.warn(`[FIRST PROJECTS VISUAL CHANGE DETECTED]`, changeRecord)
                }

                if (isProjectsOrPartnerOrImpact) {
                  window.__PROJECTS_MUTATIONS_LOG__.push(changeRecord)
                }
              }
            }
          })
        })
      }

      window.requestAnimationFrame(checkVisualChanges)
    }

    window.requestAnimationFrame(checkVisualChanges)
  }

  // Auto-start watcher on load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(startVisualWatcher, 500)
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(startVisualWatcher, 500))
  }

  window.inspectEarlyTransition = () => {
    startVisualWatcher()
    const philPin = ScrollTrigger.getById('philosophy-pin')
    const philStart = philPin ? Math.round(philPin.start) : null
    const philEnd = philPin ? Math.round(philPin.end) : null
    const currentScrollY = Math.round(window.scrollY || window.pageYOffset)

    const allTweens = gsap.globalTimeline.getChildren(true, true, true)
    const activeTweens = allTweens.filter(t => t.isActive()).map(t => ({
      duration: t.duration(),
      progress: Number(t.progress().toFixed(3)),
      targets: Array.isArray(t.targets()) ? t.targets().map(getElementIdentifier) : getElementIdentifier(t.targets()),
      vars: t.vars,
    }))

    const first = window.__FIRST_PROJECTS_VISUAL_CHANGE__

    const formattedReport = first
      ? `FIRST PROJECTS VISUAL CHANGE DETECTED:
scrollY: ${first.scrollY}
philosophyPinEnd: ${first.philosophyPinEnd}
element: ${first.element}
property: ${first.property}
oldValue: ${first.oldValue}
newValue: ${first.newValue}
owner: ${first.owner}`
      : `FIRST PROJECTS VISUAL CHANGE DETECTED: None detected yet at current scrollY (${currentScrollY}px vs philosophyPinEnd: ${philEnd}px). Scroll down through Philosophy to catch runtime change.`

    const nonScrollTriggerAnimations = [
      {
        name: "useEditorialScroll Section Activation (activeSection)",
        status: "Gated (Now activates strictly after philosophy-pin.end)",
      },
      {
        name: "Projects Container / Pin-Spacer Viewport Intersection",
        status: "Checking if Projects section overlaps into bottom viewport while Philosophy is pinned at 100vh",
      },
      {
        name: "Introduction / Philosophy Entry GSAP Timelines",
        status: "Checking for un-gated scrollTriggers or CSS transforms",
      },
      {
        name: "CSS Hover / Grayscale / Transition Rules",
        status: "Checking CSS rules applied to .project-image or .projects-intro",
      }
    ]

    const result = {
      philosophyPin: {
        id: 'philosophy-pin',
        resolvedStart: philStart,
        resolvedEnd: philEnd,
        currentScrollY,
        isActive: philPin ? philPin.isActive : false,
      },
      nonScrollTriggerAnimations,
      activeGSAPTweens: activeTweens,
      firstProjectsVisualChange: first,
      formattedReportSummary: formattedReport,
      allRecordedMutations: window.__PROJECTS_MUTATIONS_LOG__ || [],
    }

    console.log(formattedReport)
    console.log('[FULL EARLY TRANSITION INSPECTION OBJECT]', result)
    return result
  }

  window.inspectPhilosophyProjectsGeometry = () => {
    const philPin = ScrollTrigger.getById('philosophy-pin')
    const philStart = philPin ? Math.round(philPin.start) : null
    const philEnd = philPin ? Math.round(philPin.end) : null
    const currentScrollY = Math.round(window.scrollY || window.pageYOffset)
    const vh = window.innerHeight

    const projEl = document.querySelector('#projects') || document.querySelector('.portfolio-section')
    const projRect = projEl ? projEl.getBoundingClientRect() : null
    const projRectTop = projRect ? Math.round(projRect.top) : null

    const isPhilosophyPinned = philPin
      ? (philPin.isActive || (philEnd !== null && currentScrollY < philEnd - 2))
      : false
    const isProjectsVisibleInViewport = projRectTop !== null ? projRectTop < vh : false
    const invariantSatisfied = (philEnd !== null && currentScrollY < philEnd - 2)
      ? (projRectTop !== null && projRectTop >= vh - 2)
      : true

    const report = {
      currentScrollY,
      philosophyPinStart: philStart,
      philosophyPinEnd: philEnd,
      projectsRectTop: projRectTop,
      windowHeight: vh,
      isPhilosophyPinned,
      isProjectsVisibleInViewport,
      invariantSatisfied,
    }

    console.log('[PHILOSOPHY / PROJECTS GEOMETRY REPORT]', report)
    return report
  }

  // Specialized DOM MutationObserver and GSAP tracker for article.project-article
  window.__LAST_ARTICLE_MUTATION__ = null
  window.__ALL_ARTICLE_MUTATIONS__ = []

  const observeProjectArticles = () => {
    if (typeof window === 'undefined') return
    const articles = document.querySelectorAll('.project-article')
    if (!articles.length) return

    articles.forEach((article, idx) => {
      let prevOpacity = window.getComputedStyle(article).opacity
      let prevStyle = article.getAttribute('style') || ''
      let prevClass = article.className || ''

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const currentOpacity = window.getComputedStyle(article).opacity
          const currentStyle = article.getAttribute('style') || ''
          const currentClass = article.className || ''
          const currentScrollY = Math.round(window.scrollY || window.pageYOffset)
          const philPin = ScrollTrigger.getById('philosophy-pin')
          const philEnd = philPin ? Math.round(philPin.end) : null

          if (currentOpacity !== prevOpacity || currentStyle !== prevStyle || currentClass !== prevClass) {
            const tweens = gsap.getTweensOf(article)
            const activeTween = tweens.find(t => t.isActive())
            const lastTween = tweens[tweens.length - 1]

            const isInitialization = currentScrollY < 50 || performance.now() < 2500

            const record = {
              timestamp: performance.now(),
              index: idx,
              element: `article.project-article.relative[data-project-id="${article.dataset.projectId || idx}"]`,
              oldOpacity: prevOpacity,
              newOpacity: currentOpacity,
              oldStyle: prevStyle,
              newStyle: currentStyle,
              scrollY: currentScrollY,
              philosophyPinEnd: philEnd,
              mechanism: activeTween ? 'GSAP Tween (Active)' : (lastTween ? 'GSAP set/to (Completed)' : 'CSS / React State'),
              sourceFile: 'src/sections/Projects.jsx',
              sourceLine: isInitialization ? 'Lines 488–491 (useGSAP setup: gsap.set) / Lines 119–128 (applyProjectFocusState)' : 'Lines 119–128 (applyProjectFocusState on scroll state change)',
              animationType: activeTween ? 'gsap.to / gsap.from' : 'gsap.set',
              triggerStatus: isInitialization ? 'initialization' : (philPin && philPin.isActive ? 'active (during philosophy pin)' : 'inactive'),
              activeTweens: tweens.map(t => ({
                isActive: t.isActive(),
                progress: Number(t.progress().toFixed(3)),
                vars: t.vars,
                triggerId: t.scrollTrigger?.vars?.id || 'none'
              }))
            }

            window.__LAST_ARTICLE_MUTATION__ = record
            window.__ALL_ARTICLE_MUTATIONS__.push(record)

            prevOpacity = currentOpacity
            prevStyle = currentStyle
            prevClass = currentClass
          }
        })
      })

      observer.observe(article, { attributes: true, attributeFilter: ['style', 'class'] })
    })
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(observeProjectArticles, 400)
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(observeProjectArticles, 400))
  }

  window.inspectProjectArticleOpacity = () => {
    observeProjectArticles()
    const philPin = ScrollTrigger.getById('philosophy-pin')
    const philStart = philPin ? Math.round(philPin.start) : null
    const philEnd = philPin ? Math.round(philPin.end) : null
    const currentScrollY = Math.round(window.scrollY || window.pageYOffset)

    const articles = Array.from(document.querySelectorAll('.project-article'))
    const articleReports = articles.map((article, idx) => {
      const computedOpacity = window.getComputedStyle(article).opacity
      const inlineOpacity = article.style.opacity || 'none'
      const tweens = gsap.getTweensOf(article)

      return {
        index: idx,
        id: article.dataset.projectId || `project-${idx}`,
        className: article.className,
        computedOpacity,
        inlineOpacity,
        activeGSAPTweens: tweens.map(t => ({
          isActive: t.isActive(),
          progress: Number(t.progress().toFixed(3)),
          vars: t.vars,
          scrollTriggerId: t.scrollTrigger?.vars?.id || 'none',
        })),
      }
    })

    const lastMut = window.__LAST_ARTICLE_MUTATION__

    const formattedReport = `PROJECT ARTICLE OPACITY OWNER:
element: article.project-article.relative
oldOpacity: ${lastMut ? lastMut.oldOpacity : '1'}
newOpacity: ${lastMut ? lastMut.newOpacity : (articleReports[0]?.computedOpacity || '1')}
scrollY: ${lastMut ? lastMut.scrollY : currentScrollY}
mechanism: ${lastMut ? lastMut.mechanism : 'GSAP setup (gsap.set)'}
source file: src/sections/Projects.jsx
source line: ${lastMut ? lastMut.sourceLine : 'Lines 488-491 (useGSAP initial setup) & Lines 119-128 (applyProjectFocusState)'}
animation type: ${lastMut ? lastMut.animationType : 'set'}
trigger status: ${lastMut ? lastMut.triggerStatus : 'initialization'}`

    const summary = {
      currentScrollY,
      philosophyPin: { start: philStart, end: philEnd, isActive: philPin ? philPin.isActive : false },
      articles: articleReports,
      lastMutation: lastMut,
      allMutations: window.__ALL_ARTICLE_MUTATIONS__,
      formattedReport,
    }

    console.log(formattedReport)
    console.log('[PROJECT ARTICLE OPACITY DIAGNOSTIC OBJECT]', summary)
    return summary
  }
  
  window.tracePrematureTransition = () => {
    if (typeof window === 'undefined') return
    console.log('Starting refined tracePrematureTransition... Please scroll down into the Philosophy section.')

    const getTargets = () => {
      const targets = [
        ...document.querySelectorAll('#projects, .projects-intro, .projects-intro-text, .project-article, .project-image-wrapper, .project-image-inner, .project-image, .project-curtain, .project-meta, .project-desc, .project-chapter-number, .project-media-nav, .project-mobile-desc'),
        ...document.querySelectorAll('#about, .vision-eyebrow, .vision-headline, .vision-image, .vision-image-inner, .vision-curtain, .vision-desc'),
        ...document.querySelectorAll('#enquiry, .enquiry-content'),
        ...document.querySelectorAll('#cta, .closing-cta, .closing-cta-content'),
        ...document.querySelectorAll('#partners, #portfolio-impact')
      ]
      return Array.from(new Set(targets))
    }

    const captureState = (el) => {
      const computed = window.getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return {
        opacity: computed.opacity,
        transform: computed.transform,
        filter: computed.filter,
        clipPath: computed.clipPath,
        visibility: computed.visibility,
        display: computed.display,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height
        }
      }
    }

    const formatRect = (r) => `{ top: ${Math.round(r.top)}, bottom: ${Math.round(r.bottom)}, width: ${Math.round(r.width)}, height: ${Math.round(r.height)} }`

    const targets = getTargets()
    const baseline = new Map()
    
    targets.forEach(el => {
      baseline.set(el, captureState(el))
    })

    let frameId;
    const checkFrame = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const vh = window.innerHeight
      const philPin = ScrollTrigger.getById('philosophy-pin')
      const philStart = philPin ? philPin.start : null
      const philEnd = philPin ? philPin.end : null
      const philProgress = philPin ? philPin.progress : null
      const philActive = philPin ? philPin.isActive : false

      // Wait until we are genuinely inside the Philosophy pinned experience
      if (philStart !== null && philEnd !== null && scrollY >= philStart && scrollY < philEnd) {
        for (let i = 0; i < targets.length; i++) {
          const el = targets[i]
          const base = baseline.get(el)
          if (!base) continue

          const current = captureState(el)
          let eventType = null
          let changedProp = null
          let beforeVal = null
          let afterVal = null

          const props = ['opacity', 'transform', 'filter', 'clipPath', 'visibility', 'display']
          for (const prop of props) {
            if (current[prop] !== base[prop]) {
              eventType = 'Visual property change'
              changedProp = prop
              beforeVal = base[prop]
              afterVal = current[prop]
              break
            }
          }

          if (!eventType) {
            const wasOutsideBelow = base.rect.top >= vh
            const isInsideViewport = current.rect.top < vh
            
            if (wasOutsideBelow && isInsideViewport) {
              eventType = 'Viewport event'
              changedProp = 'Element entered viewport from below'
              beforeVal = `rect.top: ${Math.round(base.rect.top)}`
              afterVal = `rect.top: ${Math.round(current.rect.top)} (viewportHeight: ${vh})`
            }
          }

          if (eventType) {
            const activeSection = document.documentElement.dataset.editorial?.split(':')[0] || 'unknown'
            
            console.log(`========== FIRST PREMATURE VISUAL CHANGE ==========
scrollY: ${scrollY}

Philosophy:
start: ${philStart}
end: ${philEnd}
progress: ${philProgress}
isActive: ${philActive}

Element:
selector / element description: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ').join('.') : ''}
section: ${el.closest('section')?.id || 'unknown'}

Event Type: ${eventType}
Changed property / event: ${changedProp}
before:
${beforeVal}
after:
${afterVal}

Computed visual state before:
opacity: ${base.opacity}, transform: ${base.transform}, filter: ${base.filter}, clipPath: ${base.clipPath}
Computed visual state after:
opacity: ${current.opacity}, transform: ${current.transform}, filter: ${current.filter}, clipPath: ${current.clipPath}

Geometry before: ${formatRect(base.rect)}
Geometry after: ${formatRect(current.rect)}

Current activeSection: ${activeSection}
===================================================`)
            return // Stop tracing
          } else {
            // Update baseline geometry so we detect crossing correctly on subsequent frames
            base.rect = current.rect
          }
        }
        frameId = window.requestAnimationFrame(checkFrame)
      } else if (philEnd === null || scrollY < philStart) {
         // Keep tracing until Philosophy pin is registered or we reach the pinned area
         for (let i = 0; i < targets.length; i++) {
            const el = targets[i]
            const base = baseline.get(el)
            if (base) {
                // Update baseline silently while outside the target window so we don't trigger falsely
                base.rect = captureState(el).rect
            }
         }
         frameId = window.requestAnimationFrame(checkFrame)
      } else if (scrollY >= philEnd) {
         // Stop tracing if we successfully cleared Philosophy without premature changes
         console.log('Philosophy section completed without premature changes.')
      } else {
         // Continue loop just in case
         frameId = window.requestAnimationFrame(checkFrame)
      }
    }
    
    frameId = window.requestAnimationFrame(checkFrame)
  }
  
  window.inspectPhilosophyGeometry = () => {
    if (typeof window === 'undefined') return

    const philPin = ScrollTrigger.getById('philosophy-pin')
    if (!philPin) {
      console.log('Philosophy ScrollTrigger not found. Ensure it has initialized.')
      return
    }

    const philosophy = document.getElementById('philosophy')
    const trigger = philPin.trigger
    const pinSpacer = trigger.closest('.pin-spacer') || trigger.parentNode
    const projects = document.getElementById('projects')
    
    const ancestors = []
    let curr = trigger.parentElement
    while (curr && curr !== philosophy && curr !== document.body) {
      ancestors.push(curr)
      curr = curr.parentElement
    }

    const nextSibling = pinSpacer ? pinSpacer.nextElementSibling : null

    const captureState = (el) => {
      if (!el) return null
      const computed = window.getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      
      const getSelector = (e) => {
        if (!e) return 'null'
        let sel = e.tagName.toLowerCase()
        if (e.id) sel += '#' + e.id
        if (e.className && typeof e.className === 'string') sel += '.' + e.className.split(' ').join('.')
        return sel
      }

      return {
        selector: getSelector(el),
        tagName: el.tagName,
        parent: getSelector(el.parentElement),
        previousSibling: getSelector(el.previousElementSibling),
        nextSibling: getSelector(el.nextElementSibling),
        offsetTop: el.offsetTop,
        offsetHeight: el.offsetHeight,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        },
        computed: {
          position: computed.position,
          top: computed.top,
          bottom: computed.bottom,
          height: computed.height,
          minHeight: computed.minHeight,
          marginTop: computed.marginTop,
          marginBottom: computed.marginBottom,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
          transform: computed.transform,
          translate: computed.translate,
          display: computed.display
        }
      }
    }

    console.log('--- DOM ELEMENTS ---')
    console.log('#philosophy:', captureState(philosophy))
    console.log('Trigger Element:', captureState(trigger))
    console.log('.pin-spacer:', captureState(pinSpacer))
    ancestors.forEach((anc, i) => {
      console.log(`Ancestor ${i + 1}:`, captureState(anc))
    })
    console.log('Next Sibling after pin-spacer:', captureState(nextSibling))
    console.log('#projects:', captureState(projects))

    console.log('--- SCROLL TRIGGER ---')
    console.log({
      start: philPin.start,
      end: philPin.end,
      pin: philPin.vars.pin,
      pinSpacing: philPin.vars.pinSpacing,
      trigger: philPin.trigger,
      scroller: philPin.scroller
    })

    const vh = window.innerHeight
    const scrollY = window.scrollY || window.pageYOffset
    const projectsAbsoluteTop = scrollY + (projects ? projects.getBoundingClientRect().top : 0)
    const expectedProjectsAbsoluteTop = philPin.end + vh
    const diff = expectedProjectsAbsoluteTop - projectsAbsoluteTop

    console.log(`========== PHILOSOPHY GEOMETRY TRACE ==========

Expected Projects top: ${expectedProjectsAbsoluteTop}
Actual Projects top: ${projectsAbsoluteTop}
Difference: ${diff}

Pin spacer footprint: ${pinSpacer ? pinSpacer.offsetHeight : 'N/A'}
Pinned element layout height: ${trigger ? trigger.offsetHeight : 'N/A'}
Pin spacing: ${philPin.end - philPin.start}
Philosophy section footprint: ${philosophy ? philosophy.offsetHeight : 'N/A'}

Element immediately after pin spacer: ${nextSibling ? nextSibling.tagName.toLowerCase() + (nextSibling.id ? '#' + nextSibling.id : '') + (nextSibling.className ? '.' + nextSibling.className.split(' ').join('.') : '') : 'None'}
Its document position: ${nextSibling ? scrollY + nextSibling.getBoundingClientRect().top : 'N/A'}

Projects document position: ${projectsAbsoluteTop}

===============================================`)
  }
  
  window.inspectPhilosophyStageHeight = () => {
    const el = document.querySelector('.philosophy-stage-container')

    if (!el) {
      console.log('Stage container not found')
      return
    }

    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()

    console.log('========== PHILOSOPHY STAGE HEIGHT DIAGNOSTIC ==========')

    console.log('Stage container:', {
      offsetHeight: el.offsetHeight,
      clientHeight: el.clientHeight,
      scrollHeight: el.scrollHeight,

      rectTop: rect.top,
      rectBottom: rect.bottom,
      rectHeight: rect.height,

      height: style.height,
      minHeight: style.minHeight,
      maxHeight: style.maxHeight,

      position: style.position,
      display: style.display,
      overflow: style.overflow,

      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,

      boxSizing: style.boxSizing,

      transform: style.transform,

      flexGrow: style.flexGrow,
      flexShrink: style.flexShrink,
      flexBasis: style.flexBasis,

      gridTemplateRows: style.gridTemplateRows
    })

    console.log('DIRECT CHILDREN:')

    Array.from(el.children).forEach((child, index) => {
      const childStyle = getComputedStyle(child)
      const childRect = child.getBoundingClientRect()

      console.log(`Child ${index}`, {
        selector: child.className || child.tagName,

        position: childStyle.position,

        offsetHeight: child.offsetHeight,

        rectTop: childRect.top,
        rectBottom: childRect.bottom,
        rectHeight: childRect.height,

        height: childStyle.height,
        minHeight: childStyle.minHeight,

        top: childStyle.top,
        bottom: childStyle.bottom,

        marginTop: childStyle.marginTop,
        marginBottom: childStyle.marginBottom,

        transform: childStyle.transform,

        display: childStyle.display
      })
    })

    console.log('=========================================================')
  }
  
  window.inspectDownstreamAnimations = () => {
    if (typeof window === 'undefined') return

    const philPin = ScrollTrigger.getById('philosophy-pin')
    if (!philPin) {
      console.log('Philosophy ScrollTrigger not found. Please scroll down to it first.')
      return
    }

    const scrollY = window.scrollY || window.pageYOffset
    const vh = window.innerHeight

    console.log('========== DOWNSTREAM ANIMATION DIAGNOSTIC ==========')
    console.log(`Current ScrollY: ${scrollY}`)
    console.log(`Philosophy Pin Active: ${scrollY >= philPin.start && scrollY <= philPin.end}`)
    console.log(`Philosophy Pin Bounds: ${philPin.start} -> ${philPin.end}`)
    console.log('-----------------------------------------------------')

    const downstreamIds = ['projects', 'vision', 'enquiry', 'closing-cta', 'footer'] // Adjust based on actual sections
    const downstreamSections = downstreamIds.map(id => document.getElementById(id)).filter(Boolean)
    
    // Some sections might not have IDs that perfectly match, so let's also capture anything after philosophy
    const philosophy = document.getElementById('philosophy')
    const allSections = Array.from(document.querySelectorAll('section'))
    const philIndex = allSections.indexOf(philosophy)
    const downstream = philIndex >= 0 ? allSections.slice(philIndex + 1) : downstreamSections

    const allTriggers = ScrollTrigger.getAll()
    
    const isDownstream = (element) => {
      if (!element) return false
      return downstream.some(section => section === element || section.contains(element))
    }

    const progressedAnimations = []

    allTriggers.forEach((st, index) => {
      const triggerEl = st.trigger
      if (isDownstream(triggerEl)) {
        
        let section = 'Unknown'
        for (const s of downstream) {
          if (s === triggerEl || s.contains(triggerEl)) {
            section = s.id || s.className || s.tagName
            break
          }
        }

        const rect = triggerEl.getBoundingClientRect()
        const isInsideViewport = rect.top < vh && rect.bottom > 0
        const anim = st.animation
        
        const info = {
          section,
          stId: st.vars.id || `st-${index}`,
          triggerElement: triggerEl.tagName.toLowerCase() + (triggerEl.id ? '#' + triggerEl.id : '') + (triggerEl.className ? '.' + triggerEl.className.split(' ').join('.') : ''),
          resolvedStart: st.start,
          resolvedEnd: st.end,
          stProgress: st.progress,
          animProgress: anim ? anim.progress() : 'N/A',
          isActive: st.isActive,
          animActive: anim ? anim.isActive() : 'N/A',
          isInsideViewport
        }

        console.log(`Section: ${info.section}`)
        console.log(`  ScrollTrigger ID: ${info.stId}`)
        console.log(`  Trigger Element: ${info.triggerElement}`)
        console.log(`  Bounds: start=${info.resolvedStart}, end=${info.resolvedEnd}`)
        console.log(`  ScrollTrigger Progress: ${info.stProgress}`)
        console.log(`  Animation Progress: ${info.animProgress}`)
        console.log(`  Animation Active: ${info.animActive}`)
        console.log(`  In Viewport: ${info.isInsideViewport}`)
        
        // Attempt to capture styles
        if (anim && anim.targets) {
          const targets = anim.targets()
          console.log(`  Visual State of Targets (${targets.length}):`)
          targets.forEach(t => {
            if (t instanceof Element) {
               const style = window.getComputedStyle(t)
               console.log(`    ${t.tagName}: opacity=${style.opacity}, transform=${style.transform}, filter=${style.filter}`)
            }
          })
        }
        console.log('-----------------------------------------------------')

        if (st.progress > 0 || (anim && anim.progress() > 0)) {
          progressedAnimations.push(info)
        }
      }
    })

    console.log('DOWNSTREAM ANIMATIONS THAT HAVE ALREADY PROGRESSED WHILE PHILOSOPHY IS ACTIVE:')
    if (progressedAnimations.length === 0) {
       console.log('  None. All downstream animations are at 0 progress.')
    } else {
       progressedAnimations.forEach(info => {
          console.log(`  - [${info.section}] Trigger: ${info.triggerElement} (ST Progress: ${info.stProgress}, Anim Progress: ${info.animProgress})`)
       })
    }
    console.log('=========================================================')
  }

  window.inspectAnimationMismatches = function inspectAnimationMismatches() {
    if (typeof window === 'undefined' || typeof gsap === 'undefined') return

    console.log('========== ANIMATION MISMATCH DIAGNOSTIC ==========')
    
    const allTriggers = ScrollTrigger.getAll()
    const allTweens = gsap.globalTimeline.getChildren(true, true, true)
    let mismatchCount = 0

    allTriggers.forEach((st, index) => {
      const anim = st.animation
      if (!anim) return

      const stProgress = st.progress
      const animProgress = anim.progress()
      const totalProgress = anim.totalProgress()

      // Detect material difference
      if (Math.abs(stProgress - animProgress) > 0.1) {
        mismatchCount++
        
        const isSuspicious = (animProgress > 0.9 && stProgress < 0.5)

        if (isSuspicious) {
          console.log('⚠️ [FLAG] SUSPICIOUS COMPLETED STATE DETECTED ⚠️')
        }

        console.log(`ScrollTrigger ID: ${st.vars.id || `st-${index}`}`)
        console.log(`  Trigger Bounds: start=${st.start}, end=${st.end}`)
        console.log(`  ScrollTrigger Progress: ${stProgress}`)
        console.log(`  Animation Progress: ${animProgress}, Total: ${totalProgress}`)
        console.log(`  Scrub Config: ${st.vars.scrub !== undefined ? st.vars.scrub : 'none'}`)
        console.log(`  Animation Duration: ${anim.duration()}`)
        
        // Configuration
        const animVars = anim.vars || {}
        console.log(`  Animation Config: toggleActions=${st.vars.toggleActions || 'N/A'}, overwrite=${animVars.overwrite || 'N/A'}`)

        // Targets and Conflicts
        const targets = anim.targets ? anim.targets() : []
        console.log(`  Targets (${targets.length}):`, targets.map(t => t.tagName + (t.className ? '.' + t.className.replace(/ /g, '.') : '')).join(', '))
        
        // Find competing tweens
        const competingTweens = []
        allTweens.forEach(tween => {
          if (tween === anim || anim.getChildren?.(true, true, true).includes(tween)) return // skip self
          const tweenTargets = tween.targets ? tween.targets() : []
          const overlap = targets.some(t => tweenTargets.includes(t))
          if (overlap) {
             competingTweens.push({
                tween,
                vars: tween.vars,
                isActive: tween.isActive(),
                progress: tween.progress()
             })
          }
        })
        
        if (competingTweens.length > 0) {
          console.log(`  🚨 COMPETING TWEENS FOUND: ${competingTweens.length}`)
          competingTweens.forEach((comp, i) => {
             console.log(`    Competitor ${i+1}: isActive=${comp.isActive}, progress=${comp.progress}`)
             console.log(`    Vars:`, comp.vars)
          })
        } else {
          console.log(`  No active competing tweens found for these targets.`)
        }

        console.log('-----------------------------------------------------')
      }
    })

    if (mismatchCount === 0) {
      console.log('No material mismatches found between ScrollTrigger and Animation progress.')
    }
    console.log('=========================================================')
  }
  
  // Setup continuous monitoring for premature activations
  window.prematureActivationLog = []
  window._monitorStarted = false
  
  window.startPrematureActivationMonitor = () => {
    if (typeof window === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
    if (window._monitorStarted) return
    window._monitorStarted = true
    
    // Give ScrollTrigger a moment to initialize
    setTimeout(() => {
      const philPin = ScrollTrigger.getById('philosophy-pin')
      const downstreamIds = ['projects', 'vision', 'enquiry', 'closing-cta', 'footer']
      const downstreamSections = downstreamIds.map(id => document.getElementById(id)).filter(Boolean)
      
      const philosophy = document.getElementById('philosophy')
      const allSections = Array.from(document.querySelectorAll('section'))
      const philIndex = allSections.indexOf(philosophy)
      const downstream = philIndex >= 0 ? allSections.slice(philIndex + 1) : downstreamSections
      
      const isDownstream = (element) => {
        if (!element) return false
        return downstream.some(section => section === element || section.contains(element))
      }
      
      const triggersToMonitor = ScrollTrigger.getAll().filter(st => isDownstream(st.trigger))
      const activatedSet = new Set()
      
      gsap.ticker.add(() => {
        const scrollY = window.scrollY || window.pageYOffset
        const vh = window.innerHeight
        
        triggersToMonitor.forEach(st => {
          if (!activatedSet.has(st) && st.progress > 0) {
            activatedSet.add(st)
            
            const rect = st.trigger.getBoundingClientRect()
            const isInsideViewport = rect.top < vh && rect.bottom > 0
            const anim = st.animation
            const animProgress = anim ? anim.progress() : 'N/A'
            
            window.prematureActivationLog.push({
              id: st.vars.id || 'unknown',
              triggerElement: st.trigger.tagName.toLowerCase() + (st.trigger.id ? '#' + st.trigger.id : '') + (st.trigger.className ? '.' + st.trigger.className.split(' ').join('.') : ''),
              targets: anim && anim.targets ? anim.targets().map(t => t.tagName).join(', ') : 'None',
              resolvedStart: st.start,
              resolvedEnd: st.end,
              exactScrollY: scrollY,
              triggerRectTop: rect.top,
              triggerRectBottom: rect.bottom,
              viewportHeight: vh,
              isInsideViewport: isInsideViewport,
              philPinStart: philPin ? philPin.start : null,
              philPinEnd: philPin ? philPin.end : null,
              isPhilPinActive: philPin ? (scrollY >= philPin.start && scrollY <= philPin.end) : false,
              animProgressAfterActivation: animProgress
            })
          }
        })
      })
      console.log('✅ Premature activation monitor started.')
    }, 1000)
  }

  window.inspectPrematureActivations = function inspectPrematureActivations() {
    console.log('========== PREMATURE ACTIVATION REPORT ==========')
    if (window.prematureActivationLog.length === 0) {
      console.log('No downstream animations have activated yet. Make sure you scrolled down past their triggers.')
    } else {
      window.prematureActivationLog.forEach((log, i) => {
        console.log(`Event ${i + 1}: ${log.id}`)
        console.log(`  Trigger Element: ${log.triggerElement}`)
        console.log(`  Targets: ${log.targets}`)
        console.log(`  Bounds: start=${log.resolvedStart}, end=${log.resolvedEnd}`)
        console.log(`  Activation ScrollY: ${log.exactScrollY}`)
        console.log(`  Trigger Rect: top=${log.triggerRectTop}, bottom=${log.triggerRectBottom}`)
        console.log(`  Viewport Height: ${log.viewportHeight}`)
        console.log(`  Visible in Viewport: ${log.isInsideViewport}`)
        console.log(`  Philosophy Pin Bounds: ${log.philPinStart} -> ${log.philPinEnd}`)
        console.log(`  Philosophy Active During Activation: ${log.isPhilPinActive}`)
        console.log(`  Animation Progress After Activation: ${log.animProgressAfterActivation}`)
        console.log('------------------------------------------------')
      })
    }
    console.log('=================================================')
  }
  
  // Auto-start the monitor
  if (typeof window !== 'undefined') {
    // Wait until document is ready
    if (document.readyState === 'complete') {
      window.startPrematureActivationMonitor()
    } else {
      window.addEventListener('load', window.startPrematureActivationMonitor)
    }
  }
}

/**
 * Custom hook to cleanly handle GSAP ScrollTrigger animations with reduced motion support.
 * @param {Function} animationFn - The function containing the GSAP timeline/tweens. Receives the timeline as an argument.
 * @param {React.MutableRefObject} scopeRef - The ref of the container element for GSAP scoping.
 * @param {Object} scrollTriggerConfig - Optional default overrides for ScrollTrigger.
 */
export function useRevealAnimation(animationFn, scopeRef, scrollTriggerConfig = {}) {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    
    // Only build the timeline and ScrollTrigger if reduced motion is NOT preferred
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Common default settings for all section reveals
      const defaultTrigger = {
        trigger: scopeRef.current,
        start: "top 85%", // Trigger early so fast scrolling doesn't trap content
        toggleActions: "play none none none",
        ...scrollTriggerConfig
      }

      // Create the timeline hooked to the ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: defaultTrigger,
        defaults: { ease: 'power3.out' }
      })

      // Pass the timeline to the component's specific animation logic
      animationFn(tl)
    })
  }, { scope: scopeRef })
}
