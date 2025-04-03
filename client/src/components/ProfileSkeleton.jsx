import { Skeleton } from "./ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="min-h-screen relative max-md:pb-[70px] w-[55%]  max-sm:w-full max-[900px]:w-[65%] max-md:w-[75%] overflow-y-hidden mx-auto text-white">
            <Skeleton className="w-full max-sm:h-32 h-48" />
            <div className="absolute top-[90px] left-10">
                <Skeleton className="w-40 h-40 max-md:h-32 max-md:w-32 max-sm:h-28 max-sm:w-28 rounded-full border-4 border-neutral-600" />
            </div>
            <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 max-sm:mx-4 pt-20 pb-8">
                <div className="flex justify-between items-center  mb-4 mt-5 w-full">
                    <Skeleton className="h-4 w-40 max-sm:w-28 " />
                    <Skeleton className="h-10 w-32 max-sm:h-7 max-sm:w-24" />
                </div>
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex gap-4 max-sm:justify-between">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-28 max-sm:h-7 max-sm:w-24 rounded-lg" />
                    ))}
                </div>
                <div className="border-b border-zinc-700 flex gap-8 p-4">

                </div>
                <div className="p-4 grid max-sm:px-0 grid-cols-3 gap-4  max-sm:gap-1">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full h-full max-sm:rounded-xs rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}