import translations from '../data/translations'
import { useLanguage } from './useLanguage'

/**
 * useTranslation
 *
 * Returns { language, t } where t(dotPath) resolves a translation key
 * for the currently active language.
 *
 * Key resolution order:
 *   1. translations[language][...path]  — active language value
 *   2. translations.en[...path]         — English fallback
 *   3. dotPath itself                   — key string fallback (never throws)
 *
 * Usage:
 *   const { t, language } = useTranslation()
 *   t('hero.label')           // → "Real Estate Investment & Development"
 *   t('navigation.projects')  // → "Projects" or "परियोजनाएं"
 *   t('missing.key')          // → "missing.key"
 */
export function useTranslation() {
  const { language, setLanguage } = useLanguage()

  function resolvePath(obj, parts) {
    let node = obj
    for (const part of parts) {
      if (node == null || typeof node !== 'object') return undefined
      node = node[part]
    }
    return typeof node === 'string' ? node : undefined
  }

  function t(dotPath) {
    const parts = dotPath.split('.')

    // 1. Active language
    const activeValue = resolvePath(translations[language], parts)
    if (activeValue !== undefined) return activeValue

    // 2. English fallback
    const fallbackValue = resolvePath(translations.en, parts)
    if (fallbackValue !== undefined) return fallbackValue

    // 3. Return the key itself so the UI never goes blank
    return dotPath
  }

  function resolvePathRaw(obj, parts) {
    let node = obj
    for (const part of parts) {
      if (node == null || typeof node !== 'object') return undefined
      node = node[part]
    }
    return node
  }

  function tArray(dotPath) {
    const parts = dotPath.split('.')

    // 1. Active language
    const active = resolvePathRaw(translations[language], parts)
    if (Array.isArray(active)) return active

    // 2. English fallback
    const fallback = resolvePathRaw(translations.en, parts)
    if (Array.isArray(fallback)) return fallback

    return []
  }

  return { language, setLanguage, t, tArray }
}
