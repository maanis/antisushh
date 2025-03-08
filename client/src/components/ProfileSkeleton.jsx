import { Skeleton } from "./ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="min-h-screen relative w-[55%] overflow-y-hidden mx-auto text-white">
            <Skeleton className="w-full  h-48" />
            <div className="absolute top-[90px] left-10">
                <Skeleton className="w-40 h-40 rounded-full border-4 border-neutral-600" />
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                <div className="flex justify-between items-center mb-4 mt-5 w-full">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-28 rounded-lg" />
                    ))}
                </div>
                <div className="border-b border-zinc-700 flex gap-8 p-4">

                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full h-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}