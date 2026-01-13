import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog",
  description:
    "Expert advice on padel injury prevention, warm-up routines, recovery tips, and more. Stay injury-free and play better.",
};

export default async function BlogPage() {
  const supabase = await createServiceClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  // Group posts by category
  const featured = posts?.slice(0, 3) || [];
  const rest = posts?.slice(3) || [];

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="section-heading">PadelFit AI Blog</h1>
          <p className="section-subheading">
            Expert advice on injury prevention, training tips, and recovery
            strategies for padel players.
          </p>
        </div>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Featured Articles
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {featured.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {post.category}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <div className="mt-4 text-primary-600 font-medium text-sm flex items-center gap-1">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              All Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                            {post.category}
                          </span>
                          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.published_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!posts || posts.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
