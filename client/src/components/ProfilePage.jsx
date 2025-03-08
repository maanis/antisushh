import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Pencil, Link as LinkIcon, Github, Twitter, Verified, ExternalLink, Bookmark, Image, Edit, Edit2, Edit3, Edit3Icon, FileEdit, ImageIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { userCoverPfp, userDefaultPfp } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';
import ProfileSkeleton from './ProfileSkeleton';

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setuser] = useState(null)

    const [showEditIcon, setshowEditIcon] = useState(false)

    const posts = [];

    // const { user } = useSelector(state => state.userInfo)
    const { username } = useParams()
    console.log(username)

    const fetchUserProfile = async () => {
        const data = await apiClient(`/user/userProfile/${username}`)
        console.log(data)
        setuser(data.user)
    }

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
                <Edit2 className='absolute right-4 bottom-4 cursor-pointer' />
                <div onMouseEnter={() => setshowEditIcon(true)} onMouseLeave={() => setshowEditIcon(false)} className="absolute -bottom-16 left-10 overflow-hidden rounded-full">
                    <div className={`flex w-full justify-center transition-all  duration-300 items-center absolute h-10 ${showEditIcon ? 'bottom-0' : '-bottom-full'} bg-zinc-200/65 backdrop-blur-md overflow-hidden`}>
                        <ImageIcon className='cursor-pointer text-black' />
                    </div>

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
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                    {/* Stats Bar */}
                    <div className="flex gap-8 mb-4 py-2">
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{user.posts.length}</span>
                            <span className="text-sm text-gray-500">posts</span>
                        </div>
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{user.followers.length}</span>
                            <span className="text-sm text-gray-500">followers</span>
                        </div>
                        <div className="text-center flex items-center gap-2">
                            <span className="block font-bold text-xl text-white">{user.following.length}</span>
                            <span className="text-sm text-gray-500">following</span>
                        </div>
                    </div>



                    {/* Social Links */}
                    <div>
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
                    </div>
                </div>

                {/* Posts Section */}
                <div className="text-black rounded-xl shadow-sm">
                    {/* Tabs */}
                    <div className="border-b border-zinc-700">
                        <div className="flex gap-8">
                            {['posts', 'saved'].map((e, i) => {
                                return <button key={i}
                                    onClick={() => setActiveTab(e)}
                                    className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === e
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Image className="w-5 h-5" />
                                    <span className='uppercase'>{e}</span>
                                </button>
                            })}

                        </div>
                    </div>

                    {/* Grid of Posts */}
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <div key={post.id} className="aspect-square relative group">
                                    <img
                                        src={post.image}
                                        alt={`Post ${post.id}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    ) : <ProfileSkeleton />
}

export default ProfilePage;