"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onSort: (sort: "newest" | "oldest") => void;
    currentSort: "newest" | "oldest";
}

export default function SearchBar({
    onSearch,
    onSort,
    currentSort,
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [showSort, setShowSort] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSort(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    id="search-input"
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search Blogs"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-gray-50 transition-all duration-150"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); onSearch(""); }}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Sort Button */}
            <div className="relative" ref={sortRef}>
                <button
                    onClick={() => setShowSort(!showSort)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${currentSort === "oldest"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    aria-label="Sort"
                    id="sort-button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                </button>

                {showSort && (
                    <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-100 overflow-hidden z-50">
                        <button
                            onClick={() => { onSort("newest"); setShowSort(false); }}
                            className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${currentSort === "newest"
                                    ? "text-gray-900 font-medium bg-gray-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                            id="sort-newest"
                        >
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Newest first
                        </button>
                        <button
                            onClick={() => { onSort("oldest"); setShowSort(false); }}
                            className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${currentSort === "oldest"
                                    ? "text-gray-900 font-medium bg-gray-50"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                            id="sort-oldest"
                        >
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Oldest first
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
