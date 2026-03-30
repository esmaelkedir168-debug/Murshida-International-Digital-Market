import { useState, useEffect, useCallback } from 'react';
import { LocaleContext } from './LocaleContext.jsx';
import { SUPPORTED_LOCALES, detectLocale, setStoredLocale, getLocaleDirection } from '../localeDetector.js';

export const LocaleProvider = ({ children, initialLocale = null }) => {
  const [locale, setLocaleState] = useState(() => {
    return initialLocale || detectLocale();
  });

  const [direction, setDirection] = useState(() => {
    return getLocaleDirection(initialLocale || detectLocale());
  });

  const setLocale = useCallback((newLocale) => {
    if (!SUPPORTED_LOCALES[newLocale]) {
      console.warn(`Unsupported locale: ${newLocale}`);
      return;
    }

    setLocaleState(newLocale);
    setDirection(getLocaleDirection(newLocale));
    setStoredLocale(newLocale);

    document.documentElement.lang = newLocale;
    document.documentElement.dir = getLocaleDirection(newLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const value = {
    locale,
    setLocale,
    direction,
    supportedLocales: SUPPORTED_LOCALES,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};
