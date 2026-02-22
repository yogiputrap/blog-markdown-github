import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPlaceholderGradient } from "@/lib/posts";
import { getAvatarUrl } from "@/lib/github";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import DetailClient from "./DetailClient";
import ReadingProgress from "@/components/ReadingProgress";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
        title: `${post.title} — yogiputrap`,
        description: post.excerpt,
    };
}

export async function generateStaticParams() {
    try {
        const posts = await getAllPosts();
        return posts.map((post) => ({ slug: post.slug }));
    } catch {
        return [];
    }
}

export default async function PostPage({ params }: { params: Params }) {
    const { slug } = await params;
    let post;
    try {
        post = await getPostBySlug(slug);
    } catch {
        notFound();
    }

    if (!post) notFound();

    return (
        <div className="min-h-screen bg-white">
            <ReadingProgress />
            {/* Top nav */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <a
                        href="/"
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        id="back-button"
                    >
                        <svg className="w-4.5 h-4.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </a>
                    <DetailClient slug={post!.slug} />
                </div>
            </div>

            <main className="max-w-2xl mx-auto pb-24">
                {/* Hero image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                    {post!.cover ? (
                        <Image
                            src={post!.cover}
                            alt={post!.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 672px) 100vw, 672px"
                            priority
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ background: getPlaceholderGradient(post!.slug) }}
                        />
                    )}
                </div>

                <div className="px-5 pt-6 pb-4 space-y-4">
                    {/* Byline */}
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-200 flex-shrink-0">
                            <Image
                                src={getAvatarUrl()}
                                alt="yogiputrap"
                                fill
                                className="object-cover"
                                sizes="28px"
                            />
                        </div>
                        <div className="text-[13px] text-gray-500 leading-tight">
                            <span className="font-medium text-gray-700">yogiputrap</span>
                            <span className="mx-1.5 text-gray-300">·</span>
                            {post!.date}
                            <span className="mx-1.5 text-gray-300">·</span>
                            {post!.readingTime}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug tracking-tight">
                        {post!.title}
                    </h1>

                    {/* Tags */}
                    {post!.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {post!.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-5" />

                {/* Content */}
                <article className="px-5 pt-6">
                    <MarkdownRenderer content={post!.content} />
                </article>
            </main>

            {/* Bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        id="bottom-back"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        All posts
                    </a>
                    <DetailClient slug={post!.slug} />
                </div>
            </div>
        </div>
    );
}
