import React, { use, useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { useDispatch, useSelector } from 'react-redux';
import { handleUnsendMsg, setMessages, setSelectedUser } from '@/store/chatSlice';
import { useParams } from 'react-router-dom';
import apiClient from '@/utils/apiClient';

const ChatContainer = () => {
    const bottomRef = useRef(null);
    const { messages } = useSelector((state) => state.chat)
    const { socketIo } = useSelector((state) => state.socket)
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
            }
        } catch (error) {
            console.log(error)
        }
    }
    const { selectedUser } = useSelector((state) => state.chat)
    const { username } = useParams()
    const fetchUser = async () => {
        const res = await apiClient(`/user/getUser/${username}`)
        dispatch(setSelectedUser(res.user))
    }

    const fetchMessages = async () => {
        const res = await apiClient(`/chat/getMessages/${selectedUser?._id}`)
        if (res.success) {
            dispatch(setMessages(res.messages))
        }
    }

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
        fetchUser()
        if (selectedUser) {
            fetchMessages()
        }
        inputRef.current.focus()

    }, [username])

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
        if (socketIo) {
            socketIo.on('newMsg', (msg) => {
                dispatch(setMessages([...messages, msg]))
            })
            socketIo.on('unsendMsg', (id) => {
                dispatch(handleUnsendMsg(id))
            })
            return () => {
                socketIo.off('newMsg')
            }
        }
    }, [messages, setMessages, socketIo, handleUnsendMsg])
    return (
        <>
            {/* Chat Header */}
            <ChatHeader selectedUser={selectedUser} />

            {/* Chat Messages */}
            <ChatMessages bottomRef={bottomRef} messages={messages} selectedUser={selectedUser} />

            {/* Message Input */}
            <MessageInput inputRef={inputRef} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
        </>
    )
}

export default ChatContainer