import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import BlogListClient from "@/components/BlogListClient";
import ListSkeleton from "@/components/ListSkeleton";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blogs — yogiputrap",
  description:
    "Personal blog by yogiputrap. Read articles about tech, IoT, programming, and more.",
};

async function BlogList() {
  try {
    const posts = await getAllPosts();
    return <BlogListClient posts={posts} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load posts";
    const isRateLimit = message.includes("rate limit");

    return (
      <div className="text-center py-20 px-4">
        <p className="text-sm font-medium text-gray-500">
          {isRateLimit ? "GitHub API rate limited" : "Error loading posts"}
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          {isRateLimit
            ? "Set GITHUB_TOKEN in .env.local to increase rate limits"
            : message}
        </p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto">
        <Suspense fallback={<ListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}
