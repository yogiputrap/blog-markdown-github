"use client";

import { useState } from "react";
import { usePostStats, formatStat } from "@/lib/client-stats";

interface DetailClientProps {
    slug: string;
}

export default function DetailClient({ slug }: DetailClientProps) {
    const { views, likes, hasLiked, toggleLike, mounted } = usePostStats(slug, true);
    const [animateLike, setAnimateLike] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/${slug}`;
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch {
                // user cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    const handleLike = () => {
        if (!hasLiked) {
            setAnimateLike(true);
            setTimeout(() => setAnimateLike(false), 300); // Reset animation key
        }
        toggleLike();
    };

    return (
        <div className={`flex items-center gap-1.5 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

            {/* Views counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[13px] font-medium mr-1" title="Dynamic Views">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatStat(views)}
            </div>

            {/* Like Button */}
            <button
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                aria-label="Like"
                id="detail-like"
            >
                <div className="relative flex items-center justify-center">
                    <svg
                        className={`w-5 h-5 transition-transform duration-200 ${hasLiked ? "text-red-500 fill-red-500" : "text-gray-400 group-hover:text-red-400"} ${animateLike ? "scale-125" : "scale-100"}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    {/* Pop ring animation effect */}
                    {animateLike && (
                        <span className="absolute inset-0 rounded-full border border-red-500 animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)_forwards]" />
                    )}
                </div>
                <span className={`text-[13px] font-medium ${hasLiked ? "text-red-600" : "text-gray-500"}`}>
                    {formatStat(likes)}
                </span>
            </button>

            {/* Share */}
            <button
                onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Share"
                id="detail-share"
            >
                <svg
                    className="w-[18px] h-[18px] text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            </button>
        </div>
    );
}
