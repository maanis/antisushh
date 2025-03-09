import { Cross, CrossIcon, Globe, HeartIcon, Home, Loader2, LogOut, LucideCross, MessageCircle, PlusSquare, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { addPost, setUser } from '@/store/userSlice'
import apiClient from '@/utils/apiClient'


const Sidebar = () => {
    const navigate = useNavigate('/')
    const [querryResults, setquerryResults] = useState([])
    const [input, setinput] = useState('')
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.posts)
    const [loading, setloading] = useState(false);
    const imgRef = useRef('')
    const [createDialog, setcreateDialog] = useState(false)
    const [preview, setpreview] = useState(false)
    const [caption, setcaption] = useState('')
    const [image, setimage] = useState('')
    const [searchDialog, setsearchDialog] = useState(false)
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
        const data = await apiClient('/logout')
        if (data.success) {
            navigate('/')
            dispatch(setUser(null))
            dispatch(setposts([]))
            toast.success(data.message)
        }
    }
    const handleMenuClick = (e) => {
        if (e === 'create') {
            setcreateDialog(true)
        } else if (e === 'home') {
            navigate('/feed')
        } else if (e === 'search') {
            setsearchDialog(true)
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
        if (!caption) return toast.error('Please fill all the fields')
        if (!preview) return toast.error('Please upload an image')

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
                dispatch(setposts([...posts, res.newPost]))
                dispatch(addPost(res.newPost._id))
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

    const searchQuerry = async () => {
        if (!input.trim()) return; // Prevent empty API calls

        try {
            const data = await apiClient(`/user/searchQuerry/${input}`);
            setquerryResults(data.users)
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await searchQuerry();
        };

        if (!input) {
            setquerryResults([])
        }

        fetchData(); // Call the async function

    }, [input]);
    return (
        <div className='w-[18%] flex flex-col px-3 py-4 border-r text-white border-zinc-700 h-full'>
            <h2 className='font-extralight text-3xl logoText my-5 mb-8'>AntiSush</h2>
            {data.map((e, i) => {
                return <button onClick={() => handleMenuClick(e.text)} className='flex cursor-pointer gap-2 my-2 font-medium items-center hover:bg-zinc-800 rounded-md px-3 py-3 ' key={i}>
                    <span className='text-sm'>{e.icon}</span>
                    <h3 className='capitalize'>{e.text}</h3>
                </button>
            })}
            <div className='mt-auto'>
                <Link to={`/profile/${user?.username}`} className="flex cursor-pointer items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                    <img src={user?.pfp ? user.pfp : userDefaultPfp} className='w-8 h-8 object-cover rounded-full ' alt="" />
                    <h3>{user?.name}</h3>
                </Link>
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
                    <DialogContent onInteractOutside={() => setcreateDialog(false)} className='w-[35rem] bg-zinc-300 rounded-lg outline-none border-none'>
                        <DialogTitle className='hidden'>title</DialogTitle>
                        <div className='text-neutral-900  text-center text-xl font-semibold'>Create a Post</div>
                        <textarea value={caption} onChange={(e) => setcaption(e.target.value)} className='rounded-md max-h-20 outline-none text-black min-h-12 px-3 py-2' placeholder='Enter a caption...'></textarea>
                        <input onChange={handleImageUpload} ref={imgRef} type="file" className='hidden' />
                        {preview && <div className='w-full relative flex items-center justify-center'><img src={preview} className='rounded-md max-h-[45vh] w-full object-cover' /><X className='absolute top-0 p-0 right-0 cursor-pointer text-red-500' onClick={() => setpreview(null)} /></div>}
                        <button onClick={() => imgRef.current.click()} className='bg-blue-600 shadow-lg inline-block w-fit px-3 py-1 rounded-md text-white font-semibold hover:bg-blue-700 transition-all'>Upload an image</button>

                        <button
                            onClick={handleCreatePost}
                            type="submit"
                            className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 transition-colors text-white rounded-lg p-3 mt-6 font-medium hover:from-neutral-500 hover:to-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                        >
                            {loading ? (<h2 className='flex w-full justify-center gap-1'><Loader2 className='animate-spin font-bold' /><span>Please wait...</span></h2>) : 'Post'}
                        </button>
                    </DialogContent>
                </Dialog>

                <Dialog open={searchDialog}>
                    <DialogContent className='h-[24rem] w-[35rem] p-0' onInteractOutside={() => {
                        setsearchDialog(false)
                        setinput('')
                    }}>
                        <DialogTitle className='hidden'></DialogTitle>
                        <div className='h-full p-3 w-full flex flex-col'>
                            <h2 className='text-center font-semibold mb-2 text-2xl'>Search</h2>
                            <div className='w-full mb-2 relative'>
                                <input value={input} onChange={(e) => setinput(e.target.value)} type="text" className='w-full rounded-md px-3 py-1 border-none outline-none' placeholder='enter a username...' />
                                {input.trim() != '' && <X onClick={() => setinput('')} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />}
                            </div>
                            <hr />
                            <hr />
                            <div className='flex flex-col p-3 gap-3 overflow-y-auto h-[17rem]'>
                                {querryResults.length > 0 ? querryResults.map((e) => <div className='w-full flex items-center gap-3'>
                                    <Link onClick={() => {
                                        setsearchDialog(false)
                                        setinput('')
                                    }} to={`/profile/${e.username}`} className='flex items-center gap-3'><img src={e.pfp ? e.pfp : userDefaultPfp} className='w-10 h-10 rounded-full object-cover' alt="" />
                                        <span>{e.username}</span></Link>
                                    <button className='ml-auto py-[2px] px-4 bg-blue-500 rounded-md text-white hover:bg-blue-700 transition-all '>Alias</button>
                                </div>) : <h2 className='text-center text-zinc-400'>No user</h2>
                                }
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}

export default Sidebar