import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
import CommentDialogBox from './CommentDialogBox'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { userDefaultPfp } from '@/utils/constant'
import { useSelector } from 'react-redux'

const Post = ({ posts }) => {
    const { caption, comments, image, likes, user } = posts
    const createdAt = new Date(posts.createdAt).toLocaleString();
    const currentUser = useSelector(state => state.userInfo.user)
    console.log(currentUser)
    const date = new Date(createdAt);
    const formattedTime = `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    console.log(formattedTime);
    // console.log(posts)
    // console.log(caption)
    const [open, setopen] = useState(false)
    const [ismenuopen, setismenuopen] = useState(false)
    const data = ['unfollow', 'delete', 'add to favourites', 'go to post', 'copy link', 'about this account', 'cancel']
    const handleMenuClick = (e) => {
        if (e === 'cancel') {
            setismenuopen(false)
        }
    }
    return (
        <div>
            <div className="post flex flex-col w-[60%] px-1 mx-auto mb-2 mt-4">
                <div className="box-a flex items-center gap-2">
                    <img src={user.pfp ? user.pfp : userDefaultPfp}
                        className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                    <div className="dets ml-1">
                        <h3 className="text-[16px]">
                            {user.username}
                        </h3>
                        <p className="text-[12px] text-zinc-500">
                            {formattedTime}
                        </p>
                    </div>
                    <div className="ml-auto relative dot cursor-pointer">
                        <Ellipsis onClick={() => setismenuopen(true)} />
                    </div>
                </div>
                <div className="box-b w-full border mt-2 flex justify-center border-zinc-800  ">
                    <img src={image} alt="" />
                </div>
                <div className="flex items-center mt-2">
                    <h2 className='font-semibold'>{user.username}</h2>
                    <p className='ml-2 text-zinc-300 font-light'>{caption}</p>
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
                                    return <button key={i} onClick={() => handleMenuClick(e)} className={`w-full py-4 px-6 text-center focus:outline-none border-b border-neutral-800 transition-colors ${i === 0 || i === 1 ? 'text-red-500' : 'text-white'} capitalize hover:bg-neutral-800`}>
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