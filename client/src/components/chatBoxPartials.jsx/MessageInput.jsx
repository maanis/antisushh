import { Paperclip, Send, Smile } from 'lucide-react'
import React from 'react'

const MessageInput = ({ newMessage, inputRef, setNewMessage, handleSendMessage }) => {
    return (
        <div className="p-4 border-t border-zinc-600 w-full bg-zinc-950">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Smile className="w-6 h-6 text-gray-500" />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 px-4 py-2 bg-zinc-800 rounded-full focus:outline-none"
                />
                <button
                    type="submit"
                    className={`p-2 rounded-full ${newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-100'
                        }`}
                >
                    <Send className={`w-6 h-6 ${newMessage.trim() ? 'text-white' : 'text-gray-500'}`} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput