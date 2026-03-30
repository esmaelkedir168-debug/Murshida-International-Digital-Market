import {
  format,
  formatDistance as dateFnsFormatDistance,
  formatRelative,
  parseISO,
  isValid,
} from 'date-fns';
import { enUS, ar, es, fr, de, ja } from 'date-fns/locale';

const LOCALE_MAP = {
  'en-US': enUS,
  'ar-SA': ar,
  'es-ES': es,
  'fr-FR': fr,
  'de-DE': de,
  'ja-JP': ja,
};

const getDateFnsLocale = (locale) => {
  return LOCALE_MAP[locale] || enUS;
};

export const formatDate = (date, pattern = 'PPP', locale = 'en-US') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      console.warn('Invalid date:', date);
      return '';
    }

    return format(dateObj, pattern, {
      locale: getDateFnsLocale(locale),
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatTime = (date, locale = 'en-US') => {
  return formatDate(date, 'p', locale);
};

export const formatDateTime = (date, locale = 'en-US') => {
  return formatDate(date, 'PPpp', locale);
};

export const formatDateShort = (date, locale = 'en-US') => {
  return formatDate(date, 'P', locale);
};

export const formatDateLong = (date, locale = 'en-US') => {
  return formatDate(date, 'PPPP', locale);
};

export const formatRelativeTime = (date, locale = 'en-US') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return '';
    }

    return formatRelative(dateObj, new Date(), {
      locale: getDateFnsLocale(locale),
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

export const formatDistance = (date, baseDate = new Date(), options = {}, locale = 'en-US') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return '';
    }

    return dateFnsFormatDistance(dateObj, baseDate, {
      locale: getDateFnsLocale(locale),
      ...options,
    });
  } catch (error) {
    console.error('Error formatting distance:', error);
    return '';
  }
};

export const getMonthName = (monthIndex, locale = 'en-US') => {
  try {
    const date = new Date(2024, monthIndex, 1);
    return format(date, 'MMMM', { locale: getDateFnsLocale(locale) });
  } catch (error) {
    console.error('Error getting month name:', error);
    return '';
  }
};

export const getDayName = (dayIndex, locale = 'en-US') => {
  try {
    const date = new Date(2024, 0, dayIndex + 1);
    return format(date, 'EEEE', { locale: getDateFnsLocale(locale) });
  } catch (error) {
    console.error('Error getting day name:', error);
    return '';
  }
};

export const getFirstDayOfWeek = (locale = 'en-US') => {
  const localeDateFns = getDateFnsLocale(locale);
  return localeDateFns.options?.weekStartsOn || 0;
};
