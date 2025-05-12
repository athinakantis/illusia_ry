import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { i18nextPlugin } from 'translation-check'; // To see tranlation check. After localhost in the browser, add ?showtranslations

i18n
.use(i18nextPlugin)                // add translation check plugin
  .use(Backend)                     // load translations from /public/locales
  .use(LanguageDetector)            // detect user language
  .use(initReactI18next)            // pass i18n instance to react-i18next
  i18next.use(i18nextPlugin).init({
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    debug: false,
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