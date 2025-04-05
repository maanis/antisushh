import { markNotificationsAsRead } from '@/store/notificationsSlice';
import { addToPal, removeRecieveReq } from '@/store/userSlice';
import apiClient from '@/utils/apiClient';
import { timeAgo } from '@/utils/constant';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

function Notifications() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('alerts');
    const { notifications } = useSelector(store => store.notifications);
    const { user } = useSelector(store => store.userInfo);
    const [notificationsData, setNotificationsData] = useState([]);  // Start with empty array


    useEffect(() => {
        setNotificationsData(activeTab === 'alerts' ? notifications : user?.recieveRequests || []);
    }, [activeTab, notifications, user]);


    const markAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(e => !e.isRead).map(e => e._id);
            const res = await apiClient('/user/markNotificationsAsRead', "POST", { notificationIds: unreadNotifications })
            if (res.success) {
                dispatch(markNotificationsAsRead(unreadNotifications))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptRequest = async (id) => {
        try {
            const res = await apiClient(`/user/acceptRequest/${id}`, "POST")
            if (res.success) {
                dispatch(removeRecieveReq(res.data))
                dispatch(addToPal(res.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteRequest = async (id) => {
        try {
            const res = await apiClient(`/user/declineRequest/${id}`, "POST")
            if (res.success) {
                dispatch(removeRecieveReq(res.senderId))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            markAsRead()
        }
    }, [])


    return (
        <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A90E2 #000000' }} className="h-screen bg-zinc-950 md:h-screen w-full mx-auto overflow-hidden text-white">
            <div className="flex sm:gap-3 max-w-4xl mx-auto mb-4 items-center max-sm:border-b max-sm:border-zinc-700 sm:px-4 sm:pt-10 max-sm:py-3 max-sm:px-5">
                <ChevronLeft className='absolute' onClick={() => navigate(-1)} />
                <h1 className="text-2xl font-bold  max-sm:text-lg max-sm:text-center w-full">Notifications</h1>
            </div>
            <div className="max-w-4xl mx-auto px-4 h-[92%] pb-[75px]">
                {/* Tabs */}
                <div className="flex border-b border-zinc-800 pb-3 px-3 mb-6 gap-6">
                    {['alerts', 'requests'].map((e, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(e)}
                            className={`flex items-center py-2 border-b-2 relative font-medium text-sm transition-colors ${activeTab === e
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {e === 'requests' && user.recieveRequests.length > 0 && <span className='absolute top-[-2px] right-[-4px] h-2 w-2 bg-red-600 rounded-full'></span>}
                            <span className="uppercase">{e}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className='h-full'>
                    <h2 className="text-lg font-semibold mb-4 px-3">Today</h2>

                    {notificationsData ? <div className='overflow-y-auto h-[80%]  w-full'>
                        {notificationsData.length > 0 ? notificationsData.map((e) => {
                            return activeTab === 'requests' ? (<div className="border-b border-zinc-800">
                                <div className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link to={`/profile/${e.user?.username}`}><img
                                            src={e.user?.pfp}
                                            alt="Profile"
                                            className="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-full object-cover"
                                        /></Link>
                                        <div>
                                            <p className="font-medium">{e.user?.username}</p>
                                            <p className="text-[16px] text-gray-500">requested you to become their pal <span className=" text-zinc-500 text-[12px] ml-1">{timeAgo(e.timestamp)}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleAcceptRequest(e.user?._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                                            Confirm
                                        </button>
                                        <button onClick={() => handleDeleteRequest(e.user?._id)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>) : <div className={`border-b border-zinc-800 px-3 ${!e.isRead && 'bg-zinc-900'}`}>
                                <div className="flex items-center justify-between  py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex">

                                            <Link to={`/profile/${e.sender?.username}`}><img
                                                loading='lazy'
                                                src={e.sender?.pfp}
                                                alt="Profile 1"
                                                className="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-full border-2 border-white object-cover"
                                            /></Link>
                                        </div>
                                        <div>
                                            <p className="font-medium max-sm:text-sm">{e.sender?.username}</p>
                                            <p className="text-[16px] max-md:text-[14px] max-sm:text-[12px] text-gray-500">{e.type === 'like' ? 'liked your post' : 'commented on your post'} <span className="text-zinc-500 text-[12px] max-md:text-[10px] max-sm:text-[8px] ml-1">{timeAgo(e.createdAt)}</span></p>
                                        </div>
                                    </div>
                                    <img
                                        src={e.post?.image}
                                        alt="Post thumbnail"
                                        className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded object-cover"
                                    />
                                </div>
                            </div>
                        }) : 'No notifications'}
                    </div> : <div className="space-y-4 p-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* Profile Picture */}
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="space-y-2">
                                        {/* Name and Action */}
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                                {/* Time & Post Thumbnail */}
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="w-12 h-12 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Notifications;