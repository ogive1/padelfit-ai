#!/usr/bin/env node

/**
 * Stripe Setup Script
 *
 * This script creates the necessary Stripe products and prices.
 * Run with: npm run stripe:setup
 */

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Missing STRIPE_SECRET_KEY in .env.local');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

async function setupStripe() {
  console.log('Setting up Stripe products and prices...\n');

  try {
    // Create Pro product
    console.log('Creating Pro product...');
    const proProduct = await stripe.products.create({
      name: 'PadelFit AI Pro',
      description: 'Full access to injury prevention tools, personalized plans, and AI coaching.',
      metadata: {
        tier: 'pro',
      },
    });
    console.log(`  Created product: ${proProduct.id}`);

    // Create Pro price
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1200, // $12.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
      },
    });
    console.log(`  Created price: ${proPrice.id} ($12/month)\n`);

    // Create Elite product
    console.log('Creating Elite product...');
    const eliteProduct = await stripe.products.create({
      name: 'PadelFit AI Elite',
      description: 'Premium coaching with video analysis, 1-on-1 AI sessions, and priority support.',
      metadata: {
        tier: 'elite',
      },
    });
    console.log(`  Created product: ${eliteProduct.id}`);

    // Create Elite price
    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'elite',
      },
    });
    console.log(`  Created price: ${elitePrice.id} ($29/month)\n`);

    // Update .env.local with price IDs
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Update or add price IDs
    if (envContent.includes('STRIPE_PRO_PRICE_ID=')) {
      envContent = envContent.replace(/STRIPE_PRO_PRICE_ID=.*/g, `STRIPE_PRO_PRICE_ID=${proPrice.id}`);
    } else {
      envContent += `\nSTRIPE_PRO_PRICE_ID=${proPrice.id}`;
    }

    if (envContent.includes('STRIPE_ELITE_PRICE_ID=')) {
      envContent = envContent.replace(/STRIPE_ELITE_PRICE_ID=.*/g, `STRIPE_ELITE_PRICE_ID=${elitePrice.id}`);
    } else {
      envContent += `\nSTRIPE_ELITE_PRICE_ID=${elitePrice.id}`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n');

    console.log('Stripe setup complete!');
    console.log('');
    console.log('Price IDs saved to .env.local:');
    console.log(`  STRIPE_PRO_PRICE_ID=${proPrice.id}`);
    console.log(`  STRIPE_ELITE_PRICE_ID=${elitePrice.id}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Set up Stripe webhooks in Dashboard');
    console.log('   URL: https://your-domain.com/api/webhooks/stripe');
    console.log('   Events: checkout.session.completed, customer.subscription.updated,');
    console.log('           customer.subscription.deleted, invoice.payment_succeeded,');
    console.log('           invoice.payment_failed');
    console.log('2. Add STRIPE_WEBHOOK_SECRET to .env.local');

  } catch (error) {
    console.error('Error setting up Stripe:', error.message);
    process.exit(1);
  }
}

setupStripe();
