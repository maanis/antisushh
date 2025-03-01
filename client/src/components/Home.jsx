import React from 'react'
import Post from './Post'

const Home = () => {
    return (
        <div className='w-[80%]'>
            <div className="pb-3 flex flex-col max-lg:w-[65%] max-md:w-[80%] border-b border-zinc-700 max-lg:bg-zinc-950
                w-full bg-zinc-950 ">
                <div className="w-full py-4 h-[25%] max-lg:hidden p-3 bg-zinc-900 rounded-md">
                    <div className="flex py-3 items-center justify-center gap-4">
                        <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                {[1, 2, 3, 4].map((e, i) => {
                    return <Post key={i} />
                })}
            </div>
        </div>

    )
}

export default Home