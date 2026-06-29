'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase-browser';
import { useTranslation } from '../../i18n';

const GREEN = '#1E90E8', GREEN_DARK = '#5A1690', BLUE = '#7A1FB0', BG = '#F3EFFB';
const CARD_BG = '#FFFFFF', TEXT_DARK = '#1B0B3B', TEXT_MID = '#5A1690', TEXT_LIGHT = '#6E5C8A';
const BORDER = '#E2D5F3';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const inputStyle = {
    border: `2px solid ${BORDER}`, fontSize: 15, color: TEXT_DARK, background: '#FBFAFE',
    borderRadius: 14, padding: '12px 16px', width: '100%', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Archivo+Black&display=swap');
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box} input:focus{outline:none;border-color:${GREEN}!important}
      `}</style>

      <div style={{ maxWidth: 400, width: '100%', animation: 'fadeSlideIn 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, margin: '0 auto 10px' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, color: GREEN, letterSpacing: 2 }}>Momz</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic', fontSize: 32, color: BLUE, letterSpacing: 2 }}>Veda</span>
          </div>
          <div style={{ width: 80, height: 1.5, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, opacity: 0.4, margin: '10px auto 0' }} />
          <p style={{ fontSize: 12, color: TEXT_LIGHT, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, fontWeight: 500 }}>
            Your Mom Friend. Always Here.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: CARD_BG, borderRadius: 24, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: `1px solid ${BORDER}` }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 4, fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>{t('login.title')}</h1>
          <p style={{ fontSize: 14, color: TEXT_MID, textAlign: 'center', marginBottom: 24 }}>{t('login.subtitle')}</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>{t('login.emailLabel')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')} required style={{ ...inputStyle, marginBottom: 14 }} />

            <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>{t('login.passwordLabel')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')} required style={{ ...inputStyle, marginBottom: 20 }} />

            <button type="submit" disabled={loading} style={{
              width: '100%', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF',
              border: 'none', borderRadius: 16, padding: '14px', fontSize: 16, fontWeight: 700,
              cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 4px 16px rgba(30,144,232,0.3)', opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}>
              {loading ? t('login.submitting') : t('login.submitButton')}
            </button>
          </form>

        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: TEXT_MID }}>
          {t('login.noAccount')}{' '}
          <a href="/signup" style={{ color: GREEN_DARK, fontWeight: 700, textDecoration: 'none' }}>{t('login.signUpLink')}</a>
        </p>
      </div>
    </main>
  );
}
