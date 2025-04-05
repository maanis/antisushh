import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { addBookmark, removeBookmark, removePost } from '@/store/userSlice'
import apiClient from '@/utils/apiClient'
import { useNavigate } from 'react-router-dom'
import { addPal, handleUnpal } from '@/utils/func'

const EllipsisMenu = ({ ismenuopen, setposts, reduxPosts, setismenuopen, user, delDialog, posts, setdelDialog }) => {
    const currentUser = useSelector(state => state.userInfo.user)
    const isOwnProfile = currentUser?._id === user?._id;
    const isPal = currentUser?.pals.includes(user._id);
    const isBookmarked = currentUser?.bookmarks.includes(posts._id);
    const hasSentReq = currentUser?.sentRequests.some(req => req.user === user._id);
    // const [data, setdata] = useState([currentUser?.pals.includes(user._id) ? 'un-pal' : 'add pal', 'delete', currentUser.bookmarks.includes(posts._id) ? 'remove from bookmarks' : 'add to bookmarks', 'go to post', 'about this account', 'cancel'])
    const data = [
        ...(!isOwnProfile
            ? [
                isPal
                    ? 'un-pal'
                    : hasSentReq
                        ? 'cancel req'
                        : 'add pal'
            ]
            : []
        ),
        ...(isOwnProfile ? ['delete'] : []),
        isBookmarked ? 'remove from bookmarks' : 'add to bookmarks',
        'go to post',
        'about this account',
        'cancel', // This is the "close menu" option
    ];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(ismenuopen)
    const handleMenuClick = async (e) => {
        if (e === 'cancel') {
            setismenuopen(false)
        } else if (e === 'delete') {
            setdelDialog(true)
        } else if (e === 'add to bookmarks' || e === 'remove from bookmarks') {
            handleBookmark()
            setismenuopen(false)
        } else if (e === 'go to post') {
            navigate(`/post/${posts._id}`)
            setismenuopen(false)
        } else if (e === 'about this account') {
            navigate(`/profile/${posts.user?.username}`)
            setismenuopen(false)
        } else if (e === 'add pal' || e === 'cancel req') {
            const res = await addPal(user, dispatch, setismenuopen);
        }
        else if (e === 'un-pal') {
            await handleUnpal(user, dispatch, setismenuopen);
        }
    }

    const handleBookmark = async () => {
        try {
            const data = await apiClient(`/post/addOrRemoveToBookmark/${posts?._id}`, "POST")
            if (data.success) {
                toast.success(data.message)
                if (data.message === 'added to bookmark') {
                    dispatch(addBookmark(posts._id))
                    setdata((data) => data.map(e => e === 'add to bookmarks' ? 'remove from bookmarks' : e))
                } else {
                    dispatch(removeBookmark(posts._id))
                    setdata((data) => data.map(e => e === 'remove from bookmarks' ? 'add to bookmarks' : e))
                }
            }
        } catch (error) {
            console.log(error)
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
                dispatch(removePost(posts._id))
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Dialog open={ismenuopen}>
                <DialogContent className='p-0 border-none outline-none rounded-lg w-[380px] max-[490px]:w-[320px] bg-neutral-900' onInteractOutside={() => setismenuopen(false)}>
                    <DialogTitle className="hidden">Comment Dialog</DialogTitle>

                    <div className="w-full overflow-hidden rounded-lg bg-neutral-900">
                        <div className="flex flex-col">
                            {data.map((e, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleMenuClick(e)}
                                    className={` w-full py-4 px-6 text-center border-b border-neutral-800 capitalize transition-colors focus:outline-none ${['delete', 'unfollow', 'un-pal'].includes(e) ? 'text-red-500' : 'text-white'}  hover:bg-neutral-800`}
                                >
                                    {e}
                                </button>
                            ))}

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={delDialog}>
                <DialogContent className='max-w-lg max-md:max-w-[400px] max-[550px]:w-[300px] max-[550px]:p-4 max-[500px]:py-5 max-[500px]:rounded-sm'>
                    <DialogTitle className='hidden'>Comment</DialogTitle>
                    <div className='text-center max-md:text-sm text-lg font-semibold max-[550px]:text-xs'>Are you sure you want to delete this post?</div>
                    <div className='flex gap-2  justify-end'>
                        <button onClick={() => setdelDialog(false)} className='bg-zinc-300 px-2 py-1 rounded-md max-md:text-sm max-[550px]:text-xs max-[550px]:px-2 max-[550px]:py-[2px] max-[550px]:h-7 '>Cancel</button>
                        <button className='bg-red-600 hover:bg-red-700 max-md:text-[14px] px-2 py-1 rounded-md max-md:text-sm max-[550px]:text-xs max-[550px]:px-2 max-[550px]:py-[2px] text-white max-[550px]:h-7' onClick={() => handleDelete(posts._id)}>Delete</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EllipsisMenu;