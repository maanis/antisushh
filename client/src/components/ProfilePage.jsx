import React, { useEffect, useRef, useState } from 'react';
import { Mail, Pencil, Verified, Image, Edit2, ImageIcon, UserPlus, Save, } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fileToUrl, userCoverPfp, userDefaultPfp } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';
import ProfileSkeleton from './ProfileSkeleton';
import { toast } from 'sonner';
import ProfilePost from './ProfilePost';
import { setActiveBookmarkPosts, setActiveProfilePosts } from '@/store/postSlice';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { addOrRemoveSentReq, addToPal, removeRecieveReq, setUser } from '@/store/userSlice';
import { Button } from './ui/button';

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');
    const [updatedData, setUpdatedData] = useState({
        name: '',
        username: '',
        email: '',
        bio: ''
    })
    const countPosts = useSelector(state => state.posts.activeProfilePosts)
    const [profilePic, setprofilePic] = useState("")
    const [preview, setpreview] = useState(null)
    const fileInputRef = useRef(null)
    const [user, setuser] = useState(null)
    const [editDialog, seteditDialog] = useState(false)
    const [pfpDialog, setpfpDialog] = useState(false)
    const navigate = useNavigate()
    const [showEditIcon, setshowEditIcon] = useState(false)
    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.userInfo.user)

    const posts = activeTab === 'posts' ? useSelector(state => state.posts.activeProfilePosts) : useSelector(state => state.posts.activeBookmarkPosts)
    console.log(user)
    const { username } = useParams()

    const fetchUserProfile = async () => {
        const data = await apiClient(`/user/userProfile/${username}`)
        if (!data.success) {
            toast.error(data.message)
            navigate('/feed')
            return
        }
        setuser(data.user)
        setUpdatedData({
            name: data.user.name || '',
            username: data.user.username || '',
            profileTitle: data.user.profileTitle || '',
            email: data.user.email || '',
            bio: data.user.bio || ''
        });
        dispatch(setActiveProfilePosts(data.user.posts))
        if (currentUser.username === username) {
            dispatch(setActiveBookmarkPosts(data.user.bookmarks))
        }
    }

    const handlePrimaryButton = async (e) => {
        console.log(e.currentTarget.innerText)
        if (username === currentUser?.username) {
            seteditDialog(true)
        } else if (e.currentTarget.innerText === 'Pals') {
            console.log('what')
        }
        else if (e.currentTarget.innerText === 'Accept') {
            try {
                const res = await apiClient(`/user/acceptRequest/${user._id}`, "POST")
                console.log(res)
                if (res.success) {
                    dispatch(removeRecieveReq(res.data))
                    dispatch(addToPal(res.data))
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            const data = await apiClient(`/user/sendOrRemoveRequest`, "POST", { recieverId: user._id })
            console.log(data)
            if (data.success) {
                dispatch(addOrRemoveSentReq({ data: data.data, type: data.message }))
                toast.success(data.message)
            }
        }
    }



    const handleEditIntereactionOutside = () => {
        seteditDialog(false)
        setUpdatedData({
            name: currentUser.name || '',
            username: currentUser.username || '',
            profileTitle: currentUser.profileTitle || '',
            email: currentUser.email || '',
            bio: currentUser.bio || ''
        });
    }

    const handleChange = (e) => {
        setUpdatedData({ ...updatedData, [e.target.name]: e.target.value })
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = await apiClient('/user/editProfile', 'POST', updatedData)
            if (data.success) {
                toast.success(data.message)
                dispatch(setUser(data.user))
                setuser({ ...user, name: data.user.name, email: data.user.email, username: data.user.username, bio: data.user.bio, profileTitle: data.user.profileTitle })
                seteditDialog(false)
                navigate(`/profile/${data.user.username}`)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handlePfpinteractionOutside = () => {
        setpfpDialog(false)
        setpreview(null)
    }

    const handleFileChange = (e) => {
        const file = fileInputRef.current.files[0]
        if (file) {
            setprofilePic(file)
            const url = fileToUrl(file);
            setpreview(url);
            console.log(preview)
            console.log(profilePic)
        }
    }

    const handlePfpUpdate = async (e) => {
        e.preventDefault()
        // if (!preview) return toast.error('Please upload an image')
        try {
            const formData = new FormData();
            console.log(profilePic)
            formData.append("profilePic", profilePic);

            const data = await fetch('http://localhost:3000/user/updatePfp', {
                credentials: 'include',
                method: 'POST',
                body: formData,
            })
            const res = await data.json()
            console.log(res)
            if (res.success) {
                toast.success(res.message)
                dispatch(setUser(res.user))
                setuser({ ...user, pfp: res.user.pfp })
                setpfpDialog(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const posts = activeTab === 'posts' ? user?.posts : user?.bookmarks
    useEffect(() => {
        fetchUserProfile()
        return () => {
            setActiveTab('posts')
            setuser(null)
        }
    }, [username])

    return user ? (
        <div style={{ scrollbarWidth: 'none' }} className="min-h-screen w-[55%] overflow-y-auto  mx-auto text-white">
            {/* Header/Banner */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <img src={user?.coverPhoto ? user.coverPhoto : userCoverPfp} className='h-full w-full object-cover' alt="" />
                {currentUser.username === username && <Edit2 className='absolute right-4 bottom-4 cursor-pointer' />}
                <div onMouseEnter={currentUser.username === username ? () => setshowEditIcon(true) : undefined}
                    onMouseLeave={currentUser.username === username ? () => setshowEditIcon(false) : undefined} className="absolute -bottom-16 left-10 overflow-hidden rounded-full">
                    {currentUser.username === username && <div onClick={() => setpfpDialog(true)} className={`flex w-full justify-center transition-all  duration-300 items-center absolute h-10 ${showEditIcon ? 'bottom-0' : '-bottom-full'} bg-zinc-200/65 backdrop-blur-md overflow-hidden`}>
                        <ImageIcon className='cursor-pointer text-black' />
                    </div>}

                    <img
                        src={user.pfp ? user.pfp : userDefaultPfp}
                        alt="Profile"
                        className="w-40 select-none h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                <div className=" rounded-xl shadow-sm p-6 mb-8">
                    {/* Profile Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <Verified className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-gray-600 mt-1">{user.profileTitle}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => handlePrimaryButton(e)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            {currentUser.username === username ? <Pencil className="w-4 h-4 pointer-events-none" /> : <UserPlus className="w-4 h-4 pointer-events-none" />}
                            {currentUser.username === username ? 'Edit Profile' : currentUser.pals.some(e => e === user._id) ? 'Pals' : currentUser.recieveRequests.some(e => e.user?._id === user._id) ? 'Accept' : (currentUser.sentRequests.some(e => e.user === user._id) ? 'cancel' : 'Add pal')}
                        </button>
                    </div>
                    {/* Stats Bar */}
                    <div className="flex gap-8 mb-4 py-2">
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{countPosts?.length}</span>
                            <span className="text-sm text-gray-500">Posts</span>
                        </div>
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{user?.pals?.length}</span>
                            <span className="text-sm text-gray-500">Pals</span>
                        </div>
                    </div>



                    {/* Social Links */}
                    {/* <div>
                        <h2 className="text-xl font-semibold mb-4">Connect</h2>
                        <div className="flex gap-4">
                            {['github', 'twitter', 'website'].map((e, i) => {
                                return <a
                                    href="#"
                                    key={i}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                    <span className='capitalize'>{e}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            })}
                        </div>
                    </div> */}
                </div>

                {/* Posts Section */}
                <div className="text-black rounded-xl shadow-sm">
                    {/* Tabs */}
                    <div className="border-b border-zinc-700">
                        <div className="flex gap-8">
                            {['posts', 'saved'].map((e, i) => (
                                (e === 'saved' && username === currentUser.username) || e === 'posts' ? (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(e)}
                                        className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === e
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Image src="/icon.png" alt={`${e} icon`} width={20} height={20} className="w-5 h-5" />
                                        <span className="uppercase">{e}</span>
                                    </button>
                                ) : null
                            ))}


                        </div>
                    </div>

                    {/* Grid of Posts */}
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                            {posts?.slice().reverse().map((post) => (
                                <>

                                    <ProfilePost posts={post} key={post._id} />
                                    {/* <img onClick={() => setopen(true)} src={post.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                    <CommentDialogBox post={post} open={open} setopen={setopen} /> */}
                                </>
                            ))}
                        </div>
                    </div>



                    <Dialog open={editDialog}>
                        <DialogContent className='max-w-md p-5 ' onInteractOutside={handleEditIntereactionOutside}>
                            <DialogTitle className='hidden'></DialogTitle>
                            <div className='h-full'>
                                <h2 className='text-center'>Edit profile</h2>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={updatedData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 select-none border border-gray-300 rounded-md"
                                            placeholder="Enter your name"
                                            autoFocus={false}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={updatedData.username}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Choose a username"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="profileTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                            Profile Title
                                        </label>
                                        <input
                                            type="text"
                                            id="profileTitle"
                                            name="profileTitle"
                                            value={updatedData.profileTitle}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Choose a profileTitle"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={updatedData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={updatedData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                                            placeholder="Tell us about yourself"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        // disabled={isSaving}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        save changes
                                    </button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={pfpDialog}>
                        <DialogContent className='max-w-md' onInteractOutside={handlePfpinteractionOutside}>
                            <DialogTitle className='hidden'></DialogTitle>
                            <form onSubmit={(e) => e.preventDefault()} className=' flex flex-col items-center gap-4'>
                                <img src={preview ? preview : user.pfp ? user.pfp : userDefaultPfp} className='w-36 h-36 object-cover rounded-full' alt="" />
                                <input type="file" onChange={handleFileChange} ref={fileInputRef} className='hidden' />
                                <div className="flex border-b pb-3 border-zinc-600 gap-4">
                                    <Button onClick={() => fileInputRef.current.click()}>Upload Image</Button>
                                    <Button onClick={() => {
                                        setprofilePic("remove")
                                        setpreview(userDefaultPfp)
                                    }} className='bg-red-600 hover:bg-red-800'>Remove</Button>
                                </div>

                                <Button onClick={handlePfpUpdate} className='bg-blue-500 hover:bg-blue-700'>Save Changes</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div >
    ) : <ProfileSkeleton />
}

export default ProfilePage;