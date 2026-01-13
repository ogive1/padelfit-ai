# PadelFit AI

AI-powered injury prevention platform for padel players. Generates $1000+/month in passive income through subscriptions and affiliate revenue.

## Quick Start

Run the setup script:

```bash
./setup.sh
```

This will:
1. Check prerequisites (Node.js, npm, Git)
2. Guide you through creating accounts on Supabase, Stripe, OpenAI, and Resend
3. Install dependencies
4. Set up the database
5. Create Stripe products
6. Generate initial content (50+ exercises, 20 blog posts)
7. Deploy to Vercel

## Features

- **AI Warm-up Generator** - Personalized warm-up routines based on injury history
- **Injury Risk Quiz** - Assess injury risk and get recommendations
- **Exercise Library** - 50+ physiotherapist-approved exercises
- **AI Coach Chat** - Get instant answers to injury prevention questions
- **Blog** - SEO-optimized content for organic traffic
- **Email Automation** - Automated sequences to convert free users to paid
- **Social Media Automation** - Daily posts generated and scheduled automatically

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Email**: Resend
- **Hosting**: Vercel

## Revenue Model

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Basic warm-up, injury quiz, limited exercises |
| Pro | $12/month | Full exercise library, personalized plans, AI coaching |
| Elite | $29/month | Everything + video analysis, priority support |

**Path to $1,000/month:**
- 50 Pro subscribers × $12 = $600
- 15 Elite subscribers × $29 = $435
- Affiliate revenue = ~$100/month

## Project Structure

```
padelfit-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Public pages (landing, pricing, blog)
│   │   ├── (app)/              # Protected app pages (dashboard)
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # UI primitives
│   │   ├── marketing/          # Marketing components
│   │   └── app/                # App components
│   └── lib/                    # Utilities
│       ├── supabase/           # Supabase client
│       ├── stripe/             # Stripe integration
│       ├── ai/                 # OpenAI integration
│       └── email/              # Email templates
├── scripts/                    # Setup and automation scripts
├── .github/workflows/          # GitHub Actions
└── content/                    # Generated content
```

## Scripts

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for production
npm run start         # Start production server

# Database
npm run db:setup      # Set up database schema

# Stripe
npm run stripe:setup  # Create Stripe products

# Content Generation
npm run content:generate       # Generate all content
npm run content:generate-blog  # Generate blog posts
npm run content:generate-social # Generate social media posts

# Email
npm run email:process # Process email sequences

# Social Media
npm run social:post   # Post scheduled content
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ELITE_PRICE_ID=

# OpenAI
OPENAI_API_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=
```

## Automation

GitHub Actions workflows handle:

- **Daily Content** (`daily-content.yml`):
  - Generates social media posts
  - Generates weekly blog posts (Mondays)
  - Posts to social media
  - Processes email sequences

- **Deploy** (`deploy.yml`):
  - Builds and deploys on push to main

## Stripe Webhooks

Set up webhooks in Stripe Dashboard:

**Endpoint**: `https://yourdomain.com/api/webhooks/stripe`

**Events**:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Monthly Costs

| Service | Cost |
|---------|------|
| Vercel | $0-20 |
| Supabase | $0-25 |
| OpenAI | ~$20-30 |
| Resend | $0 |
| Domain | ~$12/year |
| **Total** | **$40-90/month** |

## Timeline to $1,000/Month

| Month | Milestone | Expected Revenue |
|-------|-----------|------------------|
| 1-2 | Launch, content, SEO | $0-50 |
| 3-4 | SEO traffic starts | $100-300 |
| 5-6 | Growing traffic | $400-700 |
| 7-8 | Optimization | $700-1,000 |
| 9+ | Passive mode | $1,000+ |

## Support

For issues or questions:
- Create an issue in this repository
- Email: support@padelfit.ai

## License

MIT License - feel free to use this as a template for your own projects.
