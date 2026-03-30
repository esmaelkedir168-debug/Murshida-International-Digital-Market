import { useLocale } from './useLocale.jsx';
import { isRTLLocale } from '../localeDetector.js';

export const useDirection = () => {
  const { locale } = useLocale();
  const isRTL = isRTLLocale(locale);
  const direction = isRTL ? 'rtl' : 'ltr';

  return {
    direction,
    isRTL,
    marginStart: (value) => (isRTL ? { marginRight: value } : { marginLeft: value }),
    marginEnd: (value) => (isRTL ? { marginLeft: value } : { marginRight: value }),
    paddingStart: (value) => (isRTL ? { paddingRight: value } : { paddingLeft: value }),
    paddingEnd: (value) => (isRTL ? { paddingLeft: value } : { paddingRight: value }),
    textAlign: isRTL ? 'right' : 'left',
  };
};
