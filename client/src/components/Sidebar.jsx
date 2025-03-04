import { Cross, CrossIcon, Globe, HeartIcon, Home, Loader2, LogOut, LucideCross, MessageCircle, PlusSquare, Search, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import { fileToUrl, userDefaultPfp } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { setposts } from '@/store/postSlice'


const Sidebar = () => {
    const navigate = useNavigate('/')
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.posts)
    const [loading, setloading] = useState(false);
    const imgRef = useRef('')
    const [createDialog, setcreateDialog] = useState(false)
    const [preview, setpreview] = useState(false)
    const [caption, setcaption] = useState('')
    const [image, setimage] = useState('')
    const data = [
        { icon: <Home size={'20px'} />, text: 'home' },
        { icon: <Search size={'20px'} />, text: 'search' },
        { icon: <Globe size={'20px'} />, text: 'explore' },
        { icon: <MessageCircle size={'20px'} />, text: 'messages' },
        { icon: <HeartIcon size={'20px'} />, text: 'notifications' },
        { icon: <PlusSquare size={'20px'} />, text: 'create' },
    ]
    const { user } = useSelector(state => state.userInfo)
    const handleLogout = async () => {
        const res = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
            navigate('/')
            toast.success(data.message)
        }
    }
    const handleMenuClick = (e) => {
        if (e === 'create') {
            setcreateDialog(true)
        }
    }

    const handleImageUpload = () => {
        const file = imgRef.current.files[0]
        if (file) {
            setimage(file)
            const url = fileToUrl(file);
            setpreview(url);
        }
    }

    const handleCreatePost = async () => {
        try {
            setloading(true)
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('image', image);
            const data = await fetch('http://localhost:3000/post/create', {
                credentials: 'include',
                method: 'POST',
                body: formData,
            })
            const res = await data.json();
            if (res.success) {
                toast.success(res.message)
                setcreateDialog(false)
                dispatch(setposts([...posts, res.post]))
                setcaption('')
                setpreview(null)
                setimage(null)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setloading(false)
        }
    }
    return (
        <div className='w-[15%] flex flex-col px-3 py-4 border-r border-zinc-700 h-full'>
            <h2 className='font-extralight text-3xl logoText my-5 mb-8'>AntiSush</h2>
            {data.map((e, i) => {
                return <button onClick={() => handleMenuClick(e.text)} className='flex cursor-pointer gap-2 my-2 font-medium items-center hover:bg-zinc-800 rounded-md px-3 py-3 ' key={i}>
                    <span className='text-sm'>{e.icon}</span>
                    <h3 className='capitalize'>{e.text}</h3>
                </button>
            })}
            <div className='mt-auto'>
                <div className="flex cursor-pointer items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                    <img src={user?.pfp ? user.pfp : userDefaultPfp} className='w-8 h-8 object-cover rounded-full ' alt="" />
                    <h3>{user?.name}</h3>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger className='w-full'><div className="flex cursor-pointer w-full mt-2 items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                        <LogOut size={'20px'} />
                        <h3>Logout</h3>
                    </div></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You want to logout your profile
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-red-600 hover:bg-red-700 transition-all' onClick={handleLogout}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={createDialog}>
                    <DialogContent onInteractOutside={() => setcreateDialog(false)} className='w-[90rem] bg-zinc-300 rounded-lg outline-none border-none'>
                        <DialogTitle className='hidden'>title</DialogTitle>
                        <div className='text-neutral-900  text-center text-xl font-semibold'>Create a Post</div>
                        <textarea value={caption} onChange={(e) => setcaption(e.target.value)} className='rounded-md max-h-20 outline-none text-black min-h-12 px-3 py-2' placeholder='Enter a caption...'></textarea>
                        <input onChange={handleImageUpload} ref={imgRef} type="file" className='hidden' />
                        {preview && <div className='w-full relative flex items-center justify-center'><img src={preview} className='rounded-md max-h-[45vh] w-full object-cover' /><X className='absolute top-0 p-0 right-0 cursor-pointer text-red-500' onClick={() => setpreview(null)} /></div>}
                        <button onClick={() => imgRef.current.click()} className='bg-blue-600 shadow-lg inline-block w-fit px-3 py-1 rounded-md text-white font-semibold hover:bg-blue-700 transition-all'>Upload an image</button>

                        <button
                            onClick={handleCreatePost}
                            disabled={!caption || !preview}
                            type="submit"
                            className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 transition-colors text-white rounded-lg p-3 mt-6 font-medium hover:from-neutral-500 hover:to-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                        >
                            {loading ? (<h2 className='flex w-full justify-center gap-1'><Loader2 className='animate-spin font-bold' /><span>Please wait...</span></h2>) : 'Post'}
                        </button>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}

export default Sidebar