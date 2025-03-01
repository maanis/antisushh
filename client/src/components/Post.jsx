import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from 'lucide-react'
import React from 'react'

const Post = () => {
    return (
        <div>
            <div className="post flex flex-col w-[60%] px-1 mx-auto mb-2 mt-4">
                <div className="box-a flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                    <div className="dets">
                        <h3 className="text-[16px]">
                            username
                        </h3>
                        <p className="text-[12px] text-zinc-300">
                            create
                        </p>
                    </div>
                    <div className="ml-auto relative dot cursor-pointer">
                        <Ellipsis />
                    </div>
                </div>
                <div class="box-b w-full border mt-2 flex justify-center border-zinc-600  ">
                    <img src="https://media.istockphoto.com/id/1477186301/photo/portrait-of-handsome-and-confident-young-man-looking-at-camera.jpg?s=2048x2048&w=is&k=20&c=CL7D_yiPDcH44yqVxE-oSncDzf2JM7RujyiO2JQPumI=" alt="" />
                </div>
                <div className="flex py-3 gap-3 ">
                    <Heart size={'20px'} className='cursor-pointer' />
                    <MessageCircle size={'20px'} className='cursor-pointer' />
                    <Send size={'20px'} className='cursor-pointer' />
                    <Bookmark className='ml-auto cursor-pointer' size={'20px'} />
                </div>
            </div>
        </div>
    )
}

export default Post