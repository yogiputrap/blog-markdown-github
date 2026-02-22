export default function DetailLoading() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            {/* Header skeleton */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gray-100" />
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-100" />
                        <div className="w-10 h-10 rounded-xl bg-gray-100" />
                    </div>
                </div>
            </div>

            {/* Hero skeleton */}
            <div className="max-w-2xl mx-auto">
                <div className="w-full aspect-[2/1] bg-gray-200" />

                <div className="px-5 py-6 space-y-5">
                    {/* Byline skeleton */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-gray-200 rounded-full" />
                            <div className="h-2.5 w-32 bg-gray-100 rounded-full" />
                        </div>
                    </div>

                    {/* Title skeleton */}
                    <div className="space-y-2">
                        <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
                        <div className="h-8 w-1/2 bg-gray-200 rounded-lg" />
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-3 pt-4">
                        <div className="h-4 w-full bg-gray-100 rounded-full" />
                        <div className="h-4 w-full bg-gray-100 rounded-full" />
                        <div className="h-4 w-5/6 bg-gray-100 rounded-full" />
                        <div className="h-4 w-full bg-gray-100 rounded-full" />
                        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
                        <div className="h-20 w-full bg-gray-100 rounded-xl mt-4" />
                        <div className="h-4 w-full bg-gray-100 rounded-full" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
