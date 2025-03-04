import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
import CommentDialogBox from './CommentDialogBox'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const Post = ({ posts }) => {
    const { caption, comments, image, likes, user } = posts
    // console.log(posts)
    // console.log(caption)
    const [open, setopen] = useState(false)
    const [ismenuopen, setismenuopen] = useState(false)
    const data = ['unfollow', 'add to favourites', 'go to post', 'copy link', 'about this account', 'cancel']
    const handleMenuClick = (e) => {
        if (e === 'cancel') {
            setismenuopen(false)
        }
    }
    return (
        <div>
            <div className="post flex flex-col w-[60%] px-1 mx-auto mb-2 mt-4">
                <div className="box-a flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                    <div className="dets">
                        <h3 className="text-[16px]">
                            {user.username}
                        </h3>
                        <p className="text-[12px] text-zinc-300">
                            create
                        </p>
                    </div>
                    <div className="ml-auto relative dot cursor-pointer">
                        <Ellipsis onClick={() => setismenuopen(true)} />
                    </div>
                </div>
                <div className="box-b w-full border mt-2 flex justify-center border-zinc-600  ">
                    <img src={image} alt="" />
                </div>
                <div className="flex py-3 gap-3 ">
                    <Heart size={'20px'} className='cursor-pointer' />
                    <MessageCircle onClick={() => setopen(true)} size={'20px'} className='cursor-pointer' />
                    <Send size={'20px'} className='cursor-pointer' />
                    <Bookmark className='ml-auto cursor-pointer' size={'20px'} />
                </div>
                <CommentDialogBox image={image} open={open} setopen={setopen} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />


                <Dialog open={ismenuopen}>
                    <DialogContent className='p-0 border-none outline-none rounded-lg w-[380px] bg-neutral-900' onInteractOutside={() => setismenuopen(false)}>
                        <DialogTitle className="hidden">Comment Dialog</DialogTitle>

                        <div className="w-full overflow-hidden rounded-lg bg-neutral-900">
                            <div className="flex flex-col">
                                {data.map((e, i) => {
                                    return <button key={i} onClick={() => handleMenuClick(e)} className={`w-full py-4 px-6 text-center focus:outline-none border-b border-neutral-800 transition-colors ${i === 0 ? 'text-red-500' : 'text-white'} capitalize hover:bg-neutral-800`}>
                                        {e}
                                    </button>
                                })}

                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default Post