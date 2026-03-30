# Setup Instructions for i18n System

## Quick Start Guide

This guide walks you through setting up the complete internationalization system for your Murshida International e-commerce platform.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Supabase account (already configured in .env)
- Modern web browser for testing

## Installation Steps

### 1. Project Structure

Your project now includes the following i18n components:

```
project/
├── src/
│   ├── i18n/
│   │   ├── config.js                 # i18next configuration
│   │   ├── localeDetector.js         # Locale detection logic
│   │   ├── supabaseTranslations.js   # Database integration
│   │   ├── formatters/
│   │   │   ├── currencyFormatter.js
│   │   │   ├── dateFormatter.js
│   │   │   ├── numberFormatter.js
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   ├── useLocale.jsx
│   │   │   ├── useFormatting.jsx
│   │   │   ├── useDirection.jsx
│   │   │   └── index.js
│   │   ├── context/
│   │   │   ├── LocaleContext.jsx
│   │   │   ├── LocaleProvider.jsx
│   │   │   └── index.js
│   │   ├── rtl/
│   │   │   ├── rtlUtils.js
│   │   │   ├── rtlStyles.css
│   │   │   └── index.js
│   │   └── locales/
│   │       ├── en-US/
│   │       │   └── common.json
│   │       └── ar-SA/
│   │           └── common.json
│   ├── components/
│   │   └── LanguageSwitcher.jsx
│   ├── styles/
│   │   ├── App.css
│   │   └── LanguageSwitcher.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── I18N_GUIDE.md                     # Comprehensive documentation
├── IMPLEMENTATION_SAMPLES.md         # Code examples
└── SETUP_INSTRUCTIONS.md            # This file
```

### 2. Install Dependencies

All dependencies have been installed. Verify with:

```bash
npm list
```

Key packages installed:
- `react` & `react-dom` - UI framework
- `i18next` & `react-i18next` - Translation management
- `date-fns` - Date formatting with locale support
- `dinero.js` - Currency handling
- `rtl-detect` - RTL detection
- `@supabase/supabase-js` - Database integration
- `vite` - Build tool

### 3. Verify Environment Configuration

Check that `.env` contains Supabase credentials:

```bash
cat .env
```

You should see:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

The Supabase schema has been created with the following tables:

- **locales** - Language/region definitions
- **translation_namespaces** - Translation groups
- **translation_keys** - Translation key hierarchy
- **translations** - Actual translated content

Default locales configured:
- English (US) - en-US
- Arabic (Saudi Arabia) - ar-SA (RTL)
- Spanish (Spain) - es-ES
- French (France) - fr-FR
- German (Germany) - de-DE
- Japanese (Japan) - ja-JP

### 5. Build the Project

```bash
npm run build
```

Build output will be in the `dist/` directory.

### 6. Development Server

Start development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Using the i18n System

### Basic Translation

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <h1>{t('products.title')}</h1>
  );
}
```

### Locale Switching

```jsx
import { useLocale } from './i18n/hooks/useLocale';

function LanguageMenu() {
  const { locale, setLocale } = useLocale();

  return (
    <select value={locale} onChange={e => setLocale(e.target.value)}>
      <option value="en-US">English</option>
      <option value="ar-SA">العربية</option>
    </select>
  );
}
```

### Number & Currency Formatting

```jsx
import { useFormatting } from './i18n/hooks/useFormatting';

function Price({ amount }) {
  const { formatCurrency } = useFormatting();

  return <span>{formatCurrency(amount)}</span>;
}
```

### RTL Support

```jsx
import { useDirection } from './i18n/hooks/useDirection';

function Navigation() {
  const { direction } = useDirection();

  return (
    <nav dir={direction}>
      {/* Navigation items */}
    </nav>
  );
}
```

## Adding New Languages

### 1. Create Translation Files

```bash
mkdir -p src/i18n/locales/es-ES
touch src/i18n/locales/es-ES/common.json
```

### 2. Add Translations

```json
{
  "common": {
    "language": "Idioma",
    "search": "Buscar"
  },
  "products": {
    "title": "Productos",
    "price": "Precio"
  }
}
```

### 3. Add to Locale Detector

Update `src/i18n/localeDetector.js`:

```javascript
export const SUPPORTED_LOCALES = {
  'es-ES': {
    name: 'Spanish (Spain)',
    native: 'Español',
    rtl: false,
    flag: '🇪🇸'
  },
  // ... other locales
};
```

### 4. Register in i18next Config

Update `src/i18n/config.js`:

```javascript
import esES from './locales/es-ES/common.json';

const resources = {
  'es-ES': {
    common: esES,
  },
  // ... other locales
};
```

## Managing Translations

### Adding Translations via Supabase

```javascript
import { addTranslation } from './i18n/supabaseTranslations';

// Add a translation
await addTranslation('en-US', 'products', 'new_feature', 'New Feature');
await addTranslation('ar-SA', 'products', 'new_feature', 'ميزة جديدة');
```

### Fetching from Database

```javascript
import { fetchTranslations } from './i18n/supabaseTranslations';

const translations = await fetchTranslations('en-US', 'products');
```

### Translation Caching

Translations are cached for 5 minutes to reduce database queries. Clear cache when needed:

```javascript
import { clearTranslationCache } from './i18n/supabaseTranslations';

clearTranslationCache();
```

## Customization Guide

### 1. Update Currency Configurations

In `src/i18n/formatters/currencyFormatter.js`:

```javascript
const CURRENCY_CONFIGS = {
  'en-US': { currency: 'USD', locale: 'en-US' },
  'ar-SA': { currency: 'SAR', locale: 'ar-SA' },
  // Add your currency mappings
};
```

### 2. Configure Date Formats

In `src/i18n/formatters/dateFormatter.js`, you can customize date patterns:

```javascript
// 'P' = short date (03/30/2024)
// 'PP' = medium date (Mar 30, 2024)
// 'PPP' = long date (March 30, 2024)
// 'PPPP' = full date (Saturday, March 30, 2024)

formatDate(date, 'PPP', locale); // Full format
formatDate(date, 'P', locale);   // Short format
```

### 3. Add Custom Formatting

Create new formatter in `src/i18n/formatters/`:

```javascript
// src/i18n/formatters/phoneFormatter.js
export const formatPhoneNumber = (number, locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    // Custom options
  });
  return formatter.format(number);
};
```

### 4. Customize RTL Behavior

In `src/i18n/rtl/rtlUtils.js`:

```javascript
export const createCustomLayout = (isRTL) => {
  return {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    textAlign: isRTL ? 'right' : 'left',
    // Add more properties
  };
};
```

## Common Issues & Solutions

### Issue: Translations Not Loading

**Problem:** Translations show as keys like `[products.title]`

**Solutions:**
1. Check translation files exist in `src/i18n/locales/`
2. Verify keys are properly exported in translation JSON
3. Check browser console for errors
4. Clear browser cache and reload

```bash
# Clear node modules cache
rm -rf node_modules/.vite
npm run build
```

### Issue: RTL Layout Broken

**Problem:** Arabic text displays but layout isn't mirrored

**Solutions:**
1. Ensure `dir` attribute is set on root element
2. Use CSS logical properties instead of `left`/`right`
3. Check that RTL styles are imported

```jsx
// ✅ Correct
<div dir={direction} style={{ marginInlineStart: '1rem' }}>

// ❌ Avoid
<div dir={direction} style={{ marginLeft: '1rem' }}>
```

### Issue: Currency Formatting Incorrect

**Problem:** Currency shows wrong symbol or format

**Solutions:**
1. Verify locale is configured in `CURRENCY_CONFIGS`
2. Check Intl API browser support
3. Use fallback formatting

```javascript
// Verify locale
console.log(CURRENCY_CONFIGS[locale]);

// Test formatting
console.log(formatCurrency(100, 'ar-SA', 'SAR'));
```

### Issue: Date Formatting Wrong

**Problem:** Dates show in wrong order or format

**Solutions:**
1. Check date-fns locale is imported
2. Verify locale code matches supported locales
3. Review date format pattern

```javascript
// Test with known format
formatDate(new Date(), 'PPP', 'en-US');

// Add custom pattern if needed
formatDate(new Date(), 'dd/MM/yyyy', 'ar-SA');
```

## Performance Optimization

### 1. Code Splitting

Translations are automatically code-split by namespace:

```javascript
// Load only needed namespace
const translations = await fetchTranslations(locale, 'products');
```

### 2. Caching Strategy

```javascript
// Cache is 5 minutes by default
// Adjust in supabaseTranslations.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### 3. Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

const ProductCard = lazy(() => import('./ProductCard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductCard />
    </Suspense>
  );
}
```

## Testing

### Run Build

```bash
npm run build
```

Verify no errors in output and check `dist/` directory is created.

### Test Different Locales

1. Open app at `http://localhost:5173`
2. Use language switcher to change locale
3. Verify:
   - Text changes to selected language
   - Layout mirrors for RTL (Arabic)
   - Dates/numbers format correctly
   - Currency displays properly

### Browser DevTools

Check in console:
- No translation errors
- Locale properly detected
- Database connection working

```javascript
// Test in console
i18n.language           // Current language
i18n.languages          // Available languages
i18n.t('products.title') // Test translation
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting

The `dist/` folder contains your production-ready app. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Your own server

### Environment Variables

Ensure production has:
```
VITE_SUPABASE_URL
VITE_SUPABASE_SUPABASE_ANON_KEY
```

## Next Steps

1. **Add More Languages**: Follow "Adding New Languages" section
2. **Customize Translations**: Update JSON files in `src/i18n/locales/`
3. **Configure Currencies**: Set up currency mappings for your regions
4. **Add Content**: Expand translation namespaces for your application
5. **Test RTL**: Verify Arabic and other RTL layouts
6. **Monitor Performance**: Track translation loading and caching

## Support Resources

- [i18next Documentation](https://www.i18next.com/)
- [React i18next Guide](https://react.i18next.com/)
- [date-fns Documentation](https://date-fns.org/)
- [Supabase Docs](https://supabase.com/docs)
- [MDN: Internationalization](https://developer.mozilla.org/en-US/docs/Glossary/Internationalization_and_localization)

## File Reference

| File | Purpose |
|------|---------|
| `src/i18n/config.js` | i18next configuration and setup |
| `src/i18n/localeDetector.js` | Locale detection and management |
| `src/i18n/supabaseTranslations.js` | Database integration for translations |
| `src/i18n/formatters/*.js` | Formatting utilities for numbers, dates, currency |
| `src/i18n/hooks/*.jsx` | React hooks for locale-aware components |
| `src/i18n/context/*.jsx` | React context for locale state management |
| `src/i18n/rtl/*.js` | RTL layout utilities and styles |
| `src/components/LanguageSwitcher.jsx` | Language selection component |
| `I18N_GUIDE.md` | Comprehensive i18n documentation |
| `IMPLEMENTATION_SAMPLES.md` | Code examples and patterns |

## Questions?

Refer to:
1. `I18N_GUIDE.md` for detailed explanations
2. `IMPLEMENTATION_SAMPLES.md` for code examples
3. Console warnings and errors for debugging
4. Official documentation links in resources section
