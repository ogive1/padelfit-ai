#!/bin/bash

#############################################
#                                           #
#        PadelFit AI - Setup Script         #
#                                           #
#  One-command setup for your AI-powered    #
#  padel injury prevention business         #
#                                           #
#############################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print banner
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           🎾 PadelFit AI - Setup Wizard 🎾                    ║"
echo "║                                                               ║"
echo "║    AI-Powered Injury Prevention for Padel Players            ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if running from project directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: Please run this script from the padelfit-ai directory${NC}"
  exit 1
fi

# Function to check command existence
check_command() {
  if ! command -v $1 &> /dev/null; then
    return 1
  fi
  return 0
}

# Function to open URL in browser
open_url() {
  local url=$1
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$url"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$url" 2>/dev/null || echo "Please open: $url"
  else
    echo "Please open: $url"
  fi
}

# Function to prompt for input with default
prompt_with_default() {
  local prompt=$1
  local default=$2
  local var_name=$3

  read -p "$prompt [$default]: " value
  value=${value:-$default}
  eval "$var_name='$value'"
}

echo -e "${CYAN}Step 1: Checking Prerequisites${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if check_command node; then
  NODE_VERSION=$(node -v)
  echo -e "✅ Node.js installed: ${GREEN}$NODE_VERSION${NC}"
else
  echo -e "${RED}❌ Node.js not found. Installing...${NC}"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install node
  else
    echo "Please install Node.js from https://nodejs.org"
    exit 1
  fi
fi

# Check npm
if check_command npm; then
  NPM_VERSION=$(npm -v)
  echo -e "✅ npm installed: ${GREEN}$NPM_VERSION${NC}"
else
  echo -e "${RED}❌ npm not found${NC}"
  exit 1
fi

# Check Git
if check_command git; then
  GIT_VERSION=$(git --version)
  echo -e "✅ Git installed: ${GREEN}$GIT_VERSION${NC}"
else
  echo -e "${RED}❌ Git not found${NC}"
  exit 1
fi

echo ""
echo -e "${CYAN}Step 2: Setting Up External Services${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}You need to create accounts on the following services.${NC}"
echo -e "${YELLOW}We'll open each in your browser and wait for you to paste the keys.${NC}"
echo ""

# Create .env.local file
cat > .env.local << 'ENVTEMPLATE'
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

# Resend (Email)
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PadelFit AI
ENVTEMPLATE

# Supabase Setup
echo -e "\n${BLUE}📦 Setting up Supabase (Database & Auth)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Create a free account at Supabase"
echo "2. Create a new project"
echo "3. Go to Settings > API to get your keys"
read -p "Press Enter to open Supabase..."
open_url "https://supabase.com/dashboard/projects"
echo ""

read -p "Paste your Supabase Project URL: " SUPABASE_URL
read -p "Paste your Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Paste your Supabase Service Role Key: " SUPABASE_SERVICE_KEY

sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
sed -i.bak "s|SUPABASE_SERVICE_KEY=|SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY|" .env.local

echo -e "${GREEN}✅ Supabase configured${NC}"

# Stripe Setup
echo -e "\n${BLUE}💳 Setting up Stripe (Payments)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Create a free Stripe account"
echo "2. Go to Developers > API keys"
read -p "Press Enter to open Stripe..."
open_url "https://dashboard.stripe.com/apikeys"
echo ""

read -p "Paste your Stripe Publishable Key: " STRIPE_PK
read -p "Paste your Stripe Secret Key: " STRIPE_SK

sed -i.bak "s|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PK|" .env.local
sed -i.bak "s|STRIPE_SECRET_KEY=|STRIPE_SECRET_KEY=$STRIPE_SK|" .env.local

echo -e "${GREEN}✅ Stripe configured${NC}"

# OpenAI Setup
echo -e "\n${BLUE}🤖 Setting up OpenAI (AI Features)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Create an OpenAI account"
echo "2. Go to API Keys section"
read -p "Press Enter to open OpenAI..."
open_url "https://platform.openai.com/api-keys"
echo ""

read -p "Paste your OpenAI API Key: " OPENAI_KEY

sed -i.bak "s|OPENAI_API_KEY=|OPENAI_API_KEY=$OPENAI_KEY|" .env.local

echo -e "${GREEN}✅ OpenAI configured${NC}"

