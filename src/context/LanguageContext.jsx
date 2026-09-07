import { createContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'site-language'
const DEFAULT_LANGUAGE = 'en'
const SUPPORTED_LANGUAGES = ['en', 'hi']

export const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved
      }
    } catch {
      // localStorage unavailable (e.g. private-browsing restrictions)
    }
    return DEFAULT_LANGUAGE
  })

  // Sync <html lang=""> and persist to localStorage whenever language changes
  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Silently ignore write failures
    }
  }, [language])

  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(
        `[LanguageContext] "${lang}" is not a supported language. Use one of: ${SUPPORTED_LANGUAGES.join(', ')}.`
      )
      return
    }
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
