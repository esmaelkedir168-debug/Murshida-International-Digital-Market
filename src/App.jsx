import { useTranslation } from 'react-i18next';
import { LocaleProvider } from './i18n/context/LocaleProvider.jsx';
import { useLocale } from './i18n/hooks/useLocale.jsx';
import { useFormatting } from './i18n/hooks/useFormatting.jsx';
import { useDirection } from './i18n/hooks/useDirection.jsx';
import { LanguageSwitcher } from './components/LanguageSwitcher.jsx';
import './styles/App.css';
import './i18n/rtl/rtlStyles.css';

const AppContent = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { direction } = useDirection();
  const formatting = useFormatting();

  const productPrice = 99.99;
  const taxRate = 0.15;
  const now = new Date();

  return (
    <div className="app" dir={direction}>
      <header className="app-header">
        <h1 className="app-title">Murshida International</h1>
        <LanguageSwitcher />
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>{t('products.title')}</h2>

          <div className="product-card">
            <h3>{t('products.featured')}</h3>

            <div className="product-details">
              <p className="product-label">{t('products.price')}:</p>
              <p className="product-value">
                {formatting.formatCurrency(productPrice)}
              </p>
            </div>

            <div className="product-details">
              <p className="product-label">{t('checkout.tax')}:</p>
              <p className="product-value">
                {formatting.formatPercent(taxRate)}
              </p>
            </div>

            <div className="product-details">
              <p className="product-label">{t('products.quantity')}:</p>
              <p className="product-value">
                {formatting.formatQuantity(42)}
              </p>
            </div>

            <button className="product-button">
              {t('products.add_to_cart')}
            </button>
          </div>

          <div className="checkout-section">
            <h2>{t('checkout.title')}</h2>

            <div className="checkout-details">
              <div className="checkout-item">
                <span>{t('checkout.subtotal')}:</span>
                <span>{formatting.formatCurrency(productPrice)}</span>
              </div>

              <div className="checkout-item">
                <span>{t('checkout.tax')}:</span>
                <span>
                  {formatting.formatCurrency(productPrice * taxRate)}
                </span>
              </div>

              <div className="checkout-item checkout-item--total">
                <span>{t('checkout.total')}:</span>
                <span>
                  {formatting.formatCurrency(
                    productPrice + productPrice * taxRate
                  )}
                </span>
              </div>

              <button className="checkout-button">
                {t('checkout.complete_purchase')}
              </button>
            </div>
          </div>

          <div className="datetime-section">
            <h2>Date & Time Examples</h2>

            <div className="datetime-item">
              <span>Formatted Date:</span>
              <span>{formatting.formatDate(now)}</span>
            </div>

            <div className="datetime-item">
              <span>Date & Time:</span>
              <span>{formatting.formatDateTime(now)}</span>
            </div>

            <div className="datetime-item">
              <span>Relative Time:</span>
              <span>
                {formatting.formatDate(
                  new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                )}
              </span>
            </div>
          </div>

          <div className="number-section">
            <h2>Number Formatting Examples</h2>

            <div className="number-item">
              <span>Large Number:</span>
              <span>{formatting.formatNumber(1234567.89)}</span>
            </div>

            <div className="number-item">
              <span>File Size:</span>
              <span>{formatting.formatFileSize(1048576)}</span>
            </div>

            <div className="number-item">
              <span>Percentage:</span>
              <span>{formatting.formatPercent(0.856, 2)}</span>
            </div>
          </div>

          <div className="info-box">
            <p>
              Current Locale: <strong>{locale}</strong>
            </p>
            <p>
              Text Direction: <strong>{direction.toUpperCase()}</strong>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  );
}
