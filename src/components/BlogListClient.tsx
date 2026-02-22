"use client";

import { useState, useMemo } from "react";
import { Post } from "@/lib/posts";
import SearchBar from "./SearchBar";
import PostCard from "./PostCard";
import HeroSlider from "./HeroSlider";

interface BlogListClientProps {
    posts: Post[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "oldest">("newest");
    const [activeTab, setActiveTab] = useState<"latest" | "featured" | "topics">("latest");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // All unique tags
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
        return Array.from(tagSet).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        let result = [...posts];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        if (activeTab === "featured") {
            result = result.filter((p) => p.featured);
        } else if (activeTab === "topics" && selectedTag) {
            result = result.filter((p) => p.tags.includes(selectedTag));
        }

        if (sort === "oldest") result = [...result].reverse();

        return result;
    }, [posts, search, sort, activeTab, selectedTag]);

    const tabs = [
        { key: "latest" as const, label: "Latest" },
        { key: "featured" as const, label: "Featured" },
        { key: "topics" as const, label: "Topics" },
    ];

    // Show slider only on Latest tab without active search
    const showSlider = activeTab === "latest" && !search.trim();

    return (
        <div>
            {/* Search bar */}
            <div className="px-4 pt-4 pb-3">
                <SearchBar onSearch={setSearch} onSort={setSort} currentSort={sort} />
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-100 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            if (tab.key !== "topics") setSelectedTag(null);
                        }}
                        className={`relative mr-5 pb-3 pt-1 text-[13px] font-medium transition-colors ${activeTab === tab.key ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                            }`}
                        id={`tab-${tab.key}`}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tags */}
            {activeTab === "topics" && (
                <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-gray-50">
                    {allTags.length === 0 ? (
                        <p className="text-sm text-gray-400">No tags found</p>
                    ) : (
                        allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${selectedTag === tag
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                id={`tag-${tag}`}
                            >
                                {tag}
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Post list */}
            <div className="py-1">
                {filteredPosts.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                ))}
            </div>

            {/* Empty state */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-sm font-medium text-gray-400">No posts found</p>
                    {search && (
                        <p className="text-xs text-gray-300 mt-1">Try a different search term</p>
                    )}
                </div>
            )}

            {/* Hero slider — below post list, only on Latest tab */}
            {showSlider && posts.length > 0 && (
                <div className="pb-6">
                    <div className="flex items-center gap-2 px-4 pt-2 pb-3">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                            Highlights
                        </span>
                        <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <HeroSlider posts={posts} />
                </div>
            )}
        </div>
    );
}
