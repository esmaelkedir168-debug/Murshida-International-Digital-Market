import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const translationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchTranslations = async (locale, namespace = 'common') => {
  const cacheKey = `${locale}:${namespace}`;
  const cached = translationCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const { data: namespaceData, error: nsError } = await supabase
      .from('translation_namespaces')
      .select('id')
      .eq('name', namespace)
      .maybeSingle();

    if (nsError || !namespaceData) {
      console.warn(`Namespace ${namespace} not found`);
      return {};
    }

    const { data: localeData, error: locError } = await supabase
      .from('locales')
      .select('id')
      .eq('code', locale)
      .maybeSingle();

    if (locError || !localeData) {
      console.warn(`Locale ${locale} not found`);
      return {};
    }

    const { data: translations, error } = await supabase
      .from('translations')
      .select('translation_keys(key), value')
      .eq('key_id.namespace_id', namespaceData.id)
      .eq('locale_id', localeData.id);

    if (error) {
      console.error('Error fetching translations:', error);
      return {};
    }

    const result = {};
    translations?.forEach(({ translation_keys: { key }, value }) => {
      result[key] = value;
    });

    translationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return {};
  }
};

export const clearTranslationCache = () => {
  translationCache.clear();
};

export const addTranslation = async (locale, namespace, key, value) => {
  try {
    const { data: namespaceData } = await supabase
      .from('translation_namespaces')
      .select('id')
      .eq('name', namespace)
      .maybeSingle();

    const { data: localeData } = await supabase
      .from('locales')
      .select('id')
      .eq('code', locale)
      .maybeSingle();

    if (!namespaceData || !localeData) {
      throw new Error('Namespace or locale not found');
    }

    let keyData = await supabase
      .from('translation_keys')
      .select('id')
      .eq('namespace_id', namespaceData.id)
      .eq('key', key)
      .maybeSingle();

    if (!keyData.data) {
      const { data: newKey, error: keyError } = await supabase
        .from('translation_keys')
        .insert({
          namespace_id: namespaceData.id,
          key,
        })
        .select('id')
        .single();

      if (keyError) throw keyError;
      keyData.data = newKey;
    }

    await supabase
      .from('translations')
      .upsert({
        key_id: keyData.data.id,
        locale_id: localeData.id,
        value,
      });

    clearTranslationCache();
  } catch (error) {
    console.error('Error adding translation:', error);
    throw error;
  }
};
