"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post, getPlaceholderGradient } from "@/lib/posts";

interface HeroSliderProps {
    posts: Post[];
}

export default function HeroSlider({ posts }: HeroSliderProps) {
    const slides = posts.slice(0, 5);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const goTo = useCallback(
        (index: number) => setCurrent((index + slides.length) % slides.length),
        [slides.length]
    );

    // Auto-advance every 4.5s
    useEffect(() => {
        if (paused || slides.length <= 1) return;
        const timer = setTimeout(() => goTo(current + 1), 4500);
        return () => clearTimeout(timer);
    }, [current, paused, goTo, slides.length]);

    // Touch swipe
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
    };

    if (slides.length === 0) return null;

    return (
        <div
            className="relative mx-4 mt-4 mb-1 rounded-2xl overflow-hidden select-none"
            style={{ aspectRatio: "16/7" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {slides.map((post, i) => (
                <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    tabIndex={i === current ? 0 : -1}
                    id={`slide-${post.slug}`}
                >
                    {/* Background image or gradient */}
                    {post.cover ? (
                        <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 672px) 100vw, 672px"
                            priority={i === 0}
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{ background: getPlaceholderGradient(post.slug) }}
                        />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-bold text-white/80 uppercase tracking-[0.1em]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-white font-bold text-[17px] sm:text-[20px] leading-snug line-clamp-2 mb-2 tracking-tight drop-shadow">
                            {post.title}
                        </h2>

                        {/* Author & date */}
                        <div className="flex items-center gap-1.5 text-white/75 text-[12px]">
                            <span className="font-semibold text-white">yogiputrap</span>
                            <span className="text-white/50">–</span>
                            <span>{post.date !== "No date" ? post.date : post.readingTime}</span>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Dot indicators — bottom right */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.preventDefault(); goTo(i); }}
                            className={`rounded-full transition-all duration-300 ${i === current
                                    ? "w-5 h-[6px] bg-white"
                                    : "w-[6px] h-[6px] bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                            id={`dot-${i}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
