import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  ml: { translation: translationEN },
  ta: { translation: translationEN },
  te: { translation: translationEN },
  kn: { translation: translationEN },
  mr: { translation: translationEN },
  bn: { translation: translationEN },
  gu: { translation: translationEN },
  pa: { translation: translationEN }
};

const savedUser = localStorage.getItem('sevaai_user');
let initialLang = 'en';
if (savedUser) {
  try {
    const user = JSON.parse(savedUser);
    if (user && user.language) {
      initialLang = user.language;
    }
  } catch (e) {}
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
