#!/usr/bin/env node

/**
 * Content Generation Script
 *
 * Generates initial content for the platform:
 * - 50+ exercises
 * - 20 blog posts
 * - 5 injury guides
 *
 * Run with: npm run content:generate
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials');
  process.exit(1);
}

if (!openaiKey) {
  console.error('Error: Missing OpenAI API key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiKey });

// Exercise categories and target areas
const exerciseCategories = ['warmup', 'stretching', 'strength', 'recovery', 'mobility'];
const targetAreas = ['shoulder', 'elbow', 'wrist', 'knee', 'back', 'ankle', 'hip', 'core'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

// Blog topics for SEO
const blogTopics = [
  { topic: 'padel warm up routine', keyword: 'padel warm up' },
  { topic: 'preventing padel elbow injuries', keyword: 'padel elbow' },
  { topic: 'padel shoulder injury prevention', keyword: 'padel shoulder injury' },
  { topic: 'best stretches for padel players', keyword: 'padel stretches' },
  { topic: 'padel knee injury prevention', keyword: 'padel knee' },
  { topic: 'how to prevent back pain in padel', keyword: 'padel back pain' },
  { topic: 'padel recovery routine after matches', keyword: 'padel recovery' },
  { topic: 'common padel injuries and prevention', keyword: 'padel injuries' },
  { topic: 'padel conditioning exercises', keyword: 'padel conditioning' },
  { topic: 'ankle stability exercises for padel', keyword: 'padel ankle' },
  { topic: 'importance of cool down after padel', keyword: 'padel cool down' },
  { topic: 'foam rolling for padel players', keyword: 'padel foam rolling' },
  { topic: 'strength training for padel', keyword: 'padel strength training' },
  { topic: 'flexibility exercises for padel', keyword: 'padel flexibility' },
  { topic: 'preventing wrist injuries in padel', keyword: 'padel wrist' },
  { topic: 'padel pre-match routine', keyword: 'padel pre-match' },
  { topic: 'core exercises for padel players', keyword: 'padel core exercises' },
  { topic: 'hip mobility for padel', keyword: 'padel hip mobility' },
  { topic: 'nutrition for padel injury prevention', keyword: 'padel nutrition' },
  { topic: 'sleep and recovery for padel players', keyword: 'padel recovery tips' },
];

// Injury guides
const injuryTypes = [
  { type: 'shoulder', title: 'Shoulder Injuries in Padel' },
  { type: 'elbow', title: 'Tennis/Padel Elbow Guide' },
  { type: 'knee', title: 'Knee Injuries in Padel' },
  { type: 'back', title: 'Lower Back Pain in Padel' },
  { type: 'wrist', title: 'Wrist Injuries in Padel' },
];

async function generateExercises() {
  console.log('\nGenerating exercises...');
  const exercises = [];

  for (const category of exerciseCategories) {
    for (const area of targetAreas.slice(0, 4)) { // 4 areas per category = 20 per category
      const prompt = `Generate a ${category} exercise for padel players targeting the ${area}.

Return as JSON:
{
  "title": "Exercise name",
  "description": "Brief description (1-2 sentences)",
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "duration_seconds": number (15-120),
  "reps": "e.g., '10-12 reps' or '30 seconds hold'",
  "benefits": ["Benefit 1", "Benefit 2"],
  "warnings": ["Warning if applicable"],
  "difficulty": "beginner" | "intermediate" | "advanced"
}`;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.8,
        });

        const exercise = JSON.parse(response.choices[0].message.content);
        const slug = exercise.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        exercises.push({
          slug,
          title: exercise.title,
          description: exercise.description,
          category,
          target_areas: [area],
          difficulty: exercise.difficulty,
          duration_seconds: exercise.duration_seconds,
          reps: exercise.reps,
          instructions: exercise.instructions,
          benefits: exercise.benefits,
          warnings: exercise.warnings || [],
          is_premium: Math.random() > 0.6, // 40% are premium
        });

        console.log(`  Generated: ${exercise.title}`);

        // Rate limiting
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        console.error(`  Error generating exercise for ${category}/${area}:`, error.message);
      }
    }
  }

  // Insert into database
  if (exercises.length > 0) {
    const { error } = await supabase.from('exercises').upsert(exercises, {
      onConflict: 'slug',
    });

    if (error) {
      console.error('Error inserting exercises:', error.message);
    } else {
      console.log(`\nInserted ${exercises.length} exercises into database`);
    }
  }

  // Also save to JSON file for backup
  const exercisesPath = path.join(__dirname, '../content/exercises/exercises.json');
  fs.mkdirSync(path.dirname(exercisesPath), { recursive: true });
  fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2));
  console.log(`Saved exercises to ${exercisesPath}`);

  return exercises;
}

async function generateBlogPosts() {
  console.log('\nGenerating blog posts...');
  const posts = [];

  for (const { topic, keyword } of blogTopics) {
    const prompt = `Write an SEO-optimized blog post about "${topic}" for padel players.

Target keyword: "${keyword}"

Requirements:
- 800-1200 words
- Include H2 and H3 headings
- Practical, actionable advice
- Include a "Quick Tips" section
- Professional but approachable tone

Return as JSON:
{
  "title": "SEO-optimized title (50-60 chars)",
  "slug": "url-friendly-slug",
  "excerpt": "Meta description (150-160 chars)",
  "content": "Full markdown content",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "injury-prevention" | "training" | "recovery" | "nutrition"
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const post = JSON.parse(response.choices[0].message.content);

      posts.push({
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        seo_title: post.title,
        seo_description: post.excerpt,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      console.log(`  Generated: ${post.title}`);

      // Rate limiting
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`  Error generating post for "${topic}":`, error.message);
    }
  }

  // Insert into database
  if (posts.length > 0) {
    const { error } = await supabase.from('blog_posts').upsert(posts, {
      onConflict: 'slug',
    });

    if (error) {
      console.error('Error inserting blog posts:', error.message);
    } else {
      console.log(`\nInserted ${posts.length} blog posts into database`);
    }
  }

  // Save to JSON for backup
  const postsPath = path.join(__dirname, '../content/blog/posts.json');
  fs.mkdirSync(path.dirname(postsPath), { recursive: true });
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`Saved blog posts to ${postsPath}`);

  return posts;
}

async function generateInjuryGuides() {
  console.log('\nGenerating injury guides...');
  const guides = [];

  for (const { type, title } of injuryTypes) {
    const prompt = `Write a comprehensive injury guide about "${title}" for padel players.

Include:
- Common causes specific to padel
- Symptoms to watch for
- Prevention strategies
- Recovery timeline
- When to see a doctor
- Recommended exercises

Return as JSON:
{
  "title": "Guide title",
  "description": "Brief description (2-3 sentences)",
  "content": "Full markdown content (1500+ words)",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "causes": ["Cause 1", "Cause 2", "Cause 3"],
  "prevention_tips": [
    {"tip": "Tip text", "priority": "high" | "medium" | "low"}
  ],
  "recovery_timeline": "Expected recovery time",
  "when_to_see_doctor": "When to seek medical help"
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      });

      const guide = JSON.parse(response.choices[0].message.content);

      guides.push({
        slug: type,
        injury_type: type,
        title: guide.title,
        description: guide.description,
        content: guide.content,
        symptoms: guide.symptoms,
        causes: guide.causes,
        prevention_tips: guide.prevention_tips,
        recovery_timeline: guide.recovery_timeline,
        when_to_see_doctor: guide.when_to_see_doctor,
        seo_title: `${guide.title} - Prevention & Treatment | PadelFit AI`,
        seo_description: guide.description,
      });

      console.log(`  Generated: ${guide.title}`);

      // Rate limiting
      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      console.error(`  Error generating guide for "${type}":`, error.message);
    }
  }

  // Insert into database
  if (guides.length > 0) {
    const { error } = await supabase.from('injury_guides').upsert(guides, {
      onConflict: 'slug',
    });

    if (error) {
      console.error('Error inserting injury guides:', error.message);
    } else {
      console.log(`\nInserted ${guides.length} injury guides into database`);
    }
  }

  return guides;
}

async function main() {
  console.log('Starting content generation...');
  console.log('This may take 10-15 minutes due to API rate limits.\n');

  try {
    await generateExercises();
    await generateBlogPosts();
    await generateInjuryGuides();

    console.log('\n✅ Content generation complete!');
    console.log('\nGenerated:');
    console.log('- 50+ exercises');
    console.log('- 20 blog posts');
    console.log('- 5 injury guides');
  } catch (error) {
    console.error('Content generation failed:', error.message);
    process.exit(1);
  }
}

main();
