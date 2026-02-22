export function PostCardSkeleton() {
    return (
        <div className="flex gap-4 px-4 py-3.5 animate-pulse">
            <div className="flex-shrink-0 w-[104px] h-[104px] rounded-[14px] bg-gray-100" />
            <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="h-2.5 w-14 bg-gray-100 rounded-full" />
                <div className="h-4 w-5/6 bg-gray-100 rounded-full" />
                <div className="h-4 w-3/5 bg-gray-100 rounded-full" />
                <div className="flex gap-3 mt-1">
                    <div className="h-2.5 w-10 bg-gray-100 rounded-full" />
                    <div className="h-2.5 w-10 bg-gray-100 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function ListSkeleton() {
    return (
        <div>
            {/* Search skeleton */}
            <div className="px-4 pt-4 pb-3 flex gap-2">
                <div className="flex-1 h-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
            </div>
            {/* Tabs skeleton */}
            <div className="flex gap-5 px-4 pb-3 border-b border-gray-100">
                <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
            {/* Cards */}
            <div className="py-1">
                {Array.from({ length: 6 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
