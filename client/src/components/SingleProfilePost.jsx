import React, { use, useEffect, useState } from 'react';
import { ArrowLeft, MoreHorizontal, Bookmark, Heart, ChevronLeft, MessageCircle } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';
import { toast } from 'sonner';
import { timeAgo } from '@/utils/constant';
import { useMediaQuery } from 'react-responsive';
import CommentDialogBox from './CommentDialogBox';
import EllipsisMenu from './EllipsisMenu';
import { setActiveProfilePosts, setposts } from '@/store/postSlice'
import { useSelector } from 'react-redux';
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";



function SingleProfilePost() {
    const [open, setopen] = useState(false)
    const [post, setPost] = React.useState(null);

    const [liked, setLiked] = useState(false)

    const [ismenuopen, setismenuopen] = useState(false)
    const [delDialog, setdelDialog] = useState(false)
    const reduxPosts = useSelector(state => state.posts.activeProfilePosts)
    const currentUser = useSelector(state => state.userInfo.user)
    const { id } = useParams();
    const navigate = useNavigate()
    console.log(id)
    const isSmallMobile = useMediaQuery({ maxWidth: 600 }); // Detect screen width
    const [likeCounter, setlikeCounter] = useState(0)
    console.log(post)

    console.log(liked)
    const fetchPost = async () => {
        try {
            const res = await apiClient(`/post/getPost/${id}`);
            console.log(res)
            if (res.success) {
                setPost(res.post);
            } else {
                toast.error(res.message)
                navigate('/feed')
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleLike = async () => {
        try {
            const res = await fetch(`http://localhost:3000/post/likeOrDislike/${post._id}`, {
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
                    return e._id == post._id ? {
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

    console.log(likeCounter)
    console.log(post)
    // const isSmallMobile = useMediaQuery({ minWidth: 600 }); // Detect screen width
    useEffect(() => {
        fetchPost()
        if (!isSmallMobile) {
            navigate('/feed')
        }
        return () => {
            setPost(null)
        }
    }, [id])
    useEffect(() => {
        if (post) {
            setLiked(post.likes.includes(currentUser._id));
            setlikeCounter(post.likes)

            if (!isSmallMobile) {
                navigate('/feed');
            }
        }
    }, [post, currentUser._id, isSmallMobile]);
    return post ? (
        <div className="w-full bg-black text-white min-h-screen pb-[80px]">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center  w-full space-x-4">
                    <div onClick={() => navigate(`/profile/${post.user.username}`)} className="absolute z-50 cursor-pointer">
                        <ChevronLeft className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg text-center w-full">Post</h2>
                </div>
            </div>

            {/* User Info */}
            <div className="flex items-center p-4">
                <img
                    onClick={() => navigate(`/profile/${post.user.username}`)}
                    src={post.user.pfp ? post.user.pfp : 'https://www.w3schools.com/howto/img_avatar.png'}
                    loading='lazy'
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div onClick={() => navigate(`/profile/${post.user.username}`)} className="ml-3">
                    <span className="font-semibold text-sm">{post.user?.username}</span>
                    <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                </div>
                <MoreHorizontal onClick={() => setismenuopen(true)} className="ml-auto w-5 h-5" />
            </div>

            {/* Main Image */}
            <div className="bg-gray-800 w-full">
                <img
                    src={post.image}
                    loading='lazy'
                    alt="Post"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center space-x-4">
                    {liked ? <IoMdHeart onClick={handleLike} size={'24px'} className='cursor-pointer text-red-600' /> : <IoMdHeartEmpty onClick={handleLike} size={'24px'} className='cursor-pointer' />}
                    <MessageCircle onClick={() => setopen(true)} className="w-6 h-6" />
                </div>
            </div>

            {/* Likes */}
            <div className="px-4 py-3">
                <p className="text-sm">
                    Liked by <span className="font-semibold">{likeCounter?.length}</span><span className="ml-1 font-semibold">{likeCounter?.length > 1 ? 'pals' : 'pal'}</span>
                </p>
            </div>

            {/* Caption */}
            <div className="px-4 ">
                <p className="text-sm">
                    <span className="font-semibold">{post.user?.username}</span> {post.caption}
                </p>
            </div>

            <CommentDialogBox post={post} image={post.image} open={open} setopen={setopen} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />


            <EllipsisMenu setposts={setActiveProfilePosts} reduxPosts={reduxPosts} user={post.user} posts={post} delDialog={delDialog} setdelDialog={setdelDialog} ismenuopen={ismenuopen} setismenuopen={setismenuopen} />
        </div>
    ) : 'loading...'
}

export default SingleProfilePost;
