"use client";

import Image from "next/image";
import { getAvatarUrl } from "@/lib/github";
import { useState, useEffect } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);

    // Lock body scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <>
            {/* ── Top bar ── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Hamburger */}
                    <button
                        onClick={() => setOpen(true)}
                        className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                        id="menu-button"
                    >
                        <span className="block w-[18px] h-[1.5px] bg-gray-800 rounded-full" />
                        <span className="block w-[18px] h-[1.5px] bg-gray-800 rounded-full" />
                        <span className="block w-[18px] h-[1.5px] bg-gray-800 rounded-full" />
                    </button>

                    {/* Title */}
                    <span className="text-[17px] font-semibold text-gray-900 tracking-[-0.3px]">
                        Blogs
                    </span>

                    {/* Avatar */}
                    <a
                        href="https://github.com/yogiputrap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200 hover:ring-gray-400 transition-all"
                    >
                        <Image
                            src={getAvatarUrl()}
                            alt="yogiputrap"
                            fill
                            className="object-cover"
                            sizes="32px"
                        />
                    </a>
                </div>
            </header>

            {/* ── Backdrop ── */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* ── Sidebar ── */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-full w-[300px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Close button */}
                <div className="flex items-center justify-end px-4 h-14 border-b border-gray-100 flex-shrink-0">
                    <button
                        onClick={() => setOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        aria-label="Close menu"
                        id="close-menu"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Profile card */}
                <div className="px-5 py-6 border-b border-gray-100 flex-shrink-0">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                            <Image
                                src={getAvatarUrl()}
                                alt="yogiputrap"
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-[15px]">yogiputrap</div>
                            <a
                                href="https://github.com/yogiputrap"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                github.com/yogiputrap
                            </a>
                        </div>
                    </div>

                    {/* Course info */}
                    <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-0.5">Course</p>
                                <p className="text-[13px] font-semibold text-gray-800 leading-snug">EL5183 – Sistem dan Aplikasi IoT</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-0.5">Program</p>
                                <p className="text-[13px] font-semibold text-gray-800 leading-snug">Magister Multidisiplin Smart X</p>
                                <p className="text-[11.5px] text-gray-500 mt-0.5">Batch 2</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-0.5">Institution</p>
                                <p className="text-[13px] font-semibold text-gray-800 leading-snug">Institut Teknologi Bandung</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
                    <a
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        id="nav-home"
                    >
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </a>
                    <a
                        href="https://github.com/yogiputrap"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        id="nav-github"
                    >
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub
                    </a>
                    <a
                        href="https://www.itb.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        id="nav-itb"
                    >
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        ITB
                    </a>
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
                    <p className="text-[11px] text-gray-400 text-center">
                        © 2025 yogiputrap · EL5183 IoT
                    </p>
                </div>
            </aside>
        </>
    );
}
