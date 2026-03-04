'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase-browser';

const GREEN = '#22C55E', GREEN_DARK = '#16A34A', BLUE = '#3B82F6', BG = '#F2F8F5';
const CARD_BG = '#FFFFFF', TEXT_DARK = '#1A2E23', TEXT_MID = '#3D6B50', TEXT_LIGHT = '#6B9A7E';
const BORDER = '#D5E8DC';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    border: `2px solid ${BORDER}`, fontSize: 15, color: TEXT_DARK, background: '#FAFDF7',
    borderRadius: 14, padding: '12px 16px', width: '100%', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 4, fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>Welcome back, mama!</h2>
          <p style={{ fontSize: 14, color: TEXT_MID, textAlign: 'center', marginBottom: 24 }}>Sign in to your space</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin}>
            <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required style={{ ...inputStyle, marginBottom: 14 }} />

            <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Your password" required style={{ ...inputStyle, marginBottom: 20 }} />

            <button type="submit" disabled={loading} style={{
              width: '100%', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF',
              border: 'none', borderRadius: 16, padding: '14px', fontSize: 16, fontWeight: 700,
              cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 4px 16px rgba(34,197,94,0.3)', opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 12, color: TEXT_LIGHT, fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={loading} style={{
            width: '100%', background: CARD_BG, color: TEXT_DARK, border: `2px solid ${BORDER}`,
            borderRadius: 16, padding: '12px', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: TEXT_MID }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: GREEN_DARK, fontWeight: 700, textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
