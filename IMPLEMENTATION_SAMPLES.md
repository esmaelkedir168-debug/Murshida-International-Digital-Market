# i18n Implementation Code Samples

This document provides practical code samples for implementing internationalization in your e-commerce platform.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Component Examples](#component-examples)
3. [Advanced Patterns](#advanced-patterns)
4. [Database Operations](#database-operations)
5. [Testing](#testing)

---

## Basic Setup

### 1. Application Root Setup

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n/config';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
```

### 2. Initialize i18n Configuration

```javascript
// src/i18n/config.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
```

### 3. Wrap App with LocaleProvider

```jsx
// src/App.jsx
import { LocaleProvider } from './i18n/context/LocaleProvider';
import './i18n/rtl/rtlStyles.css';

export default function App() {
  return (
    <LocaleProvider>
      <YourMainComponent />
    </LocaleProvider>
  );
}
```

---

## Component Examples

### 1. Product Display Component

```jsx
// src/components/ProductCard.jsx
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../i18n/hooks/useFormatting';
import { useDirection } from '../i18n/hooks/useDirection';

export function ProductCard({ product }) {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = useFormatting();
  const { direction, paddingStart } = useDirection();

  return (
    <div dir={direction} className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <div className="product-meta" style={paddingStart(16)}>
        <span className="price">
          {formatCurrency(product.price)}
        </span>

        <span className="rating">
          {t('products.rating')}: {formatNumber(product.rating, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          })}
        </span>

        <span className="stock">
          {product.inStock ?
            t('products.in_stock') :
            t('products.out_of_stock')
          }
        </span>
      </div>

      <button className="add-to-cart">
        {t('products.add_to_cart')}
      </button>
    </div>
  );
}
```

### 2. Checkout Form Component

```jsx
// src/components/CheckoutForm.jsx
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../i18n/hooks/useFormatting';
import { useDirection } from '../i18n/hooks/useDirection';
import { useState } from 'react';

export function CheckoutForm({ items, total, tax }) {
  const { t } = useTranslation();
  const { formatCurrency, formatPercent } = useFormatting();
  const { direction, isRTL } = useDirection();
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const subtotal = total / (1 + tax);
  const taxAmount = total - subtotal;

  return (
    <form onSubmit={handleSubmit} dir={direction} className="checkout-form">
      <fieldset>
        <legend>{t('checkout.billing_address')}</legend>

        <div className="form-group">
          <label htmlFor="email">{t('account.email')}</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">{t('checkout.billing_address')}</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>
      </fieldset>

      <div className="order-summary">
        <h3>{t('checkout.order_summary')}</h3>

        <div className="summary-item">
          <span>{t('checkout.subtotal')}:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="summary-item">
          <span>{t('checkout.tax')} ({formatPercent(tax)}):</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>

        <div className="summary-item summary-total">
          <span>{t('checkout.total')}:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button type="submit">
        {t('checkout.complete_purchase')}
      </button>
    </form>
  );
}
```

### 3. Language Switcher with Flags

```jsx
// src/components/AdvancedLanguageSwitcher.jsx
import { useLocale } from '../i18n/hooks/useLocale';
import { SUPPORTED_LOCALES } from '../i18n/localeDetector';
import { useState } from 'react';

export function AdvancedLanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="language-switcher-advanced">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-button"
      >
        <span>{SUPPORTED_LOCALES[locale].flag}</span>
        <span>{SUPPORTED_LOCALES[locale].name}</span>
      </button>

      {isOpen && (
        <ul className="language-menu">
          {Object.entries(SUPPORTED_LOCALES).map(([code, config]) => (
            <li key={code}>
              <button
                onClick={() => {
                  setLocale(code);
                  setIsOpen(false);
                }}
                className={locale === code ? 'active' : ''}
              >
                <span className="flag">{config.flag}</span>
                <span className="name">{config.name}</span>
                <span className="native">{config.native}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 4. Order History with Dates

```jsx
// src/components/OrderHistory.jsx
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../i18n/hooks/useFormatting';
import { useDirection } from '../i18n/hooks/useDirection';

export function OrderHistory({ orders }) {
  const { t } = useTranslation();
  const { formatDate, formatCurrency, formatNumber } = useFormatting();
  const { direction } = useDirection();

  return (
    <div dir={direction} className="order-history">
      <h2>{t('navigation.orders')}</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('checkout.order_summary')}</th>
            <th>{t('checkout.total')}</th>
            <th>{t('products.quantity')}</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.items.map(item => item.name).join(', ')}</td>
              <td>{formatCurrency(order.total)}</td>
              <td>{formatNumber(order.items.length)}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{t(`order.status.${order.status}`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Advanced Patterns

### 1. Custom Formatted Display Component

```jsx
// src/components/FormattedValue.jsx
import { useFormatting } from '../i18n/hooks/useFormatting';

export function FormattedValue({
  type = 'number',
  value,
  currency,
  decimals = 2,
  unit,
  className,
  children
}) {
  const formatting = useFormatting();

  let formatted = value;

  switch (type) {
    case 'currency':
      formatted = formatting.formatCurrency(value, currency);
      break;
    case 'percent':
      formatted = formatting.formatPercent(value, decimals);
      break;
    case 'number':
      formatted = formatting.formatNumber(value);
      break;
    case 'filesize':
      formatted = formatting.formatFileSize(value);
      break;
    case 'date':
      formatted = formatting.formatDate(value);
      break;
    case 'time':
      formatted = formatting.formatTime(value);
      break;
    case 'unit':
      formatted = formatting.formatUnit(value, unit);
      break;
    default:
      formatted = value;
  }

  return (
    <span className={className}>
      {children ? children(formatted) : formatted}
    </span>
  );
}

// Usage
<FormattedValue type="currency" value={99.99} />
<FormattedValue type="percent" value={0.856} decimals={2} />
<FormattedValue type="filesize" value={1048576} />
<FormattedValue type="date" value={new Date()} />
```

### 2. Dynamic Content with Pluralization

```jsx
// src/components/ItemCount.jsx
import { useTranslation } from 'react-i18next';
import { useFormatting } from '../i18n/hooks/useFormatting';

export function ItemCount({ count }) {
  const { t } = useTranslation();
  const { formatNumber } = useFormatting();

  return (
    <p>
      {t('product.item_count', {
        count,
        formattedCount: formatNumber(count)
      })}
    </p>
  );
}

// Translation (en-US)
// {
//   "product.item_count": "You have {{formattedCount}} item",
//   "product.item_count_plural": "You have {{formattedCount}} items"
// }

// Translation (ar-SA)
// {
//   "product.item_count": "لديك {{formattedCount}} عنصر",
//   "product.item_count_plural": "لديك {{formattedCount}} عناصر"
// }
```

### 3. Locale-Aware Component Wrapper

```jsx
// src/components/LocalizedComponent.jsx
import { useLocale } from '../i18n/hooks/useLocale';
import { useDirection } from '../i18n/hooks/useDirection';
import { useFormatting } from '../i18n/hooks/useFormatting';

export function LocalizedComponent({ children, className }) {
  const { locale } = useLocale();
  const { direction, isRTL } = useDirection();
  const formatting = useFormatting();

  return (
    <div
      className={`localized-wrapper ${className}`}
      dir={direction}
      data-locale={locale}
      data-rtl={isRTL}
    >
      {typeof children === 'function'
        ? children({ direction, isRTL, formatting, locale })
        : children
      }
    </div>
  );
}

// Usage
<LocalizedComponent>
  {({ formatting, direction, isRTL }) => (
    <div dir={direction}>
      <p>{formatting.formatCurrency(100)}</p>
    </div>
  )}
</LocalizedComponent>
```

### 4. Translation Management Hook

```jsx
// src/i18n/hooks/useTranslationManager.jsx
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';

export function useTranslationManager() {
  const { t, i18n } = useTranslation();
  const [missingKeys, setMissingKeys] = useState([]);

  const trackMissingKey = useCallback((key) => {
    if (process.env.NODE_ENV === 'development') {
      setMissingKeys(prev => {
        if (!prev.includes(key)) {
          console.warn(`Missing translation: ${key}`);
          return [...prev, key];
        }
        return prev;
      });
    }
  }, []);

  i18n.on('missingKey', (lng, ns, key) => {
    trackMissingKey(key);
  });

  return {
    t,
    missingKeys,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
}

// Usage
function MyComponent() {
  const { t, missingKeys } = useTranslationManager();

  return (
    <div>
      <p>{t('some.key')}</p>
      {missingKeys.length > 0 && (
        <div className="dev-warning">
          Missing translations: {missingKeys.join(', ')}
        </div>
      )}
    </div>
  );
}
```

---

## Database Operations

### 1. Adding Translations to Supabase

```javascript
// src/i18n/utils/addTranslations.js
import { addTranslation } from '../supabaseTranslations';

export async function addProductTranslations() {
  try {
    // English
    await addTranslation('en-US', 'products', 'electronics', 'Electronics');
    await addTranslation('en-US', 'products', 'laptop_price', '$999');
    await addTranslation('en-US', 'products', 'laptop_desc', 'High-performance laptop');

    // Arabic
    await addTranslation('ar-SA', 'products', 'electronics', 'إلكترونيات');
    await addTranslation('ar-SA', 'products', 'laptop_price', '﷼ ٣٧٥٠');
    await addTranslation('ar-SA', 'products', 'laptop_desc', 'جهاز كمبيوتر محمول عالي الأداء');

    // Spanish
    await addTranslation('es-ES', 'products', 'electronics', 'Electrónica');
    await addTranslation('es-ES', 'products', 'laptop_price', '€899');
    await addTranslation('es-ES', 'products', 'laptop_desc', 'Portátil de alto rendimiento');

  } catch (error) {
    console.error('Error adding translations:', error);
  }
}
```

### 2. Fetching Translations from Database

```javascript
// src/i18n/utils/fetchTranslations.js
import { fetchTranslations } from '../supabaseTranslations';

export async function loadUserPreferredLanguage(userId) {
  try {
    // Fetch user's preferred language from Supabase
    const { data } = await supabase
      .from('user_preferences')
      .select('preferred_locale')
      .eq('user_id', userId)
      .single();

    if (data?.preferred_locale) {
      return data.preferred_locale;
    }

    return 'en-US'; // Default
  } catch (error) {
    console.error('Error fetching user language:', error);
    return 'en-US';
  }
}

export async function loadAllTranslations(locale) {
  try {
    const translations = {
      common: await fetchTranslations(locale, 'common'),
      products: await fetchTranslations(locale, 'products'),
      checkout: await fetchTranslations(locale, 'checkout'),
      errors: await fetchTranslations(locale, 'errors'),
    };

    return translations;
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
}
```

---

## Testing

### 1. Testing Translation Keys

```javascript
// src/__tests__/translations.test.js
import { expect, describe, it } from 'vitest';
import enUS from '../i18n/locales/en-US/common.json';
import arSA from '../i18n/locales/ar-SA/common.json';

describe('Translations', () => {
  it('should have matching keys across locales', () => {
    const enKeys = Object.keys(enUS).sort();
    const arKeys = Object.keys(arSA).sort();

    expect(enKeys).toEqual(arKeys);
  });

  it('should not have empty translation values', () => {
    Object.entries(enUS).forEach(([key, value]) => {
      if (typeof value === 'string') {
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });

  it('should have all required translation namespaces', () => {
    const requiredNamespaces = [
      'common',
      'navigation',
      'products',
      'checkout',
      'account',
      'errors'
    ];

    requiredNamespaces.forEach(ns => {
      expect(enUS).toHaveProperty(ns);
    });
  });
});
```

### 2. Testing RTL Rendering

```javascript
// src/__tests__/rtl.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LocaleProvider } from '../i18n/context/LocaleProvider';

describe('RTL Support', () => {
  it('should set dir="rtl" for Arabic locale', () => {
    const { container } = render(
      <LocaleProvider initialLocale="ar-SA">
        <div>Test Content</div>
      </LocaleProvider>
    );

    expect(container.querySelector('html')).toHaveAttribute('dir', 'rtl');
  });

  it('should set dir="ltr" for English locale', () => {
    const { container } = render(
      <LocaleProvider initialLocale="en-US">
        <div>Test Content</div>
      </LocaleProvider>
    );

    expect(container.querySelector('html')).toHaveAttribute('dir', 'ltr');
  });

  it('should apply RTL margins correctly', () => {
    import { createMarginStyles } from '../i18n/rtl/rtlUtils';

    const rtlMargins = createMarginStyles(0, 16, 0, 8, true);

    expect(rtlMargins).toEqual({
      marginTop: 0,
      marginRight: 8,
      marginBottom: 0,
      marginLeft: 16,
    });
  });
});
```

### 3. Testing Number Formatting

```javascript
// src/__tests__/numberFormatter.test.js
import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatFileSize
} from '../i18n/formatters/numberFormatter';

describe('Number Formatting', () => {
  describe('formatNumber', () => {
    it('should format US numbers with commas', () => {
      const result = formatNumber(1234567.89, 'en-US');
      expect(result).toBe('1,234,567.89');
    });

    it('should format Arabic numbers', () => {
      const result = formatNumber(1234567, 'ar-SA');
      expect(result).toContain('٬'); // Arabic separator
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(99.99, 'en-US', 'USD');
      expect(result).toBe('$99.99');
    });

    it('should format SAR currency correctly', () => {
      const result = formatCurrency(100, 'ar-SA', 'SAR');
      expect(result).toBeTruthy();
    });
  });

  describe('formatPercent', () => {
    it('should format percentages correctly', () => {
      const result = formatPercent(0.856, 2, 'en-US');
      expect(result).toBe('85.60%');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(1024, 'en-US')).toBe('1 KB');
      expect(formatFileSize(1048576, 'en-US')).toBe('1 MB');
      expect(formatFileSize(1073741824, 'en-US')).toBe('1 GB');
    });
  });
});
```

---

## Summary

These code samples provide a complete foundation for implementing internationalization in your e-commerce platform. The patterns demonstrated support:

- Multiple languages with automatic detection
- RTL layout support for Arabic and similar languages
- Locale-aware formatting (currency, dates, numbers)
- Database-driven translations
- Performance optimization through caching
- Comprehensive testing strategies

Customize these examples based on your specific requirements and extend them as your platform grows.
