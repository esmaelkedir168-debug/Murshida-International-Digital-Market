import { useCallback } from 'react';
import { useLocale } from './useLocale.jsx';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatTime,
  formatDateTime,
  formatPercent,
  formatUnit,
  formatFileSize,
  formatQuantity,
} from '../formatters/index.js';

export const useFormatting = () => {
  const { locale } = useLocale();

  return {
    formatCurrency: useCallback((amount, currency) => {
      return formatCurrency(amount, locale, currency);
    }, [locale]),

    formatNumber: useCallback((value, options) => {
      return formatNumber(value, locale, options);
    }, [locale]),

    formatDate: useCallback((date, pattern = 'PPP') => {
      return formatDate(date, pattern, locale);
    }, [locale]),

    formatTime: useCallback((date) => {
      return formatTime(date, locale);
    }, [locale]),

    formatDateTime: useCallback((date) => {
      return formatDateTime(date, locale);
    }, [locale]),

    formatPercent: useCallback((value, decimals = 0) => {
      return formatPercent(value, decimals, locale);
    }, [locale]),

    formatUnit: useCallback((value, unit, options) => {
      return formatUnit(value, unit, locale, options);
    }, [locale]),

    formatFileSize: useCallback((bytes) => {
      return formatFileSize(bytes, locale);
    }, [locale]),

    formatQuantity: useCallback((quantity, unit = '') => {
      return formatQuantity(quantity, unit, locale);
    }, [locale]),
  };
};
