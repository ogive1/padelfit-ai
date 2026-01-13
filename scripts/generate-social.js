#!/usr/bin/env node

/**
 * Social Media Content Generator
 *
 * Generates daily social media posts for Twitter and Instagram.
 * Run with: npm run content:generate-social
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
  console.error('Error: Missing required credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiKey });

const contentTypes = [
  'injury prevention tip',
  'exercise of the day',
  'warm-up reminder',
  'recovery tip',
  'padel fact',
  'motivation',
  'technique tip',
];

async function generateSocialContent() {
  console.log('Generating social media content...\n');

  // Pick a random content type
  const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

  const prompt = `Generate social media content for a padel injury prevention app.

Content type: ${contentType}

Create posts for:
1. Twitter (280 chars max, 3-4 hashtags)
2. Instagram (longer caption, 8-10 hashtags, use emojis)

Requirements:
- Educational and actionable
- Professional but friendly tone
- Include a call to action
- Focus on injury prevention/fitness

Return as JSON:
{
  "twitter": {
    "content": "Tweet text with hashtags",
    "hashtags": ["padel", "hashtag2", ...]
  },
  "instagram": {
    "content": "Instagram caption with emojis",
    "hashtags": ["padel", "hashtag2", ...]
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    });

    const posts = JSON.parse(response.choices[0].message.content);

    // Schedule posts for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM

    const socialPosts = [
      {
        platform: 'twitter',
        content: posts.twitter.content,
        hashtags: posts.twitter.hashtags,
        scheduled_for: tomorrow.toISOString(),
        status: 'scheduled',
      },
      {
        platform: 'instagram',
        content: posts.instagram.content,
        hashtags: posts.instagram.hashtags,
        scheduled_for: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        status: 'scheduled',
      },
    ];

    // Insert into database
    const { error } = await supabase.from('social_content').insert(socialPosts);

    if (error) {
      console.error('Error saving posts:', error.message);
      return;
    }

    console.log('Generated and scheduled:');
    console.log('\nTwitter:');
    console.log(posts.twitter.content);
    console.log('\nInstagram:');
    console.log(posts.instagram.content);
    console.log('\n✅ Posts scheduled for tomorrow');

  } catch (error) {
    console.error('Error generating content:', error.message);
  }
}

generateSocialContent();
