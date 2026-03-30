export const formatNumber = (value, locale = 'en-US', options = {}) => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    });

    return formatter.format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};

export const formatInteger = (value, locale = 'en-US') => {
  return formatNumber(value, locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDecimal = (value, decimals = 2, locale = 'en-US') => {
  return formatNumber(value, locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (value, decimals = 0, locale = 'en-US') => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(value);
  } catch (error) {
    console.error('Error formatting percent:', error);
    return `${value}%`;
  }
};

export const formatUnit = (value, unit, locale = 'en-US', options = {}) => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit,
      ...options,
    });

    return formatter.format(value);
  } catch (error) {
    console.error('Error formatting unit:', error);
    return `${value} ${unit}`;
  }
};

export const parseNumber = (formattedValue, locale = 'en-US') => {
  try {
    const decimalSeparator = new Intl.NumberFormat(locale)
      .format(1.1)
      .substring(1, 2);

    let cleaned = formattedValue;

    if (decimalSeparator === ',') {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }

    return parseFloat(cleaned) || 0;
  } catch (error) {
    console.error('Error parsing number:', error);
    return parseFloat(formattedValue) || 0;
  }
};

export const getNumberFormatter = (locale = 'en-US', options = {}) => {
  return new Intl.NumberFormat(locale, options);
};

export const formatFileSize = (bytes, locale = 'en-US') => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return formatNumber(size, locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + ' ' + sizes[i];
};

export const formatQuantity = (quantity, unit = '', locale = 'en-US') => {
  const formatted = formatInteger(quantity, locale);
  return unit ? `${formatted} ${unit}` : formatted;
};
