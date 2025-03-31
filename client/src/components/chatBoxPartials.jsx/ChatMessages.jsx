import { Copy, EllipsisVertical, Forward, Smile, Undo } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '../ui/context-menu';

const ChatMessages = ({ messages, selectedUser, bottomRef }) => {
    const { user } = useSelector((state) => state.userInfo);

    const handleUnsend = (msg) => {
        console.log(msg)
    }

    return (
        <div
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A90E2 #000000' }}
            ref={bottomRef}
            className="flex-1 overflow-y-auto w-full p-4 bg-neutral-900"
        >
            <div className="w-full px-[24px] space-y-4">
                <div className="w-full text-white">
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
                                <Link
                                    to={`/profile/${selectedUser?.username}`}
                                    className="bg-zinc-800 text-white px-6 py-2 rounded-lg text-xs font-medium"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {messages ? (
                    messages.map((msg) => (
                        <>
                            <ContextMenu key={msg._id}>
                                <div
                                    className={`flex gap-3 relative items-center ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <ContextMenuTrigger
                                        className={`max-w-[70%] px-4 rounded-2xl ${msg.senderId === user._id
                                            ? 'bg-blue-500 text-white order-2 rounded-br-none'
                                            : 'bg-gray-200 text-gray-900 order-1 rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                        <p className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-blue-100' : 'text-gray-500'}`}>
                                            10:29
                                        </p>
                                    </ContextMenuTrigger>

                                    <div
                                        className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 ${msg.senderId === user._id ? 'order-1' : 'order-2'}`}
                                    >
                                        <div
                                            onClick={() => handleMenuClick(msg._id)}  // Handle the menu toggle per message
                                            className="p-1 relative bg-red-600 hover:bg-zinc-700 transition-all rounded-full"
                                        >
                                            <EllipsisVertical size={14} />
                                        </div>
                                        <div className="p-1 hover:bg-zinc-700 transition-all rounded-full">
                                            <Smile size={16} />
                                        </div>
                                    </div>
                                </div>

                                <ContextMenuContent className='p-0 border-none shadow-lg outline-none overflow-hidden'>
                                    <div className="py-1 bg-neutral-800">
                                        <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-200 hover:bg-gray-700">
                                            <Forward size={18} />
                                            <span>Forward</span>
                                        </button>

                                        <button className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-200 hover:bg-gray-700">
                                            <Copy size={18} />
                                            <span>Copy</span>
                                        </button>

                                        <button onClick={() => handleUnsend(msg._id)} className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-400 hover:bg-gray-700">
                                            <Undo size={18} />
                                            <span>Unsend</span>
                                        </button>
                                    </div>
                                </ContextMenuContent>
                            </ContextMenu>
                        </>
                    ))
                ) : (
                    'loading...'
                )}
            </div>
        </div>
    );
};

export default ChatMessages;
