import { useLayoutEffect, useRef, useState } from 'react'

const FOCUS_LINE = 0.44
const INDEX_HYSTERESIS = 0.055
const SECTION_HYSTERESIS = 0.1
const PROJECT_VISIBLE = 0.34
const PROJECT_ACTIVATE_IN = 0.55
const PROJECT_ACTIVATE_OUT = 0.45
const INTRO_ENTER = 0.7
const INTRO_EXIT = 0.82
const AFTER_EXIT = 0.22
const AFTER_REENTER = 0.4
const MIN_INDEX_MS = 120
const MIN_SECTION_MS = 180

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getFocalY(element, bias = 0.4) {
  if (!element) return Number.POSITIVE_INFINITY
  const rect = element.getBoundingClientRect()
  return rect.top + rect.height * bias
}

function visibleHeight(element, vh) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  if (rect.height <= 0) return 0
  return Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))
}

function visibleRatio(element, vh) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  if (rect.height <= 0) return 0
  return visibleHeight(element, vh) / rect.height
}

function focalDominance(element, vh) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  if (rect.height <= 0) return 0
  const intended = Math.min(rect.height, vh)
  return visibleHeight(element, vh) / intended
}

function queryItems(root, selector) {
  return root ? Array.from(root.querySelectorAll(selector)) : []
}

function getProjectFocal(article) {
  return article?.querySelector('.project-image-wrapper') || article
}

function coverage(root, vh) {
  if (!root) return 0
  const rect = root.getBoundingClientRect()
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
  return Math.max(0, visible) / vh
}

function sequentialIndex(count, current, nextReady, prevReady) {
  const last = Math.max(0, count - 1)
  const index = clamp(current, 0, last)
  if (index < last && nextReady(index)) return index + 1
  if (index > 0 && prevReady(index)) return index - 1
  return index
}

