import './globals.css';
import ClientProviders from './providers';

export const metadata = {
  title: 'MomzVeda — Your Mom Friend. Always Here.',
  description: 'MomzVeda is an AI-powered supportive mom friend. Get emotional support, parenting tips, quick recipes, and daily affirmations — all in one warm, chat-based experience.',
  keywords: 'parenting, mom support, recipes, parenting tips, affirmations, mom friend, AI chat',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MomzVeda',
  },
  verification: {
    google: '8vBQo-TCP5Y_pmjcgTM6HznlNpod6frZzSduw_3zKg4',
  },
  openGraph: {
    title: 'MomzVeda — Your Mom Friend. Always Here.',
    description: 'An AI-powered supportive mom friend for emotional support, parenting tips, recipes, and daily affirmations.',
    url: 'https://www.momzveda.com',
    siteName: 'MomzVeda',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomzVeda — Your Mom Friend. Always Here.',
    description: 'An AI-powered supportive mom friend for emotional support, parenting tips, recipes, and daily affirmations.',
  },
  metadataBase: new URL('https://www.momzveda.com'),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1B0B3B',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Archivo+Black&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MomzVeda" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MomzVeda" />
        <meta name="msapplication-TileColor" content="#1B0B3B" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'MomzVeda',
                  url: 'https://www.momzveda.com',
                  description: 'AI-powered supportive mom friend for emotional support, parenting tips, recipes, and daily affirmations.',
                },
                {
                  '@type': 'WebApplication',
                  name: 'MomzVeda',
                  url: 'https://www.momzveda.com',
                  applicationCategory: 'LifestyleApplication',
                  operatingSystem: 'Any',
                  offers: {
                    '@type': 'Offer',
                    price: '6.99',
                    priceCurrency: 'EUR',
                    description: 'Monthly premium subscription',
                  },
                  description: 'An AI-powered supportive mom friend. Get emotional support, parenting tips, quick recipes, and daily affirmations.',
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('MomzVeda SW registered:', reg.scope); })
                    .catch(function(err) { console.log('MomzVeda SW failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
