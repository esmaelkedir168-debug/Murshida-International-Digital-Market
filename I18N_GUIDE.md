# Comprehensive Internationalization (i18n) Implementation Guide

## Overview

This guide covers the complete internationalization implementation for your e-commerce/digital marketing platform. The system supports multiple languages, RTL layouts, currency formatting, date/time localization, and number formatting.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Usage Examples](#usage-examples)
4. [Database Schema](#database-schema)
5. [RTL Support](#rtl-support)
6. [Formatting Utilities](#formatting-utilities)
7. [Best Practices](#best-practices)

---

## Architecture Overview

### Technology Stack

- **Framework**: React 18 with Vite
- **i18n Core**: i18next + react-i18next
- **Database**: Supabase with PostgreSQL
- **Date Formatting**: date-fns with locale support
- **Currency**: Dinero.js for precise currency operations
- **RTL Detection**: rtl-detect
- **Styling**: CSS Logical Properties for RTL compatibility

### Key Design Principles

1. **Locale Detection**: Automatic detection from browser, localStorage, or URL
2. **Translation Caching**: 5-minute cache to reduce database queries
3. **RTL Support**: Full support for right-to-left languages
4. **Type Safety**: JavaScript with clear prop types and return values
5. **Performance**: Lazy loading and code splitting per locale

---

## Core Components

### 1. Locale Provider

The `LocaleProvider` wraps your application and manages locale state globally.

```jsx
import { LocaleProvider } from './i18n/context/LocaleProvider.jsx';

export default function App() {
  return (
    <LocaleProvider initialLocale="en-US">
      <YourApp />
    </LocaleProvider>
  );
}
```

**Features:**
- Auto-detects user's browser language
- Persists locale preference in localStorage
- Updates HTML `lang` attribute and `dir` attribute
- Provides context to all child components

### 2. Locale Detector

Handles intelligent locale detection with fallback chain.

```javascript
import {
  detectLocale,
  isRTLLocale,
  SUPPORTED_LOCALES,
} from './i18n/localeDetector.js';

// Auto-detect based on browser, localStorage, URL
const detectedLocale = detectLocale();

// Check if locale is RTL
const isRTL = isRTLLocale('ar-SA');
```

**Supported Locales:**
- `en-US` - English (United States)
- `ar-SA` - Arabic (Saudi Arabia) - RTL
- `es-ES` - Spanish (Spain)
- `fr-FR` - French (France)
- `de-DE` - German (Germany)
- `ja-JP` - Japanese (Japan)

### 3. Supabase Translation System

Translations are stored in Supabase database with support for versioning and fallback chains.

**Tables:**
- `locales` - Language definitions with RTL flags
- `translation_namespaces` - Organization groups
- `translation_keys` - Key hierarchies (e.g., "products.title")
- `translations` - Actual translated content

---

## Usage Examples

### 1. Basic Translation (i18next)

```jsx
import { useTranslation } from 'react-i18next';

function ProductCard() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('products.title')}</h2>
      <button>{t('products.add_to_cart')}</button>
    </div>
  );
}
```

### 2. Locale & Direction Switching

```jsx
import { useLocale } from './i18n/hooks/useLocale.jsx';

function LanguageSwitcher() {
  const { locale, setLocale, direction } = useLocale();

  return (
    <div dir={direction}>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en-US">English</option>
        <option value="ar-SA">العربية</option>
      </select>
    </div>
  );
}
```

### 3. Currency Formatting

```jsx
import { useFormatting } from './i18n/hooks/useFormatting.jsx';

function PriceDisplay({ amount }) {
  const { formatCurrency } = useFormatting();

  return <p>Price: {formatCurrency(amount)}</p>;
  // Output: "Price: $99.99" (en-US) or "Price: ﷼99,99" (ar-SA)
}
```

### 4. Date Formatting

```jsx
import { useFormatting } from './i18n/hooks/useFormatting.jsx';

function OrderDate({ date }) {
  const { formatDate, formatDateTime } = useFormatting();

  return (
    <div>
      <p>Date: {formatDate(date)}</p>
      <p>DateTime: {formatDateTime(date)}</p>
    </div>
  );
  // Output (en-US): "Date: March 30, 2024" "DateTime: March 30, 2024 2:30:45 PM"
  // Output (ar-SA): "Date: ٣٠ مارس ٢٠٢٤" "DateTime: ٣٠ مارس ٢٠٢٤ ٢:٣٠:٤٥ م"
}
```

### 5. Number Formatting

```jsx
import { useFormatting } from './i18n/hooks/useFormatting.jsx';

function Stats({ quantity, fileSize, percentage }) {
  const { formatNumber, formatFileSize, formatPercent } = useFormatting();

  return (
    <div>
      <p>Items: {formatNumber(quantity)}</p>
      <p>Size: {formatFileSize(fileSize)}</p>
      <p>Progress: {formatPercent(percentage)}</p>
    </div>
  );
  // Output (en-US): "Items: 1,234" "Size: 1 MB" "Progress: 85.6%"
  // Output (ar-SA): "Items: ١٬٢٣٤" "Size: ١ MB" "Progress: ٨٥٫٦٪"
}
```

### 6. RTL Layout Support

```jsx
import { useDirection } from './i18n/hooks/useDirection.jsx';

function Navigation() {
  const { direction, isRTL, marginStart } = useDirection();

  return (
    <nav dir={direction} style={{ display: 'flex', ...marginStart(16) }}>
      <a href="#">Home</a>
      <a href="#">Products</a>
      <a href="#">Contact</a>
    </nav>
  );
  // Automatically reverses layout for Arabic
}
```

---

## Database Schema

### Locales Table

```sql
CREATE TABLE locales (
  id uuid PRIMARY KEY,
  code text UNIQUE NOT NULL,        -- 'en-US', 'ar-SA'
  name text NOT NULL,               -- 'English (US)'
  native_name text NOT NULL,        -- 'English'
  is_rtl boolean DEFAULT false,
  is_active boolean DEFAULT true,
  flag_emoji text,                  -- '🇺🇸'
  sort_order integer,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Translation Keys Table

```sql
CREATE TABLE translation_keys (
  id uuid PRIMARY KEY,
  namespace_id uuid NOT NULL,       -- Reference to namespace
  key text NOT NULL,                -- 'products.price'
  description text,
  requires_interpolation boolean,   -- For variables
  plural_form boolean,
  created_at timestamptz,
  updated_at timestamptz
);
```

### Translations Table

```sql
CREATE TABLE translations (
  id uuid PRIMARY KEY,
  key_id uuid NOT NULL,             -- Reference to key
  locale_id uuid NOT NULL,          -- Reference to locale
  value text NOT NULL,              -- Actual translation
  is_complete boolean DEFAULT true,
  version integer DEFAULT 1,
  created_at timestamptz,
  updated_at timestamptz
);
```

---

## RTL Support

### CSS Logical Properties

The system uses CSS Logical Properties for directional-aware styling:

```css
/* Logical Properties (automatically flipped for RTL) */
.element {
  margin-inline-start: 1rem;  /* Left in LTR, Right in RTL */
  padding-inline-end: 1rem;   /* Right in LTR, Left in RTL */
  border-inline-start: 1px;   /* Left border in LTR, Right in RTL */
}
```

### Utility Functions

```javascript
import {
  createFlexDirection,
  createMarginStyles,
  createPaddingStyles,
} from './i18n/rtl/rtlUtils.js';

// Automatically reverse flex direction for RTL
const flexDir = createFlexDirection('row', isRTL);
// Returns: 'row' for LTR, 'row-reverse' for RTL

// RTL-aware margins
const margins = createMarginStyles(0, 16, 0, 8, isRTL);
// Swaps right/left values for RTL
```

### HTML Direction Attribute

Automatically set by `LocaleProvider`:

```html
<!-- LTR -->
<html lang="en-US" dir="ltr">

<!-- RTL -->
<html lang="ar-SA" dir="rtl">
```

---

## Formatting Utilities

### Currency Formatter

```javascript
import {
  formatCurrency,
  formatCurrencyWithDinero,
  parseCurrency,
  convertCurrency,
} from './i18n/formatters/currencyFormatter.js';

// Basic formatting
formatCurrency(99.99, 'en-US');        // "$99.99"
formatCurrency(99.99, 'ar-SA', 'SAR'); // "﷼‏ ١٠٠"

// Precise currency operations
formatCurrencyWithDinero(9999, 'en-US', 'USD'); // "$99.99"

// Parse formatted currency back to number
const amount = parseCurrency('$1,234.56', 'en-US'); // 1234.56

// Currency conversion (requires API)
const converted = await convertCurrency(100, 'USD', 'EUR');
```

### Date Formatter

```javascript
import {
  formatDate,
  formatDateTime,
  formatDateShort,
  formatDateLong,
  formatRelativeTime,
  getMonthName,
  getDayName,
} from './i18n/formatters/dateFormatter.js';

// Various date formats
formatDate(new Date(), 'PPP', 'en-US');        // "March 30, 2024"
formatDateShort(new Date(), 'en-US');         // "03/30/2024"
formatDateLong(new Date(), 'en-US');          // "Saturday, March 30, 2024"

// Relative formatting
formatRelativeTime(new Date(), 'en-US');      // "Today"
formatRelativeTime(new Date(Date.now() - 86400000), 'en-US'); // "Yesterday"

// Get localized month/day names
getMonthName(0, 'ar-SA');  // "يناير"
getDayName(6, 'ar-SA');    // "الجمعة"
```

### Number Formatter

```javascript
import {
  formatNumber,
  formatInteger,
  formatDecimal,
  formatPercent,
  formatUnit,
  formatFileSize,
  parseNumber,
} from './i18n/formatters/numberFormatter.js';

// Basic number formatting
formatNumber(1234.56, 'en-US');           // "1,234.56"
formatNumber(1234.56, 'ar-SA');           // "١٬٢٣٤٫٥٦"

// Specific formats
formatInteger(1234.56, 'en-US');          // "1,235"
formatDecimal(1234.567, 2, 'en-US');      // "1,234.57"
formatPercent(0.856, 2, 'en-US');         // "85.60%"
formatUnit(15, 'kilometer', 'en-US');     // "15 km"
formatFileSize(1048576, 'en-US');         // "1 MB"

// Parse formatted numbers
const num = parseNumber('1,234.56', 'en-US'); // 1234.56
```

---

## Best Practices

### 1. Translation Key Naming

Use hierarchical, descriptive keys:

```javascript
// Good
t('products.title')
t('products.price')
t('checkout.payment.method')
t('errors.required_field')

// Avoid
t('title')
t('msg')
t('error1')
```

### 2. Interpolation

```javascript
// In JSON
{
  "welcome": "Welcome, {{name}}"
}

// In component
t('welcome', { name: 'John' }) // "Welcome, John"
```

### 3. Pluralization

```javascript
// In JSON
{
  "item_count": "You have {{count}} item",
  "item_count_plural": "You have {{count}} items"
}

// In component
t('item_count', { count: 5 }) // "You have 5 items"
```

### 4. Performance Optimization

```javascript
// Use memoization for expensive formatting
import { useMemo } from 'react';

function ExpensiveComponent({ date }) {
  const { formatDate } = useFormatting();

  const formattedDate = useMemo(
    () => formatDate(date),
    [date, formatDate]
  );

  return <p>{formattedDate}</p>;
}
```

### 5. Locale-Specific Currency Codes

```javascript
// Map locales to currency codes
const LOCALE_CURRENCIES = {
  'en-US': 'USD',
  'ar-SA': 'SAR',
  'es-ES': 'EUR',
  'fr-FR': 'EUR',
  'de-DE': 'EUR',
  'ja-JP': 'JPY',
};

// Use in components
const currency = LOCALE_CURRENCIES[locale];
const formatted = formatCurrency(amount, locale, currency);
```

### 6. Testing RTL Layouts

```javascript
// Test both directions
test('Navigation layout is correct in RTL', () => {
  render(<Navigation dir="rtl" />);
  const nav = screen.getByRole('navigation');
  expect(nav).toHaveAttribute('dir', 'rtl');
});

test('Flexbox reverses in RTL', () => {
  const { container } = render(<FlexContainer isRTL={true} />);
  const flex = container.querySelector('.flex-row');
  expect(flex).toHaveStyle('flex-direction: row-reverse');
});
```

### 7. Adding New Locales

```javascript
// 1. Add to database
INSERT INTO locales (code, name, native_name, is_rtl) VALUES
('zh-CN', 'Chinese (Simplified)', '简体中文', false);

// 2. Add translations for all keys
// Use migration script or admin panel

// 3. Add to SUPPORTED_LOCALES
export const SUPPORTED_LOCALES = {
  'zh-CN': {
    name: 'Chinese (Simplified)',
    native: '简体中文',
    rtl: false,
    flag: '🇨🇳'
  },
};

// 4. Add locale file
// src/i18n/locales/zh-CN/common.json
```

### 8. Handling Missing Translations

```javascript
// i18n automatically falls back to default locale
t('products.title') // Falls back to en-US if ar-SA is missing

// Check if translation exists
const missingTranslations = i18n.language !== i18n.resolvedLanguage;

// Log missing keys in development
if (process.env.NODE_ENV === 'development') {
  i18n.on('missingKey', (lng, ns, key) => {
    console.warn(`Missing translation: ${key} for ${lng}`);
  });
}
```

---

## Deployment Checklist

- [ ] All required translations are complete
- [ ] RTL layouts tested in target languages
- [ ] Currency conversion API configured
- [ ] Timezone handling verified for all target regions
- [ ] Date formatting verified for all locales
- [ ] Performance tested with full translation dataset
- [ ] Translation caching configured for production
- [ ] SEO metadata localized and set correctly
- [ ] Email templates translated for all languages
- [ ] Support documentation translated
- [ ] Legal documents (ToS, Privacy) localized per region

---

## Troubleshooting

**Issue**: Translations not loading from Supabase

```javascript
// Check database connection
const { data, error } = await supabase.from('locales').select('*');
if (error) console.error('Database error:', error);

// Verify RLS policies
// Ensure public read policies are enabled
```

**Issue**: RTL layout broken for specific component

```javascript
// Use logical properties instead of left/right
// ❌ Avoid
style={{ marginLeft: 16 }}

// ✅ Use
style={{ marginInlineStart: 16 }}
```

**Issue**: Currency formatting incorrect for certain locales

```javascript
// Verify locale configuration
console.log(CURRENCY_CONFIGS['ar-SA']);

// Update currency mapping if needed
const CURRENCY_CONFIGS = {
  'ar-SA': { currency: 'SAR', locale: 'ar-SA' }
};
```

---

## Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [React i18next Guide](https://react.i18next.com/)
- [date-fns Documentation](https://date-fns.org/)
- [Dinero.js Guide](https://dinerojs.com/)
- [MDN: Internationalization](https://developer.mozilla.org/en-US/docs/Glossary/Internationalization_and_localization)
- [Unicode CLDR Project](http://cldr.unicode.org/)

---

## License

This internationalization system is part of the Murshida International project.
