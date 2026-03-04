'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase-browser';

const GREEN = '#22C55E', GREEN_DARK = '#16A34A', BLUE = '#3B82F6', BG = '#F2F8F5';
const CARD_BG = '#FFFFFF', TEXT_DARK = '#1A2E23', TEXT_MID = '#3D6B50', TEXT_LIGHT = '#6B9A7E';
const BORDER = '#D5E8DC';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 4, fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>Join the village!</h2>
          <p style={{ fontSize: 14, color: TEXT_MID, textAlign: 'center', marginBottom: 24 }}>Create your account to get started</p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>Check your email!</h3>
              <p style={{ fontSize: 14, color: TEXT_MID, lineHeight: 1.6 }}>
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account and start chatting!
              </p>
              <a href="/login" style={{
                display: 'inline-block', marginTop: 20, color: GREEN_DARK, fontWeight: 700,
                fontSize: 14, textDecoration: 'none',
              }}>Back to login</a>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSignup}>
                <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required style={{ ...inputStyle, marginBottom: 14 }} />

                <label style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6, display: 'block' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters" required minLength={6} style={{ ...inputStyle, marginBottom: 20 }} />

                <button type="submit" disabled={loading} style={{
                  width: '100%', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: '#FFF',
                  border: 'none', borderRadius: 16, padding: '14px', fontSize: 16, fontWeight: 700,
                  cursor: loading ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif",
                  boxShadow: '0 4px 16px rgba(34,197,94,0.3)', opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

            </>
          )}
        </div>

        {/* Login link */}
        {!success && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: TEXT_MID }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: GREEN_DARK, fontWeight: 700, textDecoration: 'none' }}>Sign in</a>
          </p>
        )}
      </div>
    </div>
  );
}
