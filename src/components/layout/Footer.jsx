import { company, socialLinks, contact, footer } from '../../data/siteData'

function Footer() {
  const handleBackToTop = (e) => {
    e.preventDefault()
    const element = document.getElementById('home')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-black text-ivory section-padding-x py-12 md:py-24 relative">
      <div className="container-base">
        {/* Brand */}
        <div className="mb-12">
          <p className="font-display text-2xl md:text-3xl font-medium leading-tight">
            Shri Radhika
            <br />
            Developers
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Location */}
          <div>
            <p className="eyebrow text-neutral/70 mb-3">
              Location
            </p>
            <p className="font-body text-sm text-ivory/80">
              {contact.address || "Address to be updated"}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow text-neutral/70 mb-3">
              Contact
            </p>
            <p className="font-body text-sm text-ivory/80">
              {contact.email || "Email to be updated"}
            </p>
            <p className="font-body text-sm text-ivory/80">
              {contact.phone || "Phone to be updated"}
            </p>
          </div>

          {/* Social */}
          <div>
            <p className="eyebrow text-neutral/70 mb-3">
              Social
            </p>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="font-body text-sm text-ivory/80 hover:text-ivory focus-visible:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory/50 rounded-sm px-1 -ml-1 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-ivory/10">
          <p className="font-body text-xs text-neutral/70">
            {footer.copyright}
          </p>
          <button
            onClick={handleBackToTop}
            className="font-body text-xs tracking-[0.15em] uppercase text-neutral/70 hover:text-ivory focus-visible:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory/50 rounded-sm p-1 -mr-1 transition-colors duration-300 mt-4 md:mt-0 cursor-pointer"
          >
            {footer.backToTop} ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
