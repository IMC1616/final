import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const emptyState = {
  translation: {}
};

const resources = {
  es: emptyState,
  en: emptyState
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false
  }
});
