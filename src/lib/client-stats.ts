"use client";

import { useState, useEffect } from "react";

// Helper to get deterministic fake base values so it doesn't start at 0
export function getBaseStats(slug: string) {
    let h = 0;
    for (let i = 0; i < slug.length; i++) {
        h = Math.imul(31, h) + slug.charCodeAt(i) | 0;
    }
    const abs = Math.abs(h);
    const baseViews = ((abs % 79) + 2) * 123;
    const baseLikes = ((abs % 14) + 1) * 7;
    return { baseViews, baseLikes };
}

export function usePostStats(slug: string, isDetail = false) {
    const [views, setViews] = useState<number>(0);
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const { baseViews, baseLikes } = getBaseStats(slug);

        // Get local increments
        let localViews = parseInt(localStorage.getItem(`view_count_${slug}`) || "0");

        // If we are on the detail page, increment view count
        if (isDetail) {
            const hasViewedSession = sessionStorage.getItem(`viewed_${slug}`);
            if (!hasViewedSession) {
                localViews += 1;
                localStorage.setItem(`view_count_${slug}`, localViews.toString());
                sessionStorage.setItem(`viewed_${slug}`, "true");
            }
        }

        const liked = localStorage.getItem(`liked_${slug}`) === "true";
        setHasLiked(liked);
        setViews(baseViews + localViews);
        setLikes(baseLikes + (liked ? 1 : 0));

        // Optional: dynamic floating animation for views while reading
        if (isDetail) {
            const interval = setInterval(() => {
                if (Math.random() > 0.7) {
                    setViews(v => v + 1);
                    localStorage.setItem(`view_count_${slug}`, (parseInt(localStorage.getItem(`view_count_${slug}`) || "0") + 1).toString());
                }
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [slug, isDetail]);

    const toggleLike = () => {
        const newState = !hasLiked;
        setHasLiked(newState);
        localStorage.setItem(`liked_${slug}`, newState ? "true" : "false");
        setLikes(prev => newState ? prev + 1 : prev - 1);
    };

    return {
        views,
        likes,
        hasLiked,
        toggleLike,
        mounted
    };
}

export function formatStat(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
}
