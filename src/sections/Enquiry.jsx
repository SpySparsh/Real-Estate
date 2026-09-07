import { useState, useRef } from 'react'
import { enquiry } from '../data/siteData'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from '../hooks/useTranslation'

gsap.registerPlugin(ScrollTrigger)

function Enquiry() {
  const containerRef = useRef(null)
  const { t, tArray } = useTranslation()

  // Maps each English interest value (used as <option value=>, sent to backend)
  // to its translated display label. Backend payload is always the English string.
  const interestLabelMap = {
    'General Enquiry':        t('enquiry.interestGeneral'),
    'Residential Project':    t('enquiry.interestResidential'),
    'Commercial Project':     t('enquiry.interestCommercial'),
    'Investment Opportunity': t('enquiry.interestInvestment'),
    'Partnership':            t('enquiry.interestPartnership'),
    'Other':                  t('enquiry.interestOther'),
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Eyebrow ──
      gsap.from('.enquiry-eyebrow', {
        opacity: 0,
        y: 15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      })

      // ── Headline: masked staggered reveal ──
      gsap.utils.toArray('.enquiry-headline').forEach((line, i) => {
        gsap.from(line, {
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          delay: i * 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: line.parentElement || containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        })
      })

      // ── Fine divider extends ──
      gsap.from('.enquiry-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.enquiry-divider',
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      })

      // ── Form container slides in ──
      gsap.from('.enquiry-form-container', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.enquiry-form-container',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
    })
  }, { scope: containerRef })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    message: '',
    botcheck: false // Honeypot
  })

  // 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle')
  const [validationErrors, setValidationErrors] = useState({})
  const [globalError, setGlobalError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (globalError) setGlobalError('')
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = t('enquiry.validationNameRequired')
    if (!formData.phone.trim()) errors.phone = t('enquiry.validationPhoneRequired')
    if (!formData.email.trim()) {
      errors.email = t('enquiry.validationEmailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('enquiry.validationEmailInvalid')
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
      ? String(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY).trim()
      : ''

    const placeholderKey = 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE'
    const isPlaceholderAccessKey = accessKey === '' || accessKey === placeholderKey

    // Validate client-side first
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setStatus('error')
      setGlobalError('')
      return
    }

    // Check honeypot (silent fail)
    if (formData.botcheck) {
      return
    }

    if (isPlaceholderAccessKey) {
      setStatus('error')
      setGlobalError(t('enquiry.errorNotConfigured'))
      return
    }

    setStatus('submitting')
    setGlobalError('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest || 'Not Specified',
          message: formData.message || 'No message provided',
          from_name: 'Shri Radhika Developers Website',
          subject: `New Enquiry from Shri Radhika Developers Website — ${formData.name}`
        })
      })

      const json = await response.json()

      if (response.ok && json.success) {
        setStatus('success')
        setFormData({
          name: '',
          phone: '',
          email: '',
          interest: '',
          message: '',
          botcheck: false
        })
        setValidationErrors({})
      } else {
        setStatus('error')
        setGlobalError(json?.message || t('enquiry.errorGeneric'))
      }
    } catch (error) {
      setStatus('error')
      setGlobalError(t('enquiry.errorNetwork'))
    }
  }

  return (
    <section id="contact" ref={containerRef} className="section-padding-x py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 bg-ivory">
      <div className="container-base">
        {/* Section Label */}
        <p className="enquiry-eyebrow eyebrow mb-6 md:mb-12">
          {t('enquiry.eyebrow')}
        </p>

        {/* Headline */}
        <div className="mb-6 md:mb-12">
          {tArray('enquiry.headlineLines').map((line, index) => (
            <div key={index} className="enquiry-headline-wrapper overflow-hidden pb-1">
              <h2
                className="enquiry-headline display-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="enquiry-divider w-full max-w-2xl h-px bg-neutral/30 mb-8 md:mb-16" />

        {/* Form Container */}
        <div className="enquiry-form-container max-w-2xl">
          {status === 'success' ? (
            <div className="py-12 border-t border-black/10">
              <h3 className="font-display text-2xl md:text-3xl font-medium text-black mb-4">
                {t('enquiry.successHeading')}
              </h3>
              <p className="body-copy max-w-md">
                {t('enquiry.successBody')}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 cta-link"
              >
                {t('enquiry.successReset')}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 md:space-y-8"
              noValidate
            >
              {/* Honeypot Spam Protection */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: 'none' }}
                checked={formData.botcheck}
                onChange={handleChange}
              />

              {/* Global Error */}
              {globalError && (
                <div className="p-4 bg-black/5 text-black font-body text-sm rounded-sm">
                  {globalError}
                </div>
              )}

              {/* Name */}
              <div className={`enquiry-field-wrapper fine-divider pb-3 transition-colors duration-300 ${validationErrors.name ? 'border-red-500' : 'focus-within:border-black'}`}>
                <div className="flex justify-between items-center mb-2 mt-3">
                  <label htmlFor="enquiry-name" className="eyebrow block text-neutral/80">
                    {t('enquiry.labelName')}
                  </label>
                  {validationErrors.name && (
                    <span className="font-body text-xs text-red-500">{validationErrors.name}</span>
                  )}
                </div>
                <input
                  type="text"
                  id="enquiry-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent font-body text-base text-black outline-none placeholder:text-neutral/50"
                  placeholder={t('enquiry.placeholderName')}
                  disabled={status === 'submitting'}
                  required
                />
              </div>

              {/* Phone */}
              <div className={`enquiry-field-wrapper fine-divider pb-3 transition-colors duration-300 ${validationErrors.phone ? 'border-red-500' : 'focus-within:border-black'}`}>
                <div className="flex justify-between items-center mb-2 mt-3">
                  <label htmlFor="enquiry-phone" className="eyebrow block text-neutral/80">
                    {t('enquiry.labelPhone')}
                  </label>
                  {validationErrors.phone && (
                    <span className="font-body text-xs text-red-500">{validationErrors.phone}</span>
                  )}
                </div>
                <input
                  type="tel"
                  id="enquiry-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent font-body text-base text-black outline-none placeholder:text-neutral/50"
                  placeholder={t('enquiry.placeholderPhone')}
                  disabled={status === 'submitting'}
                  required
                />
              </div>

              {/* Email */}
              <div className={`enquiry-field-wrapper fine-divider pb-3 transition-colors duration-300 ${validationErrors.email ? 'border-red-500' : 'focus-within:border-black'}`}>
                <div className="flex justify-between items-center mb-2 mt-3">
                  <label htmlFor="enquiry-email" className="eyebrow block text-neutral/80">
                    {t('enquiry.labelEmail')}
                  </label>
                  {validationErrors.email && (
                    <span className="font-body text-xs text-red-500">{validationErrors.email}</span>
                  )}
                </div>
                <input
                  type="email"
                  id="enquiry-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent font-body text-base text-black outline-none placeholder:text-neutral/50"
                  placeholder={t('enquiry.placeholderEmail')}
                  disabled={status === 'submitting'}
                  required
                />
              </div>

              {/* Interest */}
              <div className="enquiry-field-wrapper fine-divider pb-3 transition-colors duration-300 focus-within:border-black">
                <label
                  htmlFor="enquiry-interest"
                  className="eyebrow block mb-2 mt-3 text-neutral/80"
                >
                  {t('enquiry.labelInterest')}
                </label>
                <select
                  id="enquiry-interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full bg-transparent font-body text-base text-black outline-none cursor-pointer"
                  disabled={status === 'submitting'}
                >
                  {/* value= stays as empty string — structural, not translated */}
                  <option value="">{t('enquiry.placeholderInterestDefault')}</option>
                  {enquiry.interests.map((interest) => (
                    // value= stays as the English string — sent to backend unchanged
                    // display label is resolved from interestLabelMap
                    <option key={interest} value={interest}>
                      {interestLabelMap[interest] || interest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="enquiry-field-wrapper fine-divider pb-3 transition-colors duration-300 focus-within:border-black">
                <label
                  htmlFor="enquiry-message"
                  className="eyebrow block mb-2 mt-3 text-neutral/80"
                >
                  {t('enquiry.labelMessage')}
                </label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent font-body text-base text-black outline-none placeholder:text-neutral/50 resize-none"
                  placeholder={t('enquiry.placeholderMessage')}
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="cta-link disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? t('enquiry.submitSending') : t('enquiry.submitIdle')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Enquiry
