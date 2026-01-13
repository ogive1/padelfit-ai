#!/usr/bin/env node

/**
 * Email Sequence Processor
 *
 * Processes email sequences for users based on their signup date and progress.
 * Run with: npm run email:process (via GitHub Actions daily)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'PadelFit AI <noreply@padelfit.ai>';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://padelfit.ai';

if (!supabaseUrl || !supabaseServiceKey || !resendKey) {
  console.error('Error: Missing required credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendKey);

// Email sequence definitions
const sequences = {
  onboarding: [
    { day: 0, template: 'welcome' },
    { day: 2, template: 'injuryGuide' },
    { day: 4, template: 'warmupReminder' },
    { day: 7, template: 'proUpgrade' },
    { day: 14, template: 'caseStudy' },
    { day: 21, template: 'finalOffer' },
  ],
};

// Email templates
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to PadelFit AI!',
    html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining...</p>`,
  }),
  injuryGuide: (name) => ({
    subject: 'The 5 Most Common Padel Injuries (and how to prevent them)',
    html: `<h1>Hey ${name},</h1><p>Did you know that 30% of padel players get injured each year?</p>`,
  }),
  warmupReminder: (name) => ({
    subject: 'Your Personalized Warm-up Routine is Ready',
    html: `<h1>Hey ${name},</h1><p>Don't forget to warm up before your next match!</p>`,
  }),
  proUpgrade: (name) => ({
    subject: 'Unlock Full Access to PadelFit AI',
    html: `<h1>Hey ${name},</h1><p>Ready to take your injury prevention to the next level?</p>`,
  }),
  caseStudy: (name) => ({
    subject: 'How Carlos Went 6 Months Injury-Free',
    html: `<h1>Hey ${name},</h1><p>Meet Carlos, a club player from Madrid...</p>`,
  }),
  finalOffer: (name) => ({
    subject: 'Last Chance: 20% Off Pro Plan',
    html: `<h1>Hey ${name},</h1><p>We noticed you haven't upgraded yet...</p>`,
  }),
};

async function processEmailSequences() {
  console.log('Processing email sequences...\n');

  // Get users with active sequences
  const { data: userSequences, error } = await supabase
    .from('email_sequences')
    .select(`
      *,
      profiles!inner(id, email, full_name, subscription_tier, created_at)
    `)
    .eq('completed', false);

  if (error) {
    console.error('Error fetching sequences:', error.message);
    return;
  }

  console.log(`Found ${userSequences?.length || 0} active sequences\n`);

  for (const sequence of userSequences || []) {
    const { profiles: profile, sequence_name, current_step, last_email_sent_at } = sequence;
    const sequenceDefinition = sequences[sequence_name];

    if (!sequenceDefinition) {
      console.log(`Unknown sequence: ${sequence_name}`);
      continue;
    }

    // Calculate days since signup
    const daysSinceSignup = Math.floor(
      (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Find the next email to send
    const nextEmail = sequenceDefinition.find(
      (email, index) => index === current_step && email.day <= daysSinceSignup
    );

    if (!nextEmail) {
      continue;
    }

    // Check if we already sent an email today
    if (last_email_sent_at) {
      const lastSentDate = new Date(last_email_sent_at).toDateString();
      const today = new Date().toDateString();
      if (lastSentDate === today) {
        continue;
      }
    }

    // Skip upgrade emails for paid users
    if (
      ['proUpgrade', 'finalOffer'].includes(nextEmail.template) &&
      profile.subscription_tier !== 'free'
    ) {
      // Mark as completed and move to next
      await supabase
        .from('email_sequences')
        .update({
          current_step: current_step + 1,
          completed: current_step + 1 >= sequenceDefinition.length,
        })
        .eq('id', sequence.id);
      continue;
    }

    // Generate email content
    const template = templates[nextEmail.template];
    if (!template) {
      console.log(`Unknown template: ${nextEmail.template}`);
      continue;
    }

    const { subject, html } = template(profile.full_name || 'there');

    // Send email
    try {
      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: profile.email,
        subject,
        html,
      });

      if (sendError) {
        console.error(`Error sending to ${profile.email}:`, sendError);
        continue;
      }

      console.log(`Sent "${nextEmail.template}" to ${profile.email}`);

      // Update sequence progress
      await supabase
        .from('email_sequences')
        .update({
          current_step: current_step + 1,
          last_email_sent_at: new Date().toISOString(),
          completed: current_step + 1 >= sequenceDefinition.length,
        })
        .eq('id', sequence.id);
    } catch (err) {
      console.error(`Error sending to ${profile.email}:`, err.message);
    }
  }

  // Start sequences for new users who don't have one
  const { data: newUsers } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .not('id', 'in', `(${userSequences?.map(s => `'${s.user_id}'`).join(',') || "''"})`)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  for (const user of newUsers || []) {
    // Create onboarding sequence
    await supabase.from('email_sequences').insert({
      user_id: user.id,
      sequence_name: 'onboarding',
      current_step: 0,
    });

    // Send welcome email immediately
    const { subject, html } = templates.welcome(user.full_name || 'there');
    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject,
        html,
      });
      console.log(`Sent welcome email to ${user.email}`);
    } catch (err) {
      console.error(`Error sending welcome to ${user.email}:`, err.message);
    }
  }

  console.log('\n✅ Email processing complete');
}

processEmailSequences();
