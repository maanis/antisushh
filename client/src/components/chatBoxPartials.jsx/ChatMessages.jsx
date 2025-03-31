import React from 'react'
import { Link } from 'react-router-dom'

const ChatMessages = ({ chatHistory, selectedUser }) => {
    return (
        <div className="flex-1 overflow-y-auto w-full p-4 bg-neutral-900">
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
                {chatHistory.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender === 'user'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                        >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatMessages