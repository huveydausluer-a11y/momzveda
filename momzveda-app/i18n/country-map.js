// Country name → BCP 47 language code mapping
const COUNTRY_TO_LANGUAGE = {
  // English
  'United States': 'en',
  'United Kingdom': 'en',
  'Canada': 'en',
  'Australia': 'en',
  'New Zealand': 'en',
  'Ireland': 'en',
  'South Africa': 'en',
  'Nigeria': 'en',
  'Kenya': 'en',
  'Philippines': 'en',
  'Singapore': 'en',
  'India': 'en',

  // German
  'Germany': 'de',
  'Austria': 'de',
  'Switzerland': 'de',

  // French
  'France': 'fr',
  'Belgium': 'fr',

  // Spanish
  'Spain': 'es',
  'Mexico': 'es',
  'Colombia': 'es',
  'Argentina': 'es',
  'Chile': 'es',
  'Peru': 'es',

  // Italian
  'Italy': 'it',

  // Dutch
  'Netherlands': 'nl',

  // Portuguese
  'Portugal': 'pt',
  'Brazil': 'pt',

  // Turkish
  'Turkey': 'tr',

  // Arabic
  'Egypt': 'ar',
  'Morocco': 'ar',
  'Saudi Arabia': 'ar',
  'UAE': 'ar',

  // Japanese
  'Japan': 'ja',

  // Korean
  'South Korea': 'ko',

  // Countries with unsupported languages → English
  'Sweden': 'en',
  'Norway': 'en',
  'Denmark': 'en',
  'Finland': 'en',
  'Poland': 'en',
  'Pakistan': 'en',
  'Bangladesh': 'en',
  'Thailand': 'en',
  'Vietnam': 'en',
  'Malaysia': 'en',
  'Indonesia': 'en',
  'Israel': 'en',
  'Greece': 'en',
  'Czech Republic': 'en',
  'Romania': 'en',
  'Other': 'en',
};

const RTL_LANGUAGES = ['ar'];

export function getLanguageFromCountry(country) {
  return COUNTRY_TO_LANGUAGE[country] || 'en';
}

export function isRTL(lang) {
  return RTL_LANGUAGES.includes(lang);
}
