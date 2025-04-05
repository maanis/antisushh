import { Cross, CrossIcon, Globe, HeartIcon, Home, Loader2, LogOut, LucideCross, MessageCircle, PlusSquare, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebookMessenger } from "react-icons/fa";

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
import { addActiveProfilePosts, setActiveProfilePosts, setposts, setSearchDialog } from '@/store/postSlice'
import { addPost, setUser } from '@/store/userSlice'
import apiClient from '@/utils/apiClient'
import { clearUnreadChats, setOnlineUsers } from '@/store/chatSlice'
import NotificationDialog from './NotificationDialog'
import { setNotifications } from '@/store/notificationsSlice'
import { useMediaQuery } from 'react-responsive'
import imageCompression from 'browser-image-compression';
import { addPal } from '@/utils/func';


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
    // const [searchDialog, setsearchDialog] = useState(false)
    const [isChatSection, setisChatSection] = useState(localStorage.getItem('chatSection') === 'true' ? true : false)
    const { notifications } = useSelector(store => store.notifications);
    const toRead = notifications?.filter(e => !e.isRead)
    const isSidebarLogo = useMediaQuery({ query: "(max-width: 900px)" });
    const isMd = useMediaQuery({ query: "(max-width: 768px)" });

    const { searchDialog } = useSelector(state => state.posts)

    const data = [
        { icon: <Home size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'home' },
        { icon: <Search size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'search' },
        { icon: <Globe size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'explore' },
        { icon: <FaFacebookMessenger size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'messages' },
        { icon: <HeartIcon size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'notifications' },
        { icon: <PlusSquare size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px] max-[768px]:size-[26px]' />, text: 'create' },
    ]
    const { user } = useSelector(state => state.userInfo)
    const { unreadChats } = useSelector(state => state.chat)
    const handleLogout = async () => {
        const data = await apiClient('/logout')
        if (data.success) {
            navigate('/')
            dispatch(setUser(null))
            dispatch(setposts([]))
            dispatch(clearUnreadChats())
            dispatch(setNotifications([]))
            localStorage.setItem('chatSection', false)
            dispatch(setOnlineUsers(null));
            toast.success(data.message)
        }
    }
    const handleMenuClick = (e) => {
        if (e === 'create') {
            setcreateDialog(true)
        } else if (e === 'home') {
            setisChatSection(false)
            navigate('/feed')
            localStorage.setItem('chatSection', false)
        } else if (e === 'search') {
            dispatch(setSearchDialog(true))
            setinput('')
        } else if (e === 'messages') {
            navigate('/chat')
            localStorage.setItem('chatSection', true)
            setisChatSection(true)
        } else if (e === 'notifications') {
            navigate('/notifications')
        } else if (e === 'explore') {
            navigate('/explore')
        }

    }


    const handleImageUpload = async () => {
        const file = imgRef.current?.files[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            setpreview(URL.createObjectURL(file))
            const compressedImage = await imageCompression(file, options);

            // 🔥 Store in state
            setimage(compressedImage);
        } catch (error) {
            toast.error("Image compression failed");
        }
    };

    const handleCreatePost = async () => {
        if (!caption) return toast.error("Please add a caption");
        if (!image || !preview) return toast.error("Please upload an image");

        try {
            setloading(true);

            const formData = new FormData();
            formData.append('caption', caption);

            // 🧠 This MUST be compressed file
            formData.append('image', image);



            const res = await fetch("http://localhost:3000/post/create", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                setcreateDialog(false);
                dispatch(setposts([...posts, data.newPost]));
                dispatch(addPost(data.newPost._id));
                dispatch(addActiveProfilePosts(data.newPost));
                setcaption("");
                setpreview(null);
                setimage(null);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setloading(false);
        }
    };






    const searchQuerry = async () => {
        if (!input.trim()) return; // Prevent empty API calls

        try {
            const data = await apiClient(`/user/searchQuerry/${input}`);
            setquerryResults(data.users)
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearchPrimaryBtnClick = async (e, user) => {
        if (e.target.innerText === 'Add pal' || e.target.innerText === 'Cancel') {
            await addPal(user, dispatch)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await searchQuerry();
        };

        if (!input) {
            setquerryResults([])
        }

        fetchData(); // Call the async function

    }, [input]);

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault(); // Prevents default back behavior (only works for certain cases)

            if (isMd && createDialog) {
                setcreateDialog(false);
            } else if (isMd && searchDialog) {
                dispatch(setSearchDialog(false))
                setinput('')
            }

            history.pushState(null, "", window.location.href); // Re-add history entry
        };

        // Push a fake history state when the component mounts
        history.pushState(null, "", window.location.href);

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isMd, createDialog, setcreateDialog, searchDialog, setinput]);
    return (
        <div className={`${isChatSection ? 'w-[70px]' : 'w-[250px] max-[900px]:w-[70px]'} max-[768px]:fixed max-md:z-[9000] max-[768px]:bottom-0 max-[768px]:flex-row  flex flex-col px-3 py-4 border-r text-white jusce border-zinc-700 h-full max-[768px]:w-full max-[768px]:h-[65px] max-[768px]:justify-around max-[768px]:items-center max-md:bg-black max-md:bg-border-t max-md:bg-border-zinc-700 `}>
            <h2 className={`font-extralight text-3xl logoText my-5 mb-8 max-[900px]:text-center max-md:hidden ${(isChatSection || isSidebarLogo) && 'text-center'}`}>{isChatSection || isSidebarLogo ? 'A' : 'AntiSush'}</h2>
            {data.map((e, i) => {
                return e.text === 'notifications' ? <button onClick={() => handleMenuClick(e.text)} className={`flex max-md:hidden sm:cursor-pointer gap-2 my-2 font-medium items-center md:hover:bg-zinc-800 rounded-md px-3 py-3 `} key={i}>
                    <span className='text-sm relative' title={e.text}>{e.icon} {(toRead.length > 0 || user?.recieveRequests?.length) > 0 && <span className='bg-red-600 rounded-full top-[-2px] right-[-2px] h-[9px] w-[9px] absolute'></span>}</span>
                    {!isChatSection && <h3 className='capitalize max-[970px]:text-sm max-[900px]:hidden'>{e.text}</h3>}
                </button> : <button onClick={() => handleMenuClick(e.text)} className={`flex sm:cursor-pointer gap-2 my-2 font-medium items-center md:hover:bg-zinc-800 rounded-md px-3 py-3 ${e.text === 'search' && 'max-md:hidden'} ${e.text === 'home' ? 'max-md:order-[-5]' : e.text === 'explore' ? 'max-md:order-[-0]' : e.text === 'create' ? 'max-md:order-[-3]' : e.text === 'messages' ? 'max-md:order-[-5]' : 'max-md:order-6'}`} key={i}>
                    <span className='text-sm relative' title={e.text}>{e.icon} {(e.text === 'messages' && unreadChats.length > 0) && <span className='bg-red-600 hidden max-[900px]:flex  absolute rounded-full top-[-8px] right-[-8px] h-[20px] w-[20px] text-xs items-center justify-center '>{unreadChats.length}</span>}</span>
                    {!isChatSection && <h3 className='capitalize flex items-center gap-2 max-[970px]:text-sm max-[900px]:hidden'>{e.text} {(e.text === 'messages' && unreadChats.length > 0) && <span className='bg-red-600 rounded-t-full rounded-br-full h-[20px] w-[20px] text-xs flex items-center justify-center '>{unreadChats.length}</span>}</h3>}
                </button>
            })}
            <div className='mt-auto max-[768px]:m-0 max-md:p-3'>
                <Link to={`/profile/${user?.username}`} className={`flex sm:cursor-pointer items-center max-[900px]:justify-center hover:bg-zinc-800 rounded-md px-2 max-[768px]:p-0 max-[768px]:   py-3 gap-2 ${isChatSection && 'justify-center'}`}>
                    <img loading='lazy' src={user?.pfp ? user.pfp : userDefaultPfp} className='w-8 h-8 max-[970px]:h-6 max-[970px]:w-6 max-[900px]:h-7 max-[900px]:w-7 object-cover rounded-full ' alt="" />
                    {!isChatSection && <h3 className='max-[970px]:text-sm max-[900px]:hidden'>{user?.name}</h3>}
                </Link>
                <AlertDialog>
                    <AlertDialogTrigger className='w-full max-[768px]:hidden'><div className="flex sm:cursor-pointer w-full mt-2 items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                        <LogOut size={'26px'} className='max-[970px]:size-[18px] max-[900px]:size-[24px]' />
                        {!isChatSection && <h3 className='max-[970px]:text-sm max-[900px]:hidden'>Logout</h3>}
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
                    <DialogContent onInteractOutside={() => setcreateDialog(false)} className='w-[35rem] max-md:w-[20rem] max-[500px]:w-[19rem] max-[900px]:p-5 max-[900px]:w-[25rem] bg-zinc-300 rounded-lg outline-none border-none'>
                        <DialogTitle className='hidden'>title</DialogTitle>
                        <div className='text-neutral-900  text-center text-xl max-[900px]:text-lg font-semibold'>Create a Post</div>
                        <textarea value={caption} onChange={(e) => setcaption(e.target.value)} className='rounded-md max-h-20 outline-none text-black min-h-12 px-3 py-2 max-[900px]:text-sm' placeholder='Enter a caption...'></textarea>
                        <input onChange={handleImageUpload} ref={imgRef} type="file" className='hidden' />
                        {preview && <div className='w-full relative flex items-center justify-center'><img loading='lazy' src={preview} className='rounded-md max-h-[45vh] max-md:max-h-[30vh] md:w-full object-cover' /><X className='absolute top-0 p-0 right-0 sm:cursor-pointer text-red-500' onClick={() => setpreview(null)} /></div>}
                        <button onClick={() => imgRef.current.click()} className='bg-blue-600 shadow-lg max-[900px]:text-sm inline-block w-fit px-3 py-1 rounded-md text-white font-semibold hover:bg-blue-700 transition-all'>Upload an image</button>

                        <button
                            onClick={handleCreatePost}
                            type="submit"
                            className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 transition-colors text-white rounded-lg p-3 mt-6 font-medium hover:from-neutral-500 hover:to-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 max-[900px]:mt-2 max-[900px]:py-2 focus:ring-offset-purple-900"
                        >
                            {loading ? (<h2 className='flex w-full justify-center gap-1'><Loader2 className='animate-spin font-bold' /><span>Please wait...</span></h2>) : 'Post'}
                        </button>
                    </DialogContent>
                </Dialog>

                <Dialog open={searchDialog}>
                    <DialogContent className='h-[24rem] max-[500px]:rounded-md w-[35rem] max-md:w-[20rem] max-[500px]:w-[19rem] max-[900px]:p-2 max-[900px]:w-[25rem] p-2' onInteractOutside={() => {
                        dispatch(setSearchDialog(false))
                        setinput('')
                    }}>
                        <DialogTitle className='hidden'></DialogTitle>
                        <div className='h-full p-3 max-[500px]:p-1 w-full flex flex-col'>
                            <h2 className='text-center font-semibold mb-2 text-2xl max-[500px]:text-lg'>Search</h2>
                            <div className='w-full mb-2 max-[500px]:mb-1 relative'>
                                <input value={input} onChange={(e) => setinput(e.target.value)} type="text" className='w-full max-[500px]:text-xs max-[500px]:px-1 rounded-md px-3 py-1 border-none outline-none' placeholder='enter a username...' />
                                {input.trim() != '' && <X onClick={() => setinput('')} className='absolute max-[500px]:size-4 right-2 top-1/2 -translate-y-1/2 sm:cursor-pointer' />}
                            </div>
                            <hr />
                            <hr />
                            <div className='flex flex-col p-3 gap-3 overflow-y-auto h-[17rem]'>
                                {querryResults.length > 0 ? querryResults.map((querryUser) => <div className='w-full flex items-center gap-3'>
                                    <Link onClick={() => {
                                        dispatch(setSearchDialog(false))
                                        setinput('')
                                    }} to={`/profile/${querryUser.username}`} className='flex items-center gap-3'><img src={querryUser.pfp ? querryUser.pfp : userDefaultPfp} className='w-10 h-10 max-[500px]:h-7 max-[500px]:w-7 rounded-full object-cover' alt="" />
                                        <span className='max-[500px]:text-sm'>{querryUser.username}</span></Link>
                                    <button onClick={(e) => handleSearchPrimaryBtnClick(e, querryUser)} className='ml-auto py-[2px] px-4 bg-blue-500 rounded-md text-white max-[500px]:py-[1px] max-[500px]:px-2 max-[500px]:text-xs max-[500px]:font-light max-[500px]:rounded-sm w-24 sm:hover:bg-blue-700 transition-all '>{user?.pals.includes(querryUser._id) ? 'Pals' : user?.sentRequests?.some(e => e.user === querryUser._id) ? 'Cancel' : 'Add pal'}</button>
                                </div>) : <h2 className='text-center text-zinc-400 max-[500px]:text-xs'>No user</h2>
                                }
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* <NotificationDialog open={notificationDialog} setOpen={setnotificationDialog} /> */}

            </div>
        </div>
    )
}

export default Sidebar