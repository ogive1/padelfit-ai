import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'PadelFit AI <noreply@padelfit.ai>';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PadelFit AI';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Email templates
export const templates = {
  welcome: (name: string) => ({
    subject: `Welcome to ${APP_NAME} - Let's prevent injuries together!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #16a34a; }
    .content { padding: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PadelFit AI</div>
    </div>
    <div class="content">
      <h1>Welcome, ${name}!</h1>
      <p>Thanks for joining PadelFit AI. You're now part of a community of padel players committed to staying injury-free and playing at their best.</p>
      <p>Here's what you can do now:</p>
      <ul>
        <li><strong>Take the Injury Risk Quiz</strong> - Understand your injury risks and get personalized recommendations</li>
        <li><strong>Generate Your First Warm-up</strong> - Create a customized warm-up routine before your next match</li>
        <li><strong>Explore the Exercise Library</strong> - Browse 50+ injury prevention exercises</li>
      </ul>
      <p style="text-align: center; padding: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </p>
      <p>Have questions? Just reply to this email - we're here to help!</p>
      <p>Play safe,<br>The PadelFit AI Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PadelFit AI. All rights reserved.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  injuryTip: (name: string, tip: string, exercise: string) => ({
    subject: `Your Daily Padel Injury Prevention Tip`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #16a34a; }
    .tip-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .exercise-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .button { display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PadelFit AI</div>
    </div>
    <div class="content">
      <h2>Hey ${name}!</h2>
      <p>Here's your daily injury prevention tip:</p>
      <div class="tip-box">
        <p style="font-size: 18px; margin: 0;">${tip}</p>
      </div>
      <div class="exercise-box">
        <h3 style="margin-top: 0;">Today's Featured Exercise</h3>
        <p>${exercise}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/exercises" class="button">View Exercise</a>
      </div>
      <p>Stay injury-free!</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PadelFit AI</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  weeklyDigest: (name: string, stats: { sessions: number; streak: number }) => ({
    subject: `Your Weekly PadelFit AI Summary`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .stats { display: flex; justify-content: space-around; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-number { font-size: 32px; font-weight: bold; color: #16a34a; }
    .stat-label { font-size: 14px; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hey ${name}, here's your week in review!</h2>
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${stats.sessions}</div>
        <div class="stat-label">Sessions</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.streak}</div>
        <div class="stat-label">Day Streak</div>
      </div>
    </div>
    <p>Keep up the great work! Consistency is key to injury prevention.</p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Full Stats</a>
    </p>
  </div>
</body>
</html>
    `,
  }),

  proUpgrade: (name: string) => ({
    subject: `Unlock Full Access to PadelFit AI`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .features { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .feature { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .feature:last-child { border-bottom: none; }
    .button { display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .price { font-size: 24px; font-weight: bold; color: #16a34a; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hey ${name},</h2>
    <p>You've been using PadelFit AI for a week now. Ready to take your injury prevention to the next level?</p>
    <div class="features">
      <h3>With Pro, you get:</h3>
      <div class="feature">Full exercise library (50+ exercises)</div>
      <div class="feature">Personalized conditioning plans</div>
      <div class="feature">Unlimited AI coaching</div>
      <div class="feature">Progress tracking</div>
      <div class="feature">Email support</div>
    </div>
    <p style="text-align: center;">
      <span class="price">Just $12/month</span>
    </p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" class="button">Upgrade to Pro</a>
    </p>
    <p>Questions? Just reply to this email!</p>
  </div>
</body>
</html>
    `,
  }),
};
