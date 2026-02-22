"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            setProgress(Math.min(100, (scrollTop / docHeight) * 100));
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
            <div
                className="h-full bg-gray-900 transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
