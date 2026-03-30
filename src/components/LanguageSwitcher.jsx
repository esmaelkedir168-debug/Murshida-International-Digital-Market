import { useLocale } from '../i18n/hooks/useLocale.jsx';
import { SUPPORTED_LOCALES } from '../i18n/localeDetector.js';
import '../styles/LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-switcher">
      <label htmlFor="locale-select" className="language-switcher__label">
        Language
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="language-switcher__select"
      >
        {Object.entries(SUPPORTED_LOCALES).map(([code, config]) => (
          <option key={code} value={code}>
            {config.flag} {config.name}
          </option>
        ))}
      </select>
    </div>
  );
};
