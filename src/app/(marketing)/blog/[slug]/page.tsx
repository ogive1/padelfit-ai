import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const supabase = await createServiceClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, seo_title, seo_description")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = await createServiceClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from("blog_posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", post.id);

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, published_at")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  return (
    <article className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
              {post.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span>By {post.author || "PadelFit AI"}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-gray max-w-none prose-headings:font-heading prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to prevent injuries?
            </h3>
            <p className="mt-2 text-gray-600">
              Take our free injury risk quiz and get personalized
              recommendations.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/tools/injury-risk-quiz">
                <Button>Take the Quiz</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary">Sign Up Free</Button>
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Related Articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(related.published_at)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
