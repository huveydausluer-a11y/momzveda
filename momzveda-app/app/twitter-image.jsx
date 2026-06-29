import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MomzVeda — Your Mom Friend. Always Here.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1B0B3B 0%, #2A0F52 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#1E90E8', letterSpacing: 3 }}>
            Momz
          </span>
          <span style={{ fontSize: 68, fontStyle: 'italic', color: '#7A1FB0', letterSpacing: 3 }}>
            Veda
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Your Mom Friend. Always Here.
        </div>
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 32,
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          AI-powered parenting support, emotional encouragement, recipes & daily affirmations
        </div>
      </div>
    ),
    { ...size }
  );
}
