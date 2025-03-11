import React, { useEffect, useState } from 'react';
import { Mail, Pencil, Verified, Image, Edit2, ImageIcon, UserPlus, } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { userCoverPfp, userDefaultPfp } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';
import ProfileSkeleton from './ProfileSkeleton';
import { toast } from 'sonner';
import ProfilePost from './ProfilePost';
import { setActiveProfilePosts } from '@/store/postSlice';

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setuser] = useState(null)
    const navigate = useNavigate()
    const [showEditIcon, setshowEditIcon] = useState(false)

    const currentUser = useSelector(state => state.userInfo.user)

    const { username } = useParams()

    const fetchUserProfile = async () => {
        const data = await apiClient(`/user/userProfile/${username}`)
        if (!data.success) {
            toast.error(data.message)
            navigate('/feed')
            return
        }
        console.log(data.user)
        setuser(data.user)
    }

    const posts = activeTab === 'posts' ? user?.posts : user?.bookmarks
    useEffect(() => {
        fetchUserProfile()
        return () => {
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
                    {currentUser.username === username && <div className={`flex w-full justify-center transition-all  duration-300 items-center absolute h-10 ${showEditIcon ? 'bottom-0' : '-bottom-full'} bg-zinc-200/65 backdrop-blur-md overflow-hidden`}>
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
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            {currentUser.username === username ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {currentUser.username === username ? 'Edit Profile' : 'Add pal'}
                        </button>
                    </div>
                    {/* Stats Bar */}
                    <div className="flex gap-8 mb-4 py-2">
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{user?.posts.length}</span>
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
                            {posts.slice().reverse().map((post) => (
                                <>

                                    <ProfilePost posts={post} key={post._id} />
                                    {/* <img onClick={() => setopen(true)} src={post.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                    <CommentDialogBox post={post} open={open} setopen={setopen} /> */}
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    ) : <ProfileSkeleton />
}

export default ProfilePage;