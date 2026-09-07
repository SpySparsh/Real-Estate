import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

/**
 * useLanguage
 *
 * Returns { language, setLanguage } from the global LanguageContext.
 *
 * Usage:
 *   const { language, setLanguage } = useLanguage()
 *
 * Throws a clear error if used outside <LanguageProvider>.
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === null) {
    throw new Error(
      '[useLanguage] Must be used inside a <LanguageProvider>. ' +
      'Make sure <LanguageProvider> wraps your component tree in main.jsx.'
    )
  }
  return context
}
