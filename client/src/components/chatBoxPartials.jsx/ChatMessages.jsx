import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const ChatMessages = ({ messages, selectedUser, bottomRef }) => {
    const { user } = useSelector((state) => state.userInfo)
    return (
        <div style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A90E2 #000000' }} ref={bottomRef} className="flex-1 overflow-y-auto w-full p-4 bg-neutral-900">
            <div className="w-full px-[24px] space-y-4">
                <div className="w-full  text-white">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="flex flex-col items-center">
                            {/* Profile Image */}
                            <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
                                <img
                                    src={selectedUser?.pfp}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="text-center mb-7">
                                <h1 className="text-lg font-semibold">{selectedUser?.name}</h1>
                                <p className="text-gray-400 text-sm mb-3">{selectedUser?.username} · Instagram</p>
                                <Link to={`/profile/${selectedUser?.username}`} className="bg-zinc-800 text-white px-6 py-2 rounded-lg text-xs font-medium">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {messages ? messages?.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.senderId === user._id
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                        >
                            <p>{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-blue-100' : 'text-gray-500'}`}>
                                10:29
                            </p>
                        </div>
                    </div>
                )) : 'loading...'}
            </div>
        </div>
    )
}

export default ChatMessages