"use client";

import Link from "next/link";
import { Post, getPlaceholderGradient } from "@/lib/posts";
import Image from "next/image";

interface PostCardProps {
    post: Post;
    index: number;
}

// Deterministic fake stats from slug
function getStats(slug: string) {
    let h = 0;
    for (let i = 0; i < slug.length; i++) {
        h = Math.imul(31, h) + slug.charCodeAt(i) | 0;
    }
    const abs = Math.abs(h);
    const views = ((abs % 79) + 2) * 0.1;
    const comments = ((abs % 14) + 1);
    return {
        views: views < 10 ? views.toFixed(1) + "k" : Math.round(views) + "k",
        comments: comments + "k",
    };
}

// Format date short: "Mar 1, 2025" → "Mar 1"
function formatDateShort(date: string): string | null {
    if (date === "No date") return null;
    const parts = date.split(" ");
    if (parts.length >= 2) return `${parts[0]} ${parts[1].replace(",", "")}`;
    return date;
}

export default function PostCard({ post }: PostCardProps) {
    const stats = getStats(post.slug);
    const shortDate = formatDateShort(post.date);

    return (
        <Link href={`/${post.slug}`} id={`post-card-${post.slug}`}>
            <article className="group flex gap-3.5 px-4 py-3 hover:bg-gray-50 transition-colors duration-100 cursor-pointer">

                {/* Thumbnail — 88×88 square */}
                <div className="relative flex-shrink-0 w-22 h-22 rounded-xl overflow-hidden" style={{ width: 88, height: 88 }}>
                    {post.cover ? (
                        <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="88px"
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ background: getPlaceholderGradient(post.slug) }}
                        />
                    )}

                    {shortDate && (
                        <div className="absolute bottom-1.5 left-1.5 bg-white/90 text-[9px] font-bold text-gray-700 px-1.5 py-0.5 rounded-md leading-tight tracking-tight">
                            {shortDate}
                        </div>
                    )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
                    {/* Reading time */}
                    <p className="text-[10.5px] font-semibold text-gray-400 tracking-[0.04em] uppercase">
                        {post.readingTime}
                    </p>

                    {/* Title */}
                    <h3 className="text-[14.5px] font-semibold text-gray-900 leading-[1.35] line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11.5px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {stats.views}
                        </span>
                        <span className="flex items-center gap-1 text-[11.5px] text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {stats.comments}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
