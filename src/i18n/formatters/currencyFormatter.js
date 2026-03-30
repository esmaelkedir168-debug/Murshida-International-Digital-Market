import Dinero from 'dinero.js';

const CURRENCY_CONFIGS = {
  'en-US': { currency: 'USD', locale: 'en-US' },
  'ar-SA': { currency: 'SAR', locale: 'ar-SA' },
  'es-ES': { currency: 'EUR', locale: 'es-ES' },
  'fr-FR': { currency: 'EUR', locale: 'fr-FR' },
  'de-DE': { currency: 'EUR', locale: 'de-DE' },
  'ja-JP': { currency: 'JPY', locale: 'ja-JP' },
};

export const formatCurrency = (amount, locale = 'en-US', currencyOverride = null) => {
  const config = CURRENCY_CONFIGS[locale] || CURRENCY_CONFIGS['en-US'];
  const currency = currencyOverride || config.currency;

  try {
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount}`;
  }
};

export const formatCurrencyWithDinero = (cents, locale = 'en-US', currency = 'USD') => {
  try {
    const money = Dinero({ amount: cents, currency });
    const config = CURRENCY_CONFIGS[locale] || CURRENCY_CONFIGS['en-US'];

    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency,
    });

    return formatter.format(money.toUnit());
  } catch (error) {
    console.error('Error formatting currency with Dinero:', error);
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
};

export const parseCurrency = (formattedValue, locale = 'en-US') => {
  const config = CURRENCY_CONFIGS[locale];
  let cleaned = formattedValue.replace(/[^\d.,]/g, '');

  const decimalSeparator = new Intl.NumberFormat(config.locale)
    .format(1.1)
    .substring(1, 2);
  const thousandsSeparator = new Intl.NumberFormat(config.locale)
    .format(1000)
    .substring(1, 2);

  if (decimalSeparator === ',') {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(/,/g, '');
  }

  return parseFloat(cleaned) || 0;
};

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    const rate = data.rates[toCurrency];
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount;
  }
};
