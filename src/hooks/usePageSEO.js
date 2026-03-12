import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ROUTE_TO_SEO_KEY = {
  '/': 'home',
  '/experience': 'experience',
  '/education': 'education',
  '/skills': 'skills',
  '/projects': 'projects',
  '/contact': 'contact',
  '/about': 'about',
}

/**
 * Updates document title and meta description per route and language.
 * Improves SEO and helps search engines / LLM crawlers understand page content.
 */
export function usePageSEO() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'

  useEffect(() => {
    const key = ROUTE_TO_SEO_KEY[pathname] || 'home'
    const siteName = t('seo.siteName')
    const pageTitle = t(`seo.${key}.pageTitle`)
    const description = t(`seo.${key}.pageDescription`)

    const fullTitle = pageTitle ? `${pageTitle} | ${siteName}` : siteName
    document.title = fullTitle

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', description)

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle)
    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (twitterDesc) twitterDesc.setAttribute('content', description)

    document.documentElement.lang = lang === 'es' ? 'es' : 'en'
  }, [pathname, lang])
}
