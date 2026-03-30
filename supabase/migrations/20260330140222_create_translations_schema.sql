/*
  # Create Translations Management Schema

  1. New Tables
    - `locales` - Stores supported languages and regional settings
    - `translation_keys` - Stores translation key hierarchies
    - `translations` - Stores translated content in different languages
    - `translation_namespaces` - Organizes translations into logical groups

  2. Features
    - Support for multiple languages and locales
    - RTL language detection
    - Translation versioning and metadata
    - Namespace-based organization for scalability

  3. Security
    - Enable RLS on all tables
    - Allow public read access for translations
    - Restrict write access to authenticated admin users

  4. Important Notes
    - Locales include both language code and region (e.g., en-US, ar-SA)
    - Each locale has RTL flag for layout direction
    - Translation keys use hierarchical naming (e.g., "products.title", "checkout.payment.method")
    - Supports fallback chain (e.g., ar-EG → ar → en)
*/

-- Create locales table
CREATE TABLE IF NOT EXISTS locales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  native_name text NOT NULL,
  is_rtl boolean DEFAULT false,
  is_active boolean DEFAULT true,
  flag_emoji text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create translation namespaces table
CREATE TABLE IF NOT EXISTS translation_namespaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create translation keys table
CREATE TABLE IF NOT EXISTS translation_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace_id uuid NOT NULL REFERENCES translation_namespaces(id) ON DELETE CASCADE,
  key text NOT NULL,
  description text,
  requires_interpolation boolean DEFAULT false,
  plural_form boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(namespace_id, key)
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  locale_id uuid NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  value text NOT NULL,
  is_complete boolean DEFAULT true,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(key_id, locale_id)
);

-- Create indices for performance
CREATE INDEX idx_translation_keys_namespace ON translation_keys(namespace_id);
CREATE INDEX idx_translations_locale ON translations(locale_id);
CREATE INDEX idx_translations_key ON translations(key_id);
CREATE INDEX idx_locales_active ON locales(is_active);

-- Enable RLS
ALTER TABLE locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_namespaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for active locales
CREATE POLICY "Public read active locales"
  ON locales FOR SELECT
  USING (is_active = true);

-- RLS Policies: Public read access for translation namespaces
CREATE POLICY "Public read translation namespaces"
  ON translation_namespaces FOR SELECT
  USING (true);

-- RLS Policies: Public read access for translation keys
CREATE POLICY "Public read translation keys"
  ON translation_keys FOR SELECT
  USING (true);

-- RLS Policies: Public read access for translations
CREATE POLICY "Public read translations"
  ON translations FOR SELECT
  USING (true);

-- Insert default locales
INSERT INTO locales (code, name, native_name, is_rtl, flag_emoji, sort_order) VALUES
  ('en-US', 'English (US)', 'English', false, '🇺🇸', 0),
  ('ar-SA', 'Arabic (Saudi Arabia)', 'العربية', true, '🇸🇦', 1),
  ('es-ES', 'Spanish (Spain)', 'Español', false, '🇪🇸', 2),
  ('fr-FR', 'French (France)', 'Français', false, '🇫🇷', 3),
  ('de-DE', 'German (Germany)', 'Deutsch', false, '🇩🇪', 4),
  ('ja-JP', 'Japanese (Japan)', '日本語', false, '🇯🇵', 5);

-- Insert translation namespaces
INSERT INTO translation_namespaces (name, description, sort_order) VALUES
  ('common', 'Common UI elements and messages', 0),
  ('products', 'Product-related text', 1),
  ('checkout', 'Checkout process text', 2),
  ('errors', 'Error messages', 3),
  ('emails', 'Email templates', 4);
