import React, { use, useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/store/chatSlice';
import { useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';

const ChatContainer = () => {
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
    const inputRef = useRef(null)

    const dispatch = useDispatch()
    const [newMessage, setNewMessage] = useState('')
    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim() === '') return
        console.log(newMessage)
    }
    const { selectedUser } = useSelector((state) => state.chat)
    const { socketIo } = useSelector((state) => state.socket)
    const { username } = useParams()
    console.log(username)
    const fetchUser = async () => {
        const res = await apiClient(`/user/getUser/${username}`)
        console.log(res.user)
        dispatch(setSelectedUser(res.user))
    }
    useEffect(() => {
        fetchUser()
        inputRef.current.focus()
    }, [username])
    return (
        <>
            {/* Chat Header */}
            <ChatHeader selectedUser={selectedUser} />

            {/* Chat Messages */}
            <ChatMessages chatHistory={chatHistory} selectedUser={selectedUser} />

            {/* Message Input */}
            <MessageInput inputRef={inputRef} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </>
    )
}

export default ChatContainer