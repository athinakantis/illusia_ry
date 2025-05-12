import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)                     // load translations from /public/locales
  .use(LanguageDetector)            // detect user language
  .use(initReactI18next)            // pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    debug: true,
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`Missing translation key: ${key} in namespace: ${ns} for languages: ${lngs}`);
    },
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/translations.json',
    },
  });

export default i18n;