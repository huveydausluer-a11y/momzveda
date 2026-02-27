# MomzVeda — Setup Guide for Coworkers

## What is this?
MomzVeda is an AI-powered parenting companion app built with Next.js 14, powered by Claude (Anthropic), with Stripe payments.

## Project Structure
```
momzveda/
├── app/                    # Main application code
│   ├── api/
│   │   ├── chat/route.js   # AI chat endpoint (Claude API)
│   │   └── stripe/         # Payment endpoints
│   │       ├── checkout/   # Creates Stripe checkout session
│   │       ├── webhook/    # Handles Stripe events
│   │       └── status/     # Checks subscription status
│   ├── layout.jsx          # App layout + PWA config
│   ├── page.jsx            # Main app (onboarding, chat, guides, kids, wins)
│   ├── privacy/            # Privacy policy page
│   └── terms/              # Terms of service page
├── public/                 # Static files
│   ├── icons/              # App icons (SVG)
│   ├── manifest.json       # PWA manifest
│   ├── offline.html        # Offline fallback page
│   └── sw.js               # Service worker
├── .env.example            # Environment variables template
├── package.json            # Dependencies
└── next.config.js          # Next.js configuration
```

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in the keys:
```bash
cp .env.example .env.local
```

Ask the project owner for the actual API keys. NEVER commit `.env.local` to Git.

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel
- Push to GitHub
- Import in Vercel
- Add environment variables in Vercel dashboard
- Deploy

## Environment Variables (ask project owner for values)
- `ANTHROPIC_API_KEY` — Powers the AI chat
- `STRIPE_SECRET_KEY` — Stripe payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe client key
- `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` — Monthly subscription price ID
- `NEXT_PUBLIC_STRIPE_PRICE_YEARLY` — Yearly subscription price ID
- `NEXT_PUBLIC_APP_URL` — Production URL

## Key Features
- 5-step onboarding flow (name, age, country, children, challenges, support system)
- AI chat powered by 10 parenting expert pillars
- 8 quick topic buttons
- Guided Journeys (premium)
- Kids profiles management
- Mom Wins tracker
- Emergency resources (crisis hotlines)
- PWA (installable on phone)
- Freemium model: 5 free messages/day, premium with 30-day free trial
- Stripe integration (€9.99/month or €69.99/year)

## Security Notes
- NEVER share or commit API keys
- `.env.local` is in `.gitignore` and will not be uploaded
- Stripe webhook secret should be set after creating the webhook endpoint
