'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getLanguageFromCountry, isRTL } from './country-map';

// UI locale files
import en from './locales/en.json';

// Content files — English (other languages loaded dynamically below)
import affirmationsEn from './content/affirmations/en.json';
import dailyTipsEn from './content/daily-tips/en.json';
import quickTopicsEn from './content/quick-topics/en.json';
import guidedJourneysEn from './content/guided-journeys/en.json';

// Lazy-load non-English locales to avoid bundling everything upfront
const localeLoaders = {
  en: () => Promise.resolve(en),
  de: () => import('./locales/de.json').then(m => m.default),
  fr: () => import('./locales/fr.json').then(m => m.default),
  es: () => import('./locales/es.json').then(m => m.default),
  it: () => import('./locales/it.json').then(m => m.default),
  nl: () => import('./locales/nl.json').then(m => m.default),
  pt: () => import('./locales/pt.json').then(m => m.default),
  tr: () => import('./locales/tr.json').then(m => m.default),
  ar: () => import('./locales/ar.json').then(m => m.default),
  ja: () => import('./locales/ja.json').then(m => m.default),
  ko: () => import('./locales/ko.json').then(m => m.default),
};

const contentLoaders = {
  affirmations: {
    en: () => Promise.resolve(affirmationsEn),
    de: () => import('./content/affirmations/de.json').then(m => m.default),
    fr: () => import('./content/affirmations/fr.json').then(m => m.default),
    es: () => import('./content/affirmations/es.json').then(m => m.default),
    it: () => import('./content/affirmations/it.json').then(m => m.default),
    nl: () => import('./content/affirmations/nl.json').then(m => m.default),
    pt: () => import('./content/affirmations/pt.json').then(m => m.default),
    tr: () => import('./content/affirmations/tr.json').then(m => m.default),
    ar: () => import('./content/affirmations/ar.json').then(m => m.default),
    ja: () => import('./content/affirmations/ja.json').then(m => m.default),
    ko: () => import('./content/affirmations/ko.json').then(m => m.default),
  },
  dailyTips: {
    en: () => Promise.resolve(dailyTipsEn),
    de: () => import('./content/daily-tips/de.json').then(m => m.default),
    fr: () => import('./content/daily-tips/fr.json').then(m => m.default),
    es: () => import('./content/daily-tips/es.json').then(m => m.default),
    it: () => import('./content/daily-tips/it.json').then(m => m.default),
    nl: () => import('./content/daily-tips/nl.json').then(m => m.default),
    pt: () => import('./content/daily-tips/pt.json').then(m => m.default),
    tr: () => import('./content/daily-tips/tr.json').then(m => m.default),
    ar: () => import('./content/daily-tips/ar.json').then(m => m.default),
    ja: () => import('./content/daily-tips/ja.json').then(m => m.default),
    ko: () => import('./content/daily-tips/ko.json').then(m => m.default),
  },
  quickTopics: {
    en: () => Promise.resolve(quickTopicsEn),
    de: () => import('./content/quick-topics/de.json').then(m => m.default),
    fr: () => import('./content/quick-topics/fr.json').then(m => m.default),
    es: () => import('./content/quick-topics/es.json').then(m => m.default),
    it: () => import('./content/quick-topics/it.json').then(m => m.default),
    nl: () => import('./content/quick-topics/nl.json').then(m => m.default),
    pt: () => import('./content/quick-topics/pt.json').then(m => m.default),
    tr: () => import('./content/quick-topics/tr.json').then(m => m.default),
    ar: () => import('./content/quick-topics/ar.json').then(m => m.default),
    ja: () => import('./content/quick-topics/ja.json').then(m => m.default),
    ko: () => import('./content/quick-topics/ko.json').then(m => m.default),
  },
  guidedJourneys: {
    en: () => Promise.resolve(guidedJourneysEn),
    de: () => import('./content/guided-journeys/de.json').then(m => m.default),
    fr: () => import('./content/guided-journeys/fr.json').then(m => m.default),
    es: () => import('./content/guided-journeys/es.json').then(m => m.default),
    it: () => import('./content/guided-journeys/it.json').then(m => m.default),
    nl: () => import('./content/guided-journeys/nl.json').then(m => m.default),
    pt: () => import('./content/guided-journeys/pt.json').then(m => m.default),
    tr: () => import('./content/guided-journeys/tr.json').then(m => m.default),
    ar: () => import('./content/guided-journeys/ar.json').then(m => m.default),
    ja: () => import('./content/guided-journeys/ja.json').then(m => m.default),
    ko: () => import('./content/guided-journeys/ko.json').then(m => m.default),
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children, country }) {
  const [lang, setLang] = useState(() => getLanguageFromCountry(country));
  const [locale, setLocale] = useState(en);
  const [content, setContent] = useState({
    affirmations: affirmationsEn,
    dailyTips: dailyTipsEn,
    quickTopics: quickTopicsEn,
    guidedJourneys: guidedJourneysEn,
  });

  // Update language when country changes
  useEffect(() => {
    setLang(getLanguageFromCountry(country));
  }, [country]);

  // Load locale + content when language changes
  useEffect(() => {
    let cancelled = false;

    async function loadLocale() {
      if (lang === 'en') {
        setLocale(en);
        setContent({
          affirmations: affirmationsEn,
          dailyTips: dailyTipsEn,
          quickTopics: quickTopicsEn,
          guidedJourneys: guidedJourneysEn,
        });
        return;
      }

      const loader = localeLoaders[lang];
      if (!loader) return;

      try {
        const [uiStrings, affirmations, dailyTips, quickTopics, guidedJourneys] = await Promise.all([
          loader(),
          contentLoaders.affirmations[lang]?.() ?? Promise.resolve(affirmationsEn),
          contentLoaders.dailyTips[lang]?.() ?? Promise.resolve(dailyTipsEn),
          contentLoaders.quickTopics[lang]?.() ?? Promise.resolve(quickTopicsEn),
          contentLoaders.guidedJourneys[lang]?.() ?? Promise.resolve(guidedJourneysEn),
        ]);

        if (!cancelled) {
          setLocale(uiStrings);
          setContent({ affirmations, dailyTips, quickTopics, guidedJourneys });
        }
      } catch {
        // Fallback to English on load failure
        if (!cancelled) {
          setLocale(en);
          setContent({
            affirmations: affirmationsEn,
            dailyTips: dailyTipsEn,
            quickTopics: quickTopicsEn,
            guidedJourneys: guidedJourneysEn,
          });
        }
      }
    }

    loadLocale();
    return () => { cancelled = true; };
  }, [lang]);

  // Set document direction and lang attribute
  useEffect(() => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Translation function with interpolation
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = locale;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // Fallback to English
    if (value === undefined) {
      value = en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }

    if (value === undefined) return key;
    if (typeof value !== 'string') return value;

    // Interpolate {param} placeholders
    return value.replace(/\{(\w+)\}/g, (_, param) =>
      params[param] !== undefined ? params[param] : `{${param}}`
    );
  }, [locale]);

  // Pluralized translation
  const tp = useCallback((key, count, params = {}) => {
    const pluralKey = count === 1 ? key : `${key}_plural`;
    return t(pluralKey, { ...params, count });
  }, [t]);

  // Get content arrays for current language
  const getContent = useCallback((contentType) => {
    return content[contentType] || null;
  }, [content]);

  const rtl = useMemo(() => isRTL(lang), [lang]);

  const value = useMemo(() => ({
    t, tp, lang, setLang, isRTL: rtl, getContent,
  }), [t, tp, lang, rtl, getContent]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

export { getLanguageFromCountry, isRTL } from './country-map';
