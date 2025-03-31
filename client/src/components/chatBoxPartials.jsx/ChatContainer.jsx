import React, { use, useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, setSelectedUser } from '@/store/chatSlice';
import { useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';

const ChatContainer = () => {

    const { messages } = useSelector((state) => state.chat)
    const inputRef = useRef(null)

    const dispatch = useDispatch()
    const [newMessage, setNewMessage] = useState('')
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (newMessage.trim() === '') return
        try {
            const res = await apiClient(`/chat/sendMessage/${selectedUser._id}`, "POST", { message: newMessage })
            if (res.success) {
                dispatch(setMessages([...messages, res.msg]))
                setNewMessage('')
                // console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
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

    const fetchMessages = async () => {
        const res = await apiClient(`/chat/getMessages/${selectedUser?._id}`)
        console.log(res)
        if (res.success) {
            dispatch(setMessages(res.messages))
        }
    }

    useEffect(() => {
        fetchUser()
        if (selectedUser) {
            fetchMessages()
        }
        inputRef.current.focus()
    }, [username])
    return (
        <>
            {/* Chat Header */}
            <ChatHeader selectedUser={selectedUser} />

            {/* Chat Messages */}
            <ChatMessages messages={messages} selectedUser={selectedUser} />

            {/* Message Input */}
            <MessageInput inputRef={inputRef} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </>
    )
}

export default ChatContainer