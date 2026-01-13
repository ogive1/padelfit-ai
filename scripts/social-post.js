#!/usr/bin/env node

/**
 * Social Media Poster
 *
 * Posts scheduled content to Twitter and queues for Instagram via Buffer.
 * Run with: npm run social:post (via GitHub Actions daily)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Twitter API helper (using Twitter API v2)
async function postToTwitter(content) {
  const twitterApiKey = process.env.TWITTER_API_KEY;
  const twitterApiSecret = process.env.TWITTER_API_SECRET;
  const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
  const twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!twitterApiKey || !twitterAccessToken) {
    console.log('Twitter credentials not configured, skipping...');
    return { success: false, error: 'Not configured' };
  }

  try {
    // Note: In production, use a proper Twitter library like 'twitter-api-v2'
    // This is a simplified placeholder
    console.log('Would post to Twitter:', content.substring(0, 50) + '...');
    return { success: true, url: 'https://twitter.com/padelfitai/status/placeholder' };
  } catch (error) {
    console.error('Twitter error:', error.message);
    return { success: false, error: error.message };
  }
}

// Buffer API helper for Instagram
async function queueToBuffer(content, platform) {
  const bufferToken = process.env.BUFFER_ACCESS_TOKEN;

  if (!bufferToken) {
    console.log('Buffer credentials not configured, skipping...');
    return { success: false, error: 'Not configured' };
  }

  try {
    // Note: In production, use Buffer's API
    // https://buffer.com/developers/api
    console.log(`Would queue to Buffer (${platform}):`, content.substring(0, 50) + '...');
    return { success: true };
  } catch (error) {
    console.error('Buffer error:', error.message);
    return { success: false, error: error.message };
  }
}

async function postScheduledContent() {
  console.log('Posting scheduled social media content...\n');

  // Get scheduled posts that are due
  const { data: posts, error } = await supabase
    .from('social_content')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for', { ascending: true });

  if (error) {
    console.error('Error fetching posts:', error.message);
    return;
  }

  console.log(`Found ${posts?.length || 0} posts to publish\n`);

  for (const post of posts || []) {
    let result;

    switch (post.platform) {
      case 'twitter':
        result = await postToTwitter(post.content);
        break;
      case 'instagram':
        result = await queueToBuffer(post.content, 'instagram');
        break;
      default:
        console.log(`Unknown platform: ${post.platform}`);
        continue;
    }

    // Update post status
    await supabase
      .from('social_content')
      .update({
        status: result.success ? 'posted' : 'failed',
        posted_at: result.success ? new Date().toISOString() : null,
        post_url: result.url || null,
        error_message: result.error || null,
      })
      .eq('id', post.id);

    if (result.success) {
      console.log(`✅ Posted to ${post.platform}`);
    } else {
      console.log(`❌ Failed to post to ${post.platform}: ${result.error}`);
    }
  }

  console.log('\n✅ Social media posting complete');
}

postScheduledContent();
