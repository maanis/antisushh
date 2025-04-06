import { Paperclip, Send, Smile } from 'lucide-react'
import React from 'react'

const MessageInput = ({ newMessage, inputRef, setNewMessage, handleSendMessage }) => {
    return (
        <div className="p-4 border-t max-[500px]:px-4 max-[330px]:px-2 max-[500px]:p-0 max-[500px]:h-[58px] flex items-center justify-between border-zinc-600 w-full bg-zinc-950">
            <form onSubmit={handleSendMessage} className="flex items-center max-[500px]:justify-between  max-[330px]:justify-around w-full gap-4 max-[500px]:gap-2">
                <button type="button" className="p-2 max-[330px]:hidden hover:bg-gray-100 rounded-full">
                    <Smile className="w-6 h-6 text-gray-500" />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className=" flex-1 max-[330px]:py-[6px] px-4 py-2 max-[500px]:py-2 max-[500px]:text-sm bg-zinc-800 rounded-full  focus:outline-none"
                />
                <button
                    type="submit"
                    className={`p-2  max-[500px]:p-1 flex justify-center items-center rounded-full ${newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-100'
                        }`}
                >
                    <Send className={`w-6 h-6 max-[500px]:size-5 max-[330px]:size-[18px] max-[500px]:p-[2px] ${newMessage.trim() ? 'text-white' : 'text-gray-500'}`} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput