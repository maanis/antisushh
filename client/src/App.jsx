import React, { useEffect } from 'react'
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
import { setOnlineUsers } from './store/chatSlice'
import { setSocket } from './store/socketSlice'
import ChatContainer from './components/chatBoxPartials.jsx/ChatContainer'
import apiClient from './utils/apiClient'
import { removeNotification, setNotifications } from './store/notificationsSlice'
import Notifications from './components/Notifications'
import { acceptReq, addRecieveReq, removeRecieveReq, removeSentReq } from './store/userSlice'

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
      console.log('connected to socket:', socket);

      socket.on('getOnlineUsers', (users) => {
        console.log('Online users:', users);
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

  useEffect(() => {
    localStorage.setItem('chatSection', false)

  }, [])

  useEffect(() => {
    if (socketIo) {
      socketIo.on('newNotification', (notification) => {
        console.log(notification)
        dispatch(setNotifications([notification, ...notifications]))
      })
      socketIo.on('deleteNotifications', (id) => {
        dispatch(removeNotification(id))
      })
      socketIo.on('sendReq', (data) => {
        console.log(data)
        dispatch(addRecieveReq(data))
      })
      socketIo.on('removeReq', (data) => {
        dispatch(removeRecieveReq(data))
      })
      socketIo.on('acceptReq', (data) => {
        dispatch(acceptReq(data))
      })
      socketIo.on('declineReq', (data) => {
        console.log(data)
        dispatch(removeSentReq(data))
      })
    }
    return () => {
      socketIo?.off('newNotification')
      socketIo?.off('deleteNotifications')
    }
  }, [dispatch, notifications, setNotifications])

  return (
    <>
      <div className='h-screen flex bg-zinc-950 w-full'>
        {location.pathname !== '/' && location.pathname !== '/update-profile' && <Sidebar />}
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path='/profile/:username' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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