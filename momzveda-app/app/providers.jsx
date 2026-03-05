'use client';

import { useState, useEffect } from 'react';
import { I18nProvider } from '../i18n';

export default function ClientProviders({ children }) {
  const [country, setCountry] = useState('');

  useEffect(() => {
    // Read country from localStorage
    try {
      const profile = JSON.parse(localStorage.getItem('momzveda_momProfile'));
      if (profile?.country) setCountry(profile.country);
    } catch {}

    // Listen for profile updates (dispatched on onboarding or country change)
    const handler = (e) => setCountry(e.detail.country);
    window.addEventListener('momzveda:profileUpdate', handler);
    return () => window.removeEventListener('momzveda:profileUpdate', handler);
  }, []);

  return (
    <I18nProvider country={country}>
      {children}
    </I18nProvider>
  );
}
