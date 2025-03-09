import React, { useState } from 'react'
import CommentDialogBox from './CommentDialogBox'
import { HeartIcon, MessageCircle } from 'lucide-react'
import EllipsisMenu from './EllipsisMenu'
import { useSelector } from 'react-redux'
import { setActiveProfilePosts } from '@/store/postSlice'

const ProfilePost = ({ posts }) => {
    console.log(posts)
    const [open, setopen] = useState(false)

    const [ismenuopen, setismenuopen] = useState(false)
    const [delDialog, setdelDialog] = useState(false)
    const reduxPosts = useSelector(state => state.posts.activeProfilePosts)
    return (

        <div onClick={() => setopen(true)} className="aspect-square cursor-pointer relative">
            <img

                src={posts.image}
                alt={`Posts ${posts.id}`}
                className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute hidden text-white inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 group-hover:flex transition-opacity rounded-lg">
                <div className="flex justify-center gap-8 items-center h-full w-full">
                    <div className='flex flex-col items-center '><HeartIcon size={20} className='text-white' /><span className='text-xs' >{posts.likes.length} Likes</span></div>
                    <div className='flex flex-col items-center '><MessageCircle size={20} className='text-white' /><span className='text-xs'>{posts.comments.length} Comments</span></div>
                </div>
            </div>
            <CommentDialogBox post={posts} image={posts.image} open={open} setopen={setopen} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />

            {/* <Dialog open={ismenuopen}>
                <DialogContent className='p-0 border-none outline-none rounded-lg w-[380px] bg-neutral-900' onInteractOutside={() => setismenuopen(false)}>
                    <DialogTitle className="hidden">Comment Dialog</DialogTitle>

                    <div className="w-full overflow-hidden rounded-lg bg-neutral-900">
                        <div className="flex flex-col">
                            {data.map((e, i) => {
                                // Check if the current user is the post user
                                if (e === 'delete' && currentUser._id === user._id) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleMenuClick(e)}
                                            className="w-full py-4 px-6 text-center focus:outline-none border-b border-neutral-800 transition-colors text-red-500 capitalize hover:bg-neutral-800"
                                        >
                                            {e}
                                        </button>
                                    );
                                } else if (e !== 'delete') {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleMenuClick(e)}
                                            className={`w-full py-4 px-6 text-center focus:outline-none border-b border-neutral-800 transition-colors capitalize hover:bg-neutral-800 ${e === 'unfollow' ? 'text-red-500' : 'text-white'}`}
                                        >
                                            {e}
                                        </button>
                                    );
                                }

                                return null;
                            })}


                        </div>
                    </div>
                </DialogContent>
            </Dialog> */}


            <EllipsisMenu setposts={setActiveProfilePosts} reduxPosts={reduxPosts} user={posts.user} posts={posts} delDialog={delDialog} setdelDialog={setdelDialog} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />
        </div>
    )
}

export default ProfilePost