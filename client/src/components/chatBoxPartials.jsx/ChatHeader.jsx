import { ChevronLeft, Info, Phone, Video } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const ChatHeader = ({ selectedUser }) => {
    const navigate = useNavigate()
    const { onlineUsers } = useSelector((state) => state.chat)
    return (
        <div className="p-4 max-[500px]:px-4 max-[500px]:p-0 max-[500px]:h-[58px] border-b border-zinc-600 w-full flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-3">
                <ChevronLeft className='max-[900px]:block hidden' onClick={() => navigate(-1)} />
                <Link to={`/profile/${selectedUser?.username}`} className="flex items-center gap-3">
                    <img
                        src={selectedUser?.pfp}
                        alt={selectedUser?.name}
                        className="w-10 h-10 max-[600px]:h-8 max-[600px]:w-8 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="font-semibold max-[600px]:text-sm max-[500px]:text-[12px]">{selectedUser?.name}</h2>
                        <p className={`text-sm max-[600px]:text-xs max-[500px]:text-[10px] ${onlineUsers.includes(selectedUser._id) ? 'text-green-600' : 'text-red-600'}`}>{onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Inactive'}</p>
                    </div>
                </Link>
            </div>
            <div className="flex gap-4 max-[600px]:gap-0">
                <button className="p-2 hover:bg-gray-100 rounded-full  ">
                    <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full ">
                    <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full ">
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader