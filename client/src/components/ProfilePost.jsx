import React, { useEffect, useState } from 'react'
import CommentDialogBox from './CommentDialogBox'
import { HeartIcon, MessageCircle } from 'lucide-react'
import EllipsisMenu from './EllipsisMenu'
import { useSelector } from 'react-redux'
import { setActiveProfilePosts } from '@/store/postSlice'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

const ProfilePost = ({ posts }) => {
    const [open, setopen] = useState(false)
    const [ismenuopen, setismenuopen] = useState(false)
    const [delDialog, setdelDialog] = useState(false)
    const isSmallMobile = useMediaQuery({ maxWidth: 600 }); // Detect screen width

    const reduxPosts = useSelector(state => state.posts.activeProfilePosts)
    useEffect(() => {
        setopen(false)
    }, [isSmallMobile])
    return (

        <Link to={isSmallMobile ? `/post/${posts._id}` : undefined}
            onClick={!isSmallMobile ? () => setopen(true) : undefined} className="aspect-square sm:cursor-pointer relative">
            <img
                loading='lazy'
                src={posts.image}
                alt={`Posts ${posts.id}`}
                className="w-full h-full object-cover rounded-md max-sm:rounded-xs"
            />
            <div className="absolute hidden text-white inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 group-hover:flex transition-opacity rounded-lg">
                <div className="flex justify-center gap-8 items-center h-full w-full">
                    <div className='flex flex-col items-center '><HeartIcon size={20} className='text-white' /><span className='text-xs' >{posts.likes.length} Likes</span></div>
                    <div className='flex flex-col items-center '><MessageCircle size={20} className='text-white' /><span className='text-xs'>{posts.comments.length} Comments</span></div>
                </div>
            </div>
            <CommentDialogBox post={posts} image={posts.image} open={open} setopen={setopen} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />


            <EllipsisMenu setposts={setActiveProfilePosts} reduxPosts={reduxPosts} user={posts.user} posts={posts} delDialog={delDialog} setdelDialog={setdelDialog} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />
        </Link >
    )
}

export default ProfilePost