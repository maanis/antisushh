import React from 'react'
import Home from './Home'
import RightSideBar from './RightSideBar'
import { userDefaultPfp } from '@/utils/constant'
import { Skeleton } from './ui/skeleton'

const FeedLoader = ({ suggestedUsers }) => {
    return (
        <div className='h-full  flex overflow-y-auto text-zinc-200 w-full'>
            <div className='w-[75%] border-r border-zinc-700'>
                <div className="pb-3 flex flex-col max-lg:w-[65%] max-md:w-[80%] border-b border-zinc-700 max-lg:bg-zinc-950
                            w-full bg-zinc-950 ">
                    <div className="w-full py-4 h-[25%] max-lg:hidden p-3 bg-zinc-900 rounded-md">
                        <div className="flex py-3 items-center justify-center gap-4">
                            <img src={userDefaultPfp}
                                className="w-10 h-10 rounded-full object-cover object-top" alt="" />
                            <input type="text" placeholder="want to share thought of the day?"
                                className="createPost outline-none w-[75%] py-2 max-lg:w-[385px] max-[1024px]:w-[260px] max-md:hidden bg-zinc-950 rounded-md pl-4"
                                name="" id="" />
                            <button className="text-zinc-950 bg-white px-6 py-2 outline-none rounded-md text-nowrap">Share</button>
                        </div>

                    </div>

                    <div className="flex items-center mt-2 max-md:hidden pr-4 py-2">
                        <div className="seperation w-full  h-[.5px]  bg-zinc-700 "></div>
                        <div className="select flex gap-1">
                            <p className="text-nowrap text-zinc-400 ml-1 max-lg:text-[11px]">sort by:</p>
                            <select id="viewToggle" name="viewToggle"
                                className="bg-transparent cursor-pointer max-lg:text-[13px] text-white border-none outline-none focus:ring-0 focus:border-transparent">
                                <option className="bg-black text-white">Following</option>
                                <option className="bg-black text-white">Everyone</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='max-w-screen-md mx-auto'>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px]  w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
            </div>

            <RightSideBar suggestedUsers={suggestedUsers} />

        </div>
    )
}

export default FeedLoader