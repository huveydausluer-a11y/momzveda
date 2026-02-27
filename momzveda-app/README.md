# 🐻 MomzVeda — Your Mom Friend. Always Here.

An AI-powered supportive mom friend platform built with Next.js and Anthropic's Claude AI.

---

## 🚀 Deployment Guide (Step by Step)

### Step 1: Get Your API Key
1. Go to **https://console.anthropic.com**
2. Sign up / log in
3. Go to **API Keys** and create a new key
4. Copy the key — you'll need it in Step 4

### Step 2: Push to GitHub
1. Create a GitHub account at **https://github.com** (if you don't have one)
2. Click **"New Repository"** → name it `momzveda` → make it **Private** → click **Create**
3. On your computer, open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial MomzVeda launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/momzveda.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Import your `momzveda` repository
4. In the **Environment Variables** section, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** *(paste your API key from Step 1)*
5. Click **Deploy** — wait ~1 minute for it to build
6. Your app is now live at `momzveda.vercel.app` 🎉

### Step 4: Connect Your Domain
1. Buy **momzveda.com** from Namecheap, Cloudflare, or GoDaddy
2. In Vercel, go to **Project Settings → Domains**
3. Add `momzveda.com`
4. Vercel will show you DNS records — add them at your domain registrar:
   - Usually an **A record** pointing to `76.76.21.21`
   - And a **CNAME** for `www` pointing to `cname.vercel-dns.com`
5. Wait 5–30 minutes for DNS to propagate
6. Vercel automatically sets up HTTPS ✅

### Step 5: You're Live! 🎉
Visit **https://momzveda.com** — your app is running!

---

## 📁 Project Structure

```
momzveda/
├── app/
│   ├── layout.jsx          # Root layout, fonts, SEO meta tags
│   ├── page.jsx            # Main chat app (MomzVeda UI)
│   ├── globals.css          # Global styles
│   ├── api/
│   │   └── chat/
│   │       └── route.js     # Backend API (secure Anthropic calls)
│   ├── privacy/
│   │   └── page.jsx         # Privacy policy page
│   └── terms/
│       └── page.jsx         # Terms of service page
├── public/                  # Static assets (add your favicon here)
├── .env.local              # Your API key (NEVER commit this)
├── .gitignore              # Keeps secrets out of GitHub
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🔒 Security Features
- **API key is server-side only** — never exposed to users
- **Rate limiting** — 15 requests per minute per user
- **Input validation** — messages are validated before processing
- **Conversation trimming** — only last 20 messages sent to control costs

---

## 💰 Cost Estimates
- **Vercel hosting:** Free (Hobby plan covers most startups)
- **Domain:** ~$10–15/year
- **Anthropic API:** ~$0.003–0.015 per conversation turn (Claude Sonnet)
- **Estimated monthly cost at 1,000 daily users:** ~$50–150/month

---

## 🛠 Local Development

```bash
npm install
# Add your API key to .env.local
npm run dev
# Open http://localhost:3000
```

---

Built with 💚 for moms everywhere.
