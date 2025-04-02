import React, { useEffect, useRef, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Search, Settings, Edit2, } from 'lucide-react';
import ChatHeader from './chatBoxPartials.jsx/ChatHeader';
import ChatMessages from './chatBoxPartials.jsx/ChatMessages';
import MessageInput from './chatBoxPartials.jsx/MessageInput';
import DefaultChat from './chatBoxPartials.jsx/DefaultChat';
import { useDispatch, useSelector } from 'react-redux';
import { filterUnreadChats, setMessages, setSelectedUser } from '@/store/chatSlice';
import { Link, Outlet, useNavigate } from 'react-router-dom';
const ChatSection = () => {
    const [searchQuerry, setSearchQuery] = useState('')
    const [suggestedUsers, setsuggestedUsers] = useState([])
    const [lastMsgs, setlastMsgs] = useState([])
    const dispatch = useDispatch()
    const { selectedUser, onlineUsers, messages } = useSelector((state) => state.chat)
    const navigate = useNavigate()
    const { unreadChats } = useSelector(store => store.chat)

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
        setsuggestedUsers(prev => prev.filter(user => user.username.toLowerCase().includes(e.target.value.toLowerCase())))
    }
    async function fetchsuggestedUsers() {
        try {
            const data = await apiClient('/user/suggestedUser')
            setsuggestedUsers(data.suggestedUsers)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchLastMsg = async () => {
        try {
            if (suggestedUsers?.length > 0) {
                console.log("Sender IDs before API call:", suggestedUsers?.map(e => e._id));
                const res = await apiClient('/user/getLastMessages', "POST", { senderIds: suggestedUsers.map(e => e._id) });
                console.log(res)
                if (res.success) {
                    setlastMsgs(res.filteredMessages)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSetSelectedUser = async (user) => {
        try {
            dispatch(setSelectedUser(null))
            dispatch(setSelectedUser(user))
            dispatch(filterUnreadChats(user._id))
            const res = await apiClient(`/user/markMsgsAsRead/${user._id}`, "POST")
            console.log(res)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        searchQuerry === '' && fetchsuggestedUsers()
    }, [searchQuerry])

    useEffect(() => {
        // fetchsuggestedUsers()
        // fetchLastMsg()
        navigate('/chat')
        localStorage.setItem('chatSection', true)
        return () => {
            localStorage.setItem('chatSection', false)
            dispatch(setSelectedUser(null))
        }
    }, [])

    useEffect(() => {
        if (suggestedUsers?.length > 0) {
            fetchLastMsg()
        }
    }, [suggestedUsers]);
    return (
        <div className="flex h-screen w-full bg-zinc-900">
            {/* Left Sidebar */}
            <div className="w-[360px] text-white border-zinc-600 border-r">
                {/* Header */}
                <div className="p-4 border-zinc-600 border-b">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Messages</h1>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 relative">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            value={searchQuerry}
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search messages"
                            className="w-full pl-10 pr-4 py-2 bg-zinc-700 rounded-full focus:outline-none"
                        />
                    </div>
                </div>

                {/* Stories */}
                {/* <div className="p-4 border-zinc-600 border-b overflow-x-auto">
                    <div className="flex gap-4">
                        {messages.map((story) => (
                            <div key={story.id} className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full ring-2 ring-blue-500 p-1">
                                    <img
                                        src={story.avatar}
                                        alt={story.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <p className="text-xs text-center mt-1 truncate w-16">{story.name}</p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* user List */}
                <div className="overflow-y-auto">

                    {suggestedUsers.map((user) => {
                        const count = unreadChats.find(chat => chat.senderId === user._id)?.msgs;
                        const index = lastMsgs?.findIndex(e => e.senderId === user._id)

                        return <Link
                            to={`/chat/${user.username}`}
                            onClick={() => handleSetSelectedUser(user)}
                            key={user._id}
                            className={`flex border-b border-neutral-700 items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer ${user.username === selectedUser?.username && 'bg-zinc-800'}`}
                        >
                            <img
                                src={user.pfp}
                                alt={user.name}
                                className={`w-12 h-12 ${onlineUsers.includes(user._id) ? 'border-green-600' : 'border-red-600'} border-[3px] p-1 rounded-full object-cover`}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold">{user.username}</h3>
                                <p className="text-xs text-gray-500 truncate">{unreadChats?.some(e => e.senderId === user._id) ? <span className='font-semibold text-white'>{count} new {count > 1 ? 'messages' : 'message'}</span> : lastMsgs?.some(e => e.senderId === user._id) ? lastMsgs[index].msg : 'Tap to chat'}</p>
                            </div>
                            <span className="text-xs text-gray-400">10:29</span>
                        </Link>
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 text-white">
                {selectedUser ? (
                    <Outlet />
                ) : (
                    <DefaultChat />
                )}
            </div>
        </div>
    )
}

export default ChatSection