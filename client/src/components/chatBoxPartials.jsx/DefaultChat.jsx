import { MessageSquare } from 'lucide-react'
import React from 'react'

const DefaultChat = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 max-[900px]:mb-1 max-[900px]:text-sm">Your Messages</h2>
                <p className="text-gray-500 mb-4 max-[900px]:text-xs">
                    Send a message to start a chat.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg max-[900px]:text-xs max-[900px]:rounded-sm max-[900px]:px-2 max-[900px]:py-1 hover:bg-blue-600">
                    Send message
                </button>
            </div>
        </div>
    )
}

export default DefaultChat