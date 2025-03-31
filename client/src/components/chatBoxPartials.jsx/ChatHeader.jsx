import { Info, Phone, Video } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const ChatHeader = ({ selectedUser }) => {
    const { onlineUsers } = useSelector((state) => state.chat)
    return (
        <div className="p-4 border-b border-zinc-600 w-full flex items-center justify-between bg-zinc-950">
            <Link to={`/profile/${selectedUser?.username}`} className="flex items-center gap-3">
                <img
                    src={selectedUser?.pfp}
                    alt={selectedUser?.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h2 className="font-semibold">{selectedUser?.name}</h2>
                    <p className={`text-sm ${onlineUsers.includes(selectedUser._id) ? 'text-green-600' : 'text-red-600'}`}>{onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Inactive'}</p>
                </div>
            </Link>
            <div className="flex gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader