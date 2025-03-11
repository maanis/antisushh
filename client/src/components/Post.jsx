import { Bookmark, BookmarkCheck, Ellipsis, Heart, HeartHandshake, MessageCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
import CommentDialogBox from './CommentDialogBox'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { userDefaultPfp } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { setposts } from '@/store/postSlice'
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from 'react-router-dom'
import EllipsisMenu from './EllipsisMenu'
import apiClient from '@/utils/apiClient'
import { addBookmark, removeBookmark } from '@/store/userSlice'

const Post = ({ posts }) => {
    const { caption, comments, image, likes, user } = posts
    const currentUser = useSelector(state => state.userInfo.user)
    const [liked, setLiked] = useState(likes.includes(currentUser._id) || false)
    const [likeCounter, setlikeCounter] = useState(likes)

    const reduxPosts = useSelector(state => state.posts.posts)
    const dispatch = useDispatch()
    const createdAt = new Date(posts.createdAt).toLocaleString();
    const date = new Date(createdAt);
    const formattedTime = `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const [open, setopen] = useState(false)
    const [ismenuopen, setismenuopen] = useState(false)
    const [delDialog, setdelDialog] = useState(false)
    const data = ['unfollow', 'delete', 'add to favourites', 'go to post', 'copy link', 'about this account', 'cancel']
    const handleMenuClick = (e) => {
        if (e === 'cancel') {
            setismenuopen(false)
        } else if (e === 'delete') {
            setdelDialog(true)
        }
    }
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/post/deletePost/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) {
                setdelDialog(false)
                toast.success(data.message)
                dispatch(setposts(reduxPosts.filter(e => e._id !== id)))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async () => {
        try {
            const res = await fetch(`http://localhost:3000/post/likeOrDislike/${posts._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) {
                setLiked(!liked)
                if (data.message === 'liked') {
                    setlikeCounter([...likeCounter, currentUser._id])
                } else {
                    setlikeCounter(likeCounter.filter(e => e !== currentUser._id))
                }
                const updatedReduxPosts = reduxPosts.map(e => {
                    return e._id == posts._id ? {
                        ...e,
                        likes: data.message === 'liked' ? [...e.likes, currentUser._id] : e.likes.filter(e => e !== currentUser._id)
                    } : e
                })
                dispatch(setposts(updatedReduxPosts))
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBookmark = async () => {
        try {
            const data = await apiClient(`/post/addOrRemoveToBookmark/${posts._id}`, "POST")
            if (data.success) {
                toast.success(data.message)
                if (data.message === 'added to bookmark') {
                    dispatch(addBookmark(posts._id))
                } else {
                    dispatch(removeBookmark(posts._id))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className="post flex flex-col w-[60%] pb-8 px-1 mx-auto mb-2 mt-4">
                <div className="box-a flex items-center gap-2">
                    <Link to={`/profile/${user?.username}`}><img src={user?.pfp ? user?.pfp : userDefaultPfp}
                        className="w-10 h-10 object-cover object-top rounded-full" alt="" /></Link>
                    <div className="dets ml-1">
                        <Link to={`/profile/${user?.username}`}><h3 className="text-[16px]">
                            {user?.username}
                        </h3></Link>
                        <p className="text-[12px] text-zinc-500">
                            {formattedTime}
                        </p>
                    </div>
                    <div className="ml-auto relative dot cursor-pointer">
                        <Ellipsis onClick={() => setismenuopen(true)} />
                    </div>
                </div>
                <div className="box-b w-full border mt-2 flex justify-center border-zinc-800  ">
                    <img className='select-none' src={image} alt="" />
                </div>

                <div className="flex pt-3 pb-2 gap-3 items-center">
                    {liked ? <IoMdHeart onClick={handleLike} size={'24px'} className='cursor-pointer text-red-600' /> : <IoMdHeartEmpty onClick={handleLike} size={'24px'} className='cursor-pointer' />}
                    <MessageCircle onClick={() => setopen(true)} size={'20px'} className='cursor-pointer' />
                    <Send size={'20px'} className='cursor-pointer' />
                    {currentUser.bookmarks.includes(posts._id) ? <BookmarkCheck onClick={handleBookmark} className='ml-auto cursor-pointer' size={'20px'} /> : <Bookmark onClick={handleBookmark} className='ml-auto cursor-pointer' size={'20px'} />}

                </div>
                <h2>{likeCounter.length} {likeCounter.length <= 1 ? 'like' : 'likes'}</h2>
                <div className="flex items-center">
                    <h2 className='font-semibold'>{user?.username}</h2>
                    <p className='ml-2 text-zinc-300 font-light'>{caption}</p>
                </div>
                <CommentDialogBox post={posts} image={image} open={open} setopen={setopen} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />

                <EllipsisMenu setposts={setposts} posts={posts} reduxPosts={reduxPosts} user={posts.user} ismenuopen={ismenuopen} setismenuopen={setismenuopen} delDialog={delDialog} setdelDialog={setdelDialog} />
            </div>
        </div>
    )
}

export default Post