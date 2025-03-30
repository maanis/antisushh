import React, { useEffect, useRef, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Search, Settings, Edit2, } from 'lucide-react';
import ChatHeader from './chatBoxPartials.jsx/ChatHeader';
import ChatMessages from './chatBoxPartials.jsx/ChatMessages';
import MessageInput from './chatBoxPartials.jsx/MessageInput';
import DefaultChat from './chatBoxPartials.jsx/DefaultChat';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, setSelectedUser } from '@/store/chatSlice';
const ChatSection = () => {
    const [searchQuerry, setSearchQuery] = useState('')
    const [newMessage, setNewMessage] = useState('')
    const [suggestedUsers, setsuggestedUsers] = useState([])
    const inputRef = useRef(null)
    const dispatch = useDispatch()
    const { selectedUser, onlineUsers, messages } = useSelector((state) => state.chat)

    const chatHistory = [
        { id: 1, text: "Tumlog ka hain nhi", sender: "them", time: "10:30 AM" },
        { id: 2, text: "Isliye nhi bani", sender: "them", time: "10:31 AM" },
        { id: 3, text: "koi ni", sender: "user", time: "10:32 AM" },
        { id: 4, text: "Yes", sender: "them", time: "10:33 AM" },
        { id: 5, text: "Fairwell meh lemge", sender: "them", time: "10:34 AM" },
        { id: 6, text: "Lenge", sender: "user", time: "10:35 AM" },
        { id: 7, text: "ofc", sender: "user", time: "10:36 AM" },
        { id: 8, text: "Ya", sender: "them", time: "10:37 AM" },
        { id: 9, text: "Tu ananya ke sth nhi bnaya", sender: "them", time: "10:38 AM" },
        { id: 10, text: "soja ab", sender: "user", time: "10:39 AM" },
        { id: 11, text: "nahi toh bhoot aayega", sender: "user", time: "10:40 AM" },
        { id: 12, text: "soja ab", sender: "them", time: "10:41 AM" },
        { id: 13, text: "Bartan dhorai bro", sender: "them", time: "10:42 AM" },
    ];
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
    const handleSendMessage = (e) => { }

    const handleSetSelectedUser = async (user) => {
        dispatch(setSelectedUser(null))
        dispatch(setSelectedUser(user))
        try {
            const res = await apiClient(`/chat/getMessages/${user._id}`)
            console.log(res)
            if (res.success) {
                dispatch(setMessages(res.messages))
                setNewMessage('')
                inputRef.current.focus()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        searchQuerry === '' && fetchsuggestedUsers()
    }, [searchQuerry])

    useEffect(() => {
        localStorage.setItem('chatSection', true)
        return () => {
            dispatch(setSelectedUser(null))
            localStorage.setItem('chatSection', false)
        }
    }, [])
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
                    {suggestedUsers.map((user) => (
                        <div
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
                                <p className="text-xs text-gray-500 truncate">click to see messages</p>
                            </div>
                            <span className="text-xs text-gray-400">10:29</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 text-white">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <ChatHeader selectedUser={selectedUser} />

                        {/* Chat Messages */}
                        <ChatMessages chatHistory={chatHistory} />

                        {/* Message Input */}
                        <MessageInput inputRef={inputRef} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
                    </>
                ) : (
                    <DefaultChat />
                )}
            </div>
        </div>
    )
}

export default ChatSection