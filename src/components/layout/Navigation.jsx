import { useState, useEffect, useRef, useCallback } from 'react'
import { company, navigation } from '../../data/siteData'
import logoIcon from '../../assets/logo-icon.png'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navRef = useRef(null)
  const scrollLockYRef = useRef(0)

  // ── Scroll state + active section tracking ──
  useEffect(() => {
    const sectionIds = navigation.map(n => n.target)

    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 80)

      // Active section detection
      const viewportCenter = scrollY + window.innerHeight * 0.4
      let current = 'home'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= viewportCenter) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e, target) => {
    e.preventDefault()
    setIsMenuOpen(false)

    const scrollToTarget = () => {
      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (isMenuOpen) {
      window.setTimeout(scrollToTarget, 80)
    } else {
      scrollToTarget()
    }
  }, [isMenuOpen])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open)
  }, [])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      scrollLockYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollLockYRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
    } else {
      const y = scrollLockYRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      if (y) window.scrollTo(0, y)
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 section-padding-x transition-all duration-500 ease-out ${
          isScrolled
            ? 'py-3.5 sm:py-4 bg-ivory'
            : 'py-5 sm:py-6 bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between container-base" aria-label="Main navigation">
          {/* Brand — Architectural Emblem + Company Name */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="reveal-nav flex items-center gap-2.5 sm:gap-3 md:gap-4 z-50 relative group transition-opacity duration-300 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#242424]/20 rounded-sm"
          >
            {/* Architectural Emblem Icon */}
            <img
              src={logoIcon}
              alt="Shri Radhika Developers logo emblem"
              className="h-10 sm:h-11 md:h-13 lg:h-15 w-auto object-contain block mix-blend-multiply shrink-0"
            />

            {/* Subtle Vertical Divider */}
            <span className="h-4 sm:h-4.5 md:h-5.5 w-px bg-[#242424]/20 inline-block shrink-0" />

            {/* Company Name */}
            <span className="font-body text-[10px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-[0.22em] md:tracking-[0.25em] uppercase font-medium text-[#242424] whitespace-nowrap">
              {company.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <ul className="reveal-nav hidden md:flex items-center gap-8 group">
            {navigation.filter(item => item.label !== 'Home').map((item) => (
              <li key={item.target}>
                <a
                  href={`#${item.target}`}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className={`font-body text-xs tracking-[0.15em] uppercase transition-all duration-300 rounded-sm relative
                    group-hover:opacity-50 hover:!opacity-100
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#242424]/20 focus-visible:ring-offset-4
                    ${activeSection === item.target
                      ? 'text-[#242424] opacity-100'
                      : 'text-[#242424]/70'
                    }
                  `}
                >
                  {item.label}
                  {/* Active indicator line */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#242424] transition-all duration-500 ease-out ${
                      activeSection === item.target ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="reveal-nav md:hidden font-body text-xs tracking-[0.15em] uppercase text-[#242424] z-50 relative p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#242424]/20 rounded-sm transition-all font-medium"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? 'Close' : 'Explore'}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`mobile-menu fixed inset-0 bg-ivory z-40 flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          isMenuOpen ? 'is-open opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="absolute inset-x-6 top-24 h-px bg-[#242424]/10" />
        <ul className="flex flex-col items-center gap-7">
          {navigation.map((item, index) => (
            <li
              key={item.target}
              style={{
                transform: isMenuOpen ? 'translateY(0)' : `translateY(${30 + index * 10}px)`,
                opacity: isMenuOpen ? 1 : 0,
                transition: `all 0.5s ${0.1 + index * 0.06}s ease-out`,
              }}
            >
              <a
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className={`display-heading text-4xl sm:text-5xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#242424]/20 rounded-sm ${
                  activeSection === item.target ? 'text-[#242424]' : 'text-[#242424]/40 hover:text-[#242424]/70'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-6 bottom-10 flex items-center justify-between border-t border-[#242424]/10 pt-5">
          <span className="eyebrow text-[#242424]/70">Shri Radhika</span>
          <span className="eyebrow text-[#242424]/70">Developers</span>
        </div>
      </div>
    </>
  )
}

export default Navigation
