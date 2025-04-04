import React, { useEffect, useState } from 'react'
import Register from './components/Register'
import { Routes, Route, useLocation } from 'react-router-dom'
import Feed from './components/Feed'
import ProtectedRoute from './utils/ProtectedRoute'
import Sidebar from './components/Sidebar'
import ProfilePage from './components/ProfilePage'
import UpdateProfile from './components/UpdateProfile'
import ProtectedUpdateProfile from './utils/ProtectedUpdateProfile'
import ChatSection from './components/ChatSection'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers, setUnreadChats } from './store/chatSlice'
import { setSocket } from './store/socketSlice'
import ChatContainer from './components/chatBoxPartials.jsx/ChatContainer'
import apiClient from './utils/apiClient'
import { removeNotification, setNotifications } from './store/notificationsSlice'
import Notifications from './components/Notifications'
import { acceptReq, addRecieveReq, removeRecieveReq, removeSentReq } from './store/userSlice'
import { useMediaQuery } from 'react-responsive'
import Explore from './components/Explore'

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";
  const { user } = useSelector(store => store.userInfo)
  const { socketIo } = useSelector(store => store.socket)
  const dispatch = useDispatch()
  const { notifications } = useSelector(store => store.notifications)

  const fetchNotifications = async () => {
    try {
      const res = await apiClient('/user/getNotifications')
      if (res.success) {
        dispatch(setNotifications(res.notifications))
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    let socket = null;
    if (user) {
      fetchNotifications()
      socket = io('http://localhost:3000', {
        query: { userId: user._id },
        transports: ['websocket'],
      });
      dispatch(setSocket(socket));

      socket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection failed:', err);
      });

      return () => {
        socket.close();
        dispatch(setOnlineUsers(null));
      };
    } else {
      socket?.close()
      dispatch(setOnlineUsers(null));
    }
  }, [user]);

  const fetchUnreadMsgs = async () => {
    try {
      const res = await apiClient('/chat/msgsToRead')
      if (res.success) {
        console.log(res.unreadMsgs)
        res.unreadMsgs.length > 0 && res.unreadMsgs?.map(e => dispatch(setUnreadChats(e.senderId)))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    localStorage.setItem('chatSection', false)
    fetchUnreadMsgs()
  }, [])

  const { showChatPage } = useSelector(e => e.chat)
  console.log(showChatPage)
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect screen width



  useEffect(() => {
    if (socketIo) {
      socketIo.on('newNotification', (notification) => {
        dispatch(setNotifications([notification, ...notifications]))
      })
      socketIo.on('deleteNotifications', (id) => {
        dispatch(removeNotification(id))
      })
      socketIo.on('sendReq', (data) => {
        dispatch(addRecieveReq(data))
      })
      socketIo.on('removeReq', (data) => {
        dispatch(removeRecieveReq(data))
      })
      socketIo.on('acceptReq', (data) => {
        dispatch(acceptReq(data))
      })
      socketIo.on('declineReq', (data) => {
        dispatch(removeSentReq(data))
      })
      socketIo.on('newMsg', (data) => {
        dispatch(setUnreadChats(data.senderId))
      })
    }
    return () => {
      socketIo?.off('newNotification')
      socketIo?.off('deleteNotifications')
      socketIo?.off('sendReq')
      socketIo?.off('removeReq')
      socketIo?.off('acceptReq')
      socketIo?.off('declineReq')
      socketIo?.off('newMsg')
    }
  }, [dispatch, notifications, setNotifications, removeNotification, addRecieveReq, removeRecieveReq, acceptReq, removeSentReq])

  return (
    <>
      <div className='h-full md:h-screen flex overflow-hidden bg-zinc-950 w-full'>
        {(location.pathname !== '/' &&
          location.pathname !== '/update-profile' &&
          (!isMobile || (location.pathname !== '/chat' && showChatPage === false)) &&
          !(isMobile && location.pathname === '/explore') // Hide sidebar on explore in mobile
        ) && <Sidebar />}



        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path='/profile/:username' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/explore' element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><ChatSection /></ProtectedRoute>} >

            <Route path='/chat/:username' element={<ProtectedRoute><ChatContainer /></ProtectedRoute>} />
          </Route>
          <Route element={<ProtectedUpdateProfile />}>
            <Route path='/update-profile' element={<UpdateProfile />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App