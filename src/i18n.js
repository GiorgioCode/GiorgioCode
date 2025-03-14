import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './translations/en.json'
import esTranslations from './translations/es.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations }
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    debug: process.env.NODE_ENV === 'development',
    keySeparator: '.',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'a'],
      skipTranslationOnMissingKey: false
    }
  })

export default i18n
