import { markNotificationsAsRead } from '@/store/notificationsSlice';
import apiClient from '@/utils/apiClient';
import { timeAgo } from '@/utils/constant';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Notifications() {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('alerts');
    const { notifications } = useSelector(store => store.notifications);
    const { user } = useSelector(store => store.userInfo);
    const [notificationsData, setNotificationsData] = useState([]);  // Start with empty array

    console.log(notificationsData);

    useEffect(() => {
        setNotificationsData(activeTab === 'alerts' ? notifications : user?.recieveRequests || []);
    }, [activeTab, notifications, user]);


    const markAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(e => !e.isRead).map(e => e._id);
            const res = await apiClient('/user/markNotificationsAsRead', "POST", { notificationIds: unreadNotifications })
            console.log(res)
            if (res.success) {
                dispatch(markNotificationsAsRead(unreadNotifications))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const toRead = notifications?.filter(e => !e.isRead)

    useEffect(() => {
        return () => {
            markAsRead()
        }
    }, [])


    return notificationsData ? (
        <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A90E2 #000000' }} className="min-h-screen w-full mx-auto overflow-hidden text-white">
            <div className="container max-w-4xl mx-auto px-4 h-full py-6">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800 pb-3 px-3 mb-6 gap-6">
                    {['alerts', 'requests'].map((e, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(e)}
                            className={`flex items-center py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === e
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="uppercase">{e}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className='h-full'>
                    <h2 className="text-lg font-semibold mb-4 px-3">Today</h2>

                    {notificationsData ? <div className='overflow-y-auto max-h-[75%]  w-full'>
                        {notificationsData.length > 0 ? notificationsData.map((e) => {
                            return activeTab === 'requests' ? (<div className="border-b border-zinc-800">
                                <div className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">raju_ansari0786</p>
                                            <p className="text-sm text-gray-500">requested to follow you <span className="text-gray-400">1h</span></p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                                            Confirm
                                        </button>
                                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>) : <div className={`border-b border-zinc-800 px-3 ${!e.isRead && 'bg-zinc-900'}`}>
                                <div className="flex items-center justify-between  py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex">
                                            <img
                                                src={e.sender?.pfp}
                                                alt="Profile 1"
                                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{e.sender?.username}</p>
                                            <p className="text-[16px]  text-gray-500">{e.type === 'like' ? 'liked your post' : 'commented on your post'} <span className="text-zinc-500 text-[12px] ml-1">{timeAgo(e.createdAt)}</span></p>
                                        </div>
                                    </div>
                                    <img
                                        src={e.post?.image}
                                        alt="Post thumbnail"
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                </div>
                            </div>
                        }) : 'No notifications'}
                    </div> : 'loading'}

                    {/* {activeTab === 'alerts' && (
                        <div className="border-b border-gray-100">
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex -space-x-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                                            alt="Profile 1"
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        />
                                        <img
                                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                                            alt="Profile 2"
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">anupamra1 and others</p>
                                        <p className="text-sm text-gray-500">liked your post <span className="text-gray-400">3h</span></p>
                                    </div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=100&h=100&fit=crop"
                                    alt="Post thumbnail"
                                    className="w-12 h-12 rounded object-cover"
                                />
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    ) : 'loading'
}

export default Notifications;