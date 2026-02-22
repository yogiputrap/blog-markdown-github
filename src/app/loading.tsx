import ListSkeleton from "@/components/ListSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header skeleton */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                </div>
            </div>
            <main className="max-w-2xl mx-auto px-5 py-6">
                <ListSkeleton />
            </main>
        </div>
    );
}