export function useEditorialScroll(philosophyRef, projectsRef) {
  const [activeSection, setActiveSection] = useState('intro')
  const [activePhilosophyIndex, setActivePhilosophyIndex] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)

  const stateRef = useRef({
    section: 'intro',
    philosophyIndex: 0,
    projectIndex: 0,
    lastIndexAt: 0,
    lastSectionAt: 0,
  })

  useLayoutEffect(() => {
    let frame = 0
    let timer = 0
    let hasInitialized = false

    const publish = (patch) => {
      const prev = stateRef.current
      const next = { ...prev, ...patch }
      stateRef.current = next

      if (prev.section !== next.section) setActiveSection(next.section)
      if (prev.philosophyIndex !== next.philosophyIndex) {
        setActivePhilosophyIndex(next.philosophyIndex)
      }
      if (prev.projectIndex !== next.projectIndex) {
        setActiveProjectIndex(next.projectIndex)
      }

      document.documentElement.dataset.editorial =
        `${next.section}:${next.philosophyIndex}:${next.projectIndex}`
    }

    const measure = () => {
      const philosophyRoot = philosophyRef.current
      const projectsRoot = projectsRef.current
      if (!philosophyRoot || !projectsRoot) return { wait: 0, behind: false }

      const now = performance.now()
      const vh = window.innerHeight
      const focusY = vh * FOCUS_LINE
      const indexHyst = vh * INDEX_HYSTERESIS
      const sectionHyst = vh * SECTION_HYSTERESIS

      const principles = queryItems(philosophyRoot, '.principle-item')
      const articles = queryItems(projectsRoot, '.project-article')
      const lastPhil = Math.max(0, principles.length - 1)
      const lastProj = Math.max(0, articles.length - 1)

      const current = stateRef.current
      let { section, philosophyIndex, projectIndex } = current
      philosophyIndex = clamp(philosophyIndex, 0, lastPhil)
      projectIndex = clamp(projectIndex, 0, lastProj)

      const firstPhilY = getFocalY(principles[0])
      const lastPhilY = getFocalY(principles[lastPhil])
      const firstProjEl = getProjectFocal(articles[0])
      const lastProjEl = getProjectFocal(articles[lastProj])
      const firstProjY = getFocalY(firstProjEl, 0.42)
      const lastProjRect = lastProjEl?.getBoundingClientRect()
      const firstProjVisible = visibleRatio(firstProjEl, vh)
      const philCoverage = coverage(philosophyRoot, vh)
      const projCoverage = coverage(projectsRoot, vh)

      const philosophyRect = philosophyRoot.getBoundingClientRect()
      const projectsRect = projectsRoot.getBoundingClientRect()

      const currentScrollY = window.scrollY || window.pageYOffset
      const philTrigger = (typeof window !== 'undefined' && window.ScrollTrigger)
        ? window.ScrollTrigger.getById('philosophy-pin')
        : null

      const philStart = (philTrigger && typeof philTrigger.start === 'number' && !isNaN(philTrigger.start))
        ? philTrigger.start
        : null
      const philEnd = (philTrigger && typeof philTrigger.end === 'number' && !isNaN(philTrigger.end))
        ? philTrigger.end
        : null

      const philPinDistance = philosophyRect.height - vh
      const philProgress = philPinDistance > 0 ? clamp(-philosophyRect.top / philPinDistance, 0, 1) : 0
      const calculatedPhilIndex = Math.min(lastPhil, Math.floor(philProgress * principles.length))

      /*
       * Live GSAP Philosophy Pin status derivation:
       * - philosophyIsPinned: true while scroll position is inside the pinned range.
       * - philFinished: true ONLY after the Philosophy master pin has reached its resolved end.
       */
      const philosophyIsPinned = philTrigger
        ? (philTrigger.isActive || (philEnd !== null && currentScrollY >= (philStart ?? 0) - 10 && currentScrollY < philEnd - 2))
        : (philosophyRect.bottom > vh * 1.05 && philosophyRect.top <= 0)

      const philFinished = philTrigger
        ? (philEnd !== null && currentScrollY >= philEnd - 2)
        : (philProgress >= 1 || philosophyRect.bottom <= vh + 5)

      let dominantProjectIndex = 0
      let dominantProjectValue = 0

      articles.forEach((article, index) => {
        const projectEl = getProjectFocal(article)
        const dominance = focalDominance(projectEl, vh)

        if (dominance > dominantProjectValue) {
          dominantProjectValue = dominance
          dominantProjectIndex = index
        }
      })

      /*
       * INITIAL VIEWPORT SYNCHRONIZATION
       *
       * On reload, the browser may restore the user directly inside the
       * Projects section. The state machine normally starts at "intro",
       * so relying only on section enter transitions can leave Projects
       * inactive until the user scrolls again.
       *
       * On the first measurement, detect where the viewport already is
       * and initialize the correct section and project immediately.
       */
      if (!hasInitialized) {
        hasInitialized = true

        /*
         * If the Projects section currently occupies a meaningful part
         * of the viewport, initialize directly into Projects.
         */
        if (
          !philosophyIsPinned &&
          philFinished &&
          projCoverage >= 0.2 &&
          lastProjRect &&
          lastProjRect.bottom > vh * AFTER_EXIT
        ) {
          section = 'projects'

          /*
           * Determine which project should be active based on the
           * current viewport position.
           */
          let initialProjectIndex = 0
          let highestDominance = 0

          articles.forEach((article, index) => {
            const projectEl = getProjectFocal(article)
            const dominance = focalDominance(projectEl, vh)

            if (dominance > highestDominance) {
              highestDominance = dominance
              initialProjectIndex = index
            }
          })

          projectIndex = initialProjectIndex

          publish({
            section,
            projectIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })

          return { wait: 0, behind: false }
        }

        /*
         * If all projects are already above the viewport on reload,
         * initialize into the section after Projects.
         */
        if (
          lastProjRect &&
          lastProjRect.bottom < vh * AFTER_EXIT
        ) {
          section = 'after'

          publish({
            section,
            lastSectionAt: now,
          })

          return { wait: 0, behind: false }
        }
      }

      const indexGateOpen = now - current.lastIndexAt >= MIN_INDEX_MS
      const sectionGateOpen = now - current.lastSectionAt >= MIN_SECTION_MS

      /*
       * HARD VIEWPORT SYNCHRONIZATION
       *
       * The normal editorial system moves sequentially and is intentionally
       * smooth. However, during very fast scrolling the viewport can jump
       * across multiple projects or completely past the Projects section.
       *
       * In that situation the viewport must become the source of truth.
       */

      /*
       * FAST JUMP INTO / WITHIN PROJECTS
       *
       * If a project is strongly dominant in the viewport, synchronize
       * directly to the Projects section and the actually visible project.
       *
       * This bypasses the one-step-at-a-time sequential logic only when
       * the viewport has clearly jumped ahead.
       */
      if (
        !philosophyIsPinned &&
        philFinished &&
        dominantProjectValue >= PROJECT_VISIBLE &&
        projectsRect.bottom > vh * AFTER_EXIT &&
        projectsRect.top < vh * 0.9
      ) {
        const projectJump =
          Math.abs(dominantProjectIndex - projectIndex)

        const sectionMismatch =
          section !== 'projects'

        /*
         * Only force synchronization when:
         *
         * - we are not already in Projects, OR
         * - the viewport has jumped more than one project away
         *
         * Normal adjacent scrolling continues using sequentialIndex().
         */
        if (sectionMismatch || projectJump > 1) {
          section = 'projects'
          projectIndex = dominantProjectIndex

          publish({
            section,
            projectIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })

          return { wait: 0, behind: false }
        }
      }

      /*
       * FAST JUMP ABOVE PROJECTS / REVERSE BOUNDARY GUARD
       *
       * If the user scrolled back upward into the Philosophy pin range
       * or Projects is completely below the viewport, Projects must immediately deactivate.
       */
      if (
        section === 'projects' &&
        (projectsRect.top >= vh * 0.9 || (philEnd !== null && currentScrollY < philEnd - 2))
      ) {
        /*
         * If Philosophy is visible or active, return there.
         */
        if (
          (philEnd !== null && currentScrollY < philEnd - 2) ||
          (philosophyRect.bottom > vh * 0.15 && philosophyRect.top < vh * 0.9)
        ) {
          section = 'philosophy'
          philosophyIndex = calculatedPhilIndex

          publish({
            section,
            philosophyIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })

          return { wait: 0, behind: false }
        }

        /*
         * Philosophy is also below the viewport, so we have jumped
         * above the editorial sections entirely.
         */
        section = 'intro'

        publish({
          section,
          lastSectionAt: now,
        })

        return { wait: 0, behind: false }
      }

      /*
       * FAST JUMP BELOW PROJECTS
       *
       * If the last project has completely passed the viewport,
       * immediately deactivate Projects.
       */
      if (
        section === 'projects' &&
        lastProjRect &&
        lastProjRect.bottom < vh * AFTER_EXIT
      ) {
        section = 'after'

        publish({
          section,
          lastSectionAt: now,
        })

        return { wait: 0, behind: false }
      }

      if (section === 'intro') {
        if (sectionGateOpen && firstPhilY < vh * INTRO_ENTER) {
          section = 'philosophy'
          philosophyIndex = 0
          publish({
            section,
            philosophyIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })
        }
        return { wait: 0, behind: false }
      }

      if (section === 'philosophy') {
        if (calculatedPhilIndex !== philosophyIndex) {
          philosophyIndex = calculatedPhilIndex
          publish({
            philosophyIndex,
            lastIndexAt: now,
          })
        }

        /*
         * Enter Projects ONLY after the Philosophy master pin has genuinely completed
         * (reached its resolved end) and Projects is reaching the focus line.
         */
        if (
          sectionGateOpen &&
          philFinished &&
          firstProjY <= focusY + sectionHyst
        ) {
          section = 'projects'
          projectIndex = 0

          publish({
            section,
            projectIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })

          return { wait: 0, behind: false }
        }

        /*
         * Leave Philosophy upward only when user scrolls back to the top of Philosophy
         */
        if (
          sectionGateOpen &&
          philosophyRect.top > -vh * 0.1 &&
          firstPhilY > vh * INTRO_EXIT
        ) {
          section = 'intro'

          publish({
            section,
            lastSectionAt: now,
          })

          return { wait: 0, behind: false }
        }

        return { wait: 0, behind: false }
      }

      if (section === 'projects') {
        /*
         * REVERSE SCROLLING GUARD:
         * If scroll position enters back inside the Philosophy pin range,
         * immediately switch section back to 'philosophy'.
         */
        if (philEnd !== null && currentScrollY < philEnd - 2) {
          section = 'philosophy'
          philosophyIndex = calculatedPhilIndex
          publish({
            section,
            philosophyIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })
          return { wait: 0, behind: false }
        }

        const desired = sequentialIndex(
          articles.length,
          projectIndex,
          (index) => {
            const nextEl = getProjectFocal(articles[index + 1])
            return focalDominance(nextEl, vh) >= PROJECT_ACTIVATE_IN
          },
          (index) => {
            const currentEl = getProjectFocal(articles[index])
            const prevEl = getProjectFocal(articles[index - 1])
            return (
              focalDominance(currentEl, vh) < PROJECT_ACTIVATE_OUT &&
              focalDominance(prevEl, vh) >= PROJECT_ACTIVATE_OUT
            )
          },
        )

        if (desired !== projectIndex) {
          if (indexGateOpen) {
            projectIndex = desired
            publish({ projectIndex, lastIndexAt: now })
          }
          return {
            wait: indexGateOpen ? MIN_INDEX_MS : MIN_INDEX_MS - (now - current.lastIndexAt),
            behind: true,
          }
        }

        if (
          sectionGateOpen &&
          projectIndex === 0 &&
          (firstProjY > focusY + sectionHyst || (philEnd !== null && currentScrollY < philEnd - 2))
        ) {
          section = 'philosophy'
          philosophyIndex = calculatedPhilIndex
          publish({
            section,
            philosophyIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })
          return { wait: 0, behind: false }
        }

        if (
          sectionGateOpen &&
          projectIndex === lastProj &&
          lastProjRect &&
          lastProjRect.bottom < vh * AFTER_EXIT
        ) {
          section = 'after'
          publish({ section, lastSectionAt: now })
        }

        return { wait: 0, behind: false }
      }

      if (section === 'after') {
        if (
          sectionGateOpen &&
          lastProjRect &&
          lastProjRect.bottom > vh * AFTER_REENTER
        ) {
          section = 'projects'
          projectIndex = lastProj
          publish({
            section,
            projectIndex,
            lastSectionAt: now,
            lastIndexAt: now,
          })
        }
      }

      return { wait: 0, behind: false }
    }

    const tick = () => {
      frame = 0
      const { wait, behind } = measure()
      if (behind) {
        const delay = Math.max(16, wait || MIN_INDEX_MS)
        timer = window.setTimeout(schedule, delay)
      }
    }

    const schedule = () => {
      if (frame) return
      if (timer) {
        window.clearTimeout(timer)
        timer = 0
      }
      frame = window.requestAnimationFrame(tick)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (timer) window.clearTimeout(timer)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [philosophyRef, projectsRef])

  return {
    activeSection,
    activePhilosophyIndex,
    activeProjectIndex,
  }
}