# Resend Setup
echo -e "\n${BLUE}📧 Setting up Resend (Emails)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Create a free Resend account"
echo "2. Go to API Keys section"
read -p "Press Enter to open Resend..."
open_url "https://resend.com/api-keys"
echo ""

read -p "Paste your Resend API Key: " RESEND_KEY

sed -i.bak "s|RESEND_API_KEY=|RESEND_API_KEY=$RESEND_KEY|" .env.local

echo -e "${GREEN}✅ Resend configured${NC}"

# Business Configuration
echo ""
echo -e "${CYAN}Step 3: Business Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

prompt_with_default "Business name" "PadelFit AI" BUSINESS_NAME
prompt_with_default "Your domain (without https://)" "padelfit.ai" DOMAIN

sed -i.bak "s|NEXT_PUBLIC_APP_NAME=PadelFit AI|NEXT_PUBLIC_APP_NAME=$BUSINESS_NAME|" .env.local
sed -i.bak "s|NEXT_PUBLIC_APP_URL=http://localhost:3000|NEXT_PUBLIC_APP_URL=https://$DOMAIN|" .env.local
sed -i.bak "s|EMAIL_FROM=noreply@yourdomain.com|EMAIL_FROM=noreply@$DOMAIN|" .env.local

# Clean up backup files
rm -f .env.local.bak

echo ""
echo -e "${CYAN}Step 4: Installing Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo -e "${CYAN}Step 5: Setting Up Database${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Please run the database schema manually:${NC}"
echo "1. Go to your Supabase project dashboard"
echo "2. Click on 'SQL Editor' in the sidebar"
echo "3. Copy the contents of scripts/schema.sql"
echo "4. Paste and run in the SQL Editor"
echo ""
read -p "Press Enter when you've set up the database..."

echo -e "${GREEN}✅ Database setup acknowledged${NC}"

echo ""
echo -e "${CYAN}Step 6: Creating Stripe Products${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node scripts/stripe-setup.js

echo -e "${GREEN}✅ Stripe products created${NC}"

echo ""
echo -e "${CYAN}Step 7: Generating Initial Content${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}This will generate 50+ exercises, 20 blog posts, and injury guides.${NC}"
echo -e "${YELLOW}This may take 10-15 minutes and will use OpenAI API credits (~$2-5).${NC}"
read -p "Do you want to generate content now? (y/n) " GENERATE_CONTENT

if [[ "$GENERATE_CONTENT" == "y" || "$GENERATE_CONTENT" == "Y" ]]; then
  node scripts/content-generate.js
  echo -e "${GREEN}✅ Content generated${NC}"
else
  echo -e "${YELLOW}Skipped. Run 'npm run content:generate' later to generate content.${NC}"
fi

echo ""
echo -e "${CYAN}Step 8: Setting Up Git Repository${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit - PadelFit AI setup"
  echo -e "${GREEN}✅ Git repository initialized${NC}"
else
  echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

echo ""
echo -e "${CYAN}Step 9: Deploying to Vercel${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if check_command vercel; then
  echo "Vercel CLI found. Deploying..."
  vercel --prod
else
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  echo ""
  echo "Please log in to Vercel and deploy:"
  vercel --prod
fi

echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                 🎉 Setup Complete! 🎉                         ║"
echo "║                                                               ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║                                                               ║"
echo "║  Your PadelFit AI platform is now live!                      ║"
echo "║                                                               ║"
echo "║  Next steps:                                                  ║"
echo "║  1. Connect your custom domain in Vercel                     ║"
echo "║  2. Set up Stripe webhooks (see below)                       ║"
echo "║  3. Configure social media accounts (optional)               ║"
echo "║                                                               ║"
echo "║  Stripe Webhooks:                                            ║"
echo "║  - Go to Stripe Dashboard > Developers > Webhooks            ║"
echo "║  - Add endpoint: https://$DOMAIN/api/webhooks/stripe          ║"
echo "║  - Select events: checkout.session.completed,                ║"
echo "║    customer.subscription.updated/deleted,                    ║"
echo "║    invoice.payment_succeeded/failed                          ║"
echo "║  - Copy webhook secret to .env.local                         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${CYAN}Useful Commands:${NC}"
echo "  npm run dev        - Start local development server"
echo "  npm run build      - Build for production"
echo "  npm run content:generate - Generate more content"
echo "  vercel --prod      - Deploy to production"
echo ""
echo -e "${PURPLE}Happy earning! 🎾💰${NC}"
