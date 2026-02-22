"use client";

import { useState } from "react";

interface DetailClientProps {
    slug: string;
}

export default function DetailClient({ slug }: DetailClientProps) {
    const [bookmarked, setBookmarked] = useState(false);

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

    return (
        <div className="flex items-center gap-2">
            {/* Share */}
            <button
                onClick={handleShare}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Share"
                id="detail-share"
            >
                <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            </button>

            {/* Bookmark */}
            <button
                onClick={() => setBookmarked(!bookmarked)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Bookmark"
                id="detail-bookmark"
            >
                <svg
                    className={`w-5 h-5 transition-colors ${bookmarked ? "text-teal-500 fill-teal-500" : "text-gray-600"
                        }`}
                    fill={bookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
            </button>
        </div>
    );
}
