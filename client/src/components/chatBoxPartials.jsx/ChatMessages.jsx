import React from 'react'

const ChatMessages = ({ chatHistory }) => {
    return (
        <div className="flex-1 overflow-y-auto w-full p-4 bg-neutral-900">
            <div className="w-full px-[24px] space-y-4">
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