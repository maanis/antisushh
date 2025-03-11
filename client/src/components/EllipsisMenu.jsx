import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { addBookmark, removeBookmark, removePost } from '@/store/userSlice'
import apiClient from '@/utils/apiClient'

const EllipsisMenu = ({ ismenuopen, setposts, reduxPosts, setismenuopen, user, delDialog, posts, setdelDialog }) => {
    const currentUser = useSelector(state => state.userInfo.user)
    const [data, setdata] = useState(['unfollow', 'delete', currentUser.bookmarks.includes(posts._id) ? 'remove from bookmarks' : 'add to bookmarks', 'go to post', 'copy link', 'about this account', 'cancel'])
    const dispatch = useDispatch()
    const handleMenuClick = (e) => {
        if (e === 'cancel') {
            setismenuopen(false)
        } else if (e === 'delete') {
            setdelDialog(true)
        } else if (e === 'add to bookmarks' || e === 'remove from bookmarks') {
            handleBookmark()
            setismenuopen(false)
        }
    }

    const handleBookmark = async () => {
        try {
            const data = await apiClient(`/post/addOrRemoveToBookmark/${posts._id}`, "POST")
            if (data.success) {
                toast.success(data.message)
                if (data.message === 'added to bookmark') {
                    dispatch(addBookmark(posts._id))
                    setdata((data) => data.map(e => e === 'add to bookmarks' ? 'remove from bookmarks' : e))
                    console.log(data)
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
            </Dialog>
            <Dialog open={delDialog}>
                <DialogContent className='max-w-lg'>
                    <DialogTitle className='hidden'>Comment</DialogTitle>
                    <div className='text-center text-lg font-semibold'>Are you sure you want to delete this post?</div>
                    <div className='flex gap-2  justify-end'>
                        <Button onClick={() => setdelDialog(false)}>Cancel</Button>
                        <Button className='bg-red-600 hover:bg-red-700' onClick={() => handleDelete(posts._id)}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EllipsisMenu