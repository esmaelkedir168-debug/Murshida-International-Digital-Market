import detectRTL from 'rtl-detect';

export const SUPPORTED_LOCALES = {
  'en-US': { name: 'English (US)', native: 'English', rtl: false, flag: '🇺🇸' },
  'ar-SA': { name: 'Arabic (Saudi Arabia)', native: 'العربية', rtl: true, flag: '🇸🇦' },
  'es-ES': { name: 'Spanish (Spain)', native: 'Español', rtl: false, flag: '🇪🇸' },
  'fr-FR': { name: 'French (France)', native: 'Français', rtl: false, flag: '🇫🇷' },
  'de-DE': { name: 'German (Germany)', native: 'Deutsch', rtl: false, flag: '🇩🇪' },
  'ja-JP': { name: 'Japanese (Japan)', native: '日本語', rtl: false, flag: '🇯🇵' },
};

export const DEFAULT_LOCALE = 'en-US';
export const FALLBACK_LOCALE = 'en-US';

export const getLocaleDirection = (locale) => {
  return SUPPORTED_LOCALES[locale]?.rtl ? 'rtl' : 'ltr';
};

export const detectLocaleFromBrowser = () => {
  const browserLocale = navigator.language || navigator.userLanguage;

  if (SUPPORTED_LOCALES[browserLocale]) {
    return browserLocale;
  }

  const browserLang = browserLocale.split('-')[0];
  const matchedLocale = Object.keys(SUPPORTED_LOCALES).find(
    locale => locale.startsWith(browserLang)
  );

  return matchedLocale || DEFAULT_LOCALE;
};

export const getStoredLocale = () => {
  try {
    return localStorage.getItem('locale') || null;
  } catch {
    return null;
  }
};

export const setStoredLocale = (locale) => {
  try {
    localStorage.setItem('locale', locale);
  } catch {
    console.warn('Failed to store locale preference');
  }
};

export const detectLocale = (urlLocale = null) => {
  if (urlLocale && SUPPORTED_LOCALES[urlLocale]) {
    return urlLocale;
  }

  const storedLocale = getStoredLocale();
  if (storedLocale && SUPPORTED_LOCALES[storedLocale]) {
    return storedLocale;
  }

  return detectLocaleFromBrowser();
};

export const isRTLLocale = (locale) => {
  return SUPPORTED_LOCALES[locale]?.rtl === true;
};

export const getLocaleLanguage = (locale) => {
  return locale.split('-')[0];
};
