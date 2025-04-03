import React from 'react'
import { Skeleton } from './ui/skeleton'

const PostsSkeleton = () => {
    return (
        <div className='max-w-screen-md max-md:mt-[65px] max-md:pb-[80px] mx-auto flex-col flex items-center'>
            {[1, 2, 3].map((e, i) => {
                return <div className="flex flex-col mt-5 items-center w-[60%] max-[768px]:w-[75%] max-[480px]:w-full max-[480px]:p-0 space-y-3">
                    <div className="flex items-center gap-2 w-full max-[480px]:px-3">
                        <Skeleton className='w-10 h-10 rounded-full' />
                        <Skeleton className='w-20 h-5 rounded-full' />
                        <Skeleton className='w-10 ml-auto h-5 rounded-full' />

                    </div>
                    <div className="space-y-2 w-full items-center ">
                        <Skeleton className="h-[23rem] w-full" />
                        <div className="flex max-[480px]:px-3">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className='w-10 ml-auto h-5 rounded-full' />
                        </div>
                    </div>
                </div>
            })}
        </div>
    )
}

export default PostsSkeleton