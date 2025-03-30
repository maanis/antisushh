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
import { useSelector } from 'react-redux'

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";
  const { user } = useSelector(store => store.userInfo)
  useEffect(() => {
    if (user) {
      const socket = new io('http://localhost:3000', {
        query: { userId: user._id },
        transports: ['websocket'],
      });
      console.log('connected to socket:', socket);

      socket.on('getOnlineUsers', (users) => {
        console.log('Online users:', users);
      })
      return () => {
        socket.disconnect();
        console.log('Socket disconnected on cleanup:', socket.id);
        socket.on('getOnlineUsers', (users) => {
          console.log('Online users:', users);
        })
      }
    }
  }, [])
  return (
    <>
      <div className='h-screen flex bg-zinc-950 w-full'>
        {location.pathname !== '/' && location.pathname !== '/update-profile' && <Sidebar />}
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path='/profile/:username' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><ChatSection /></ProtectedRoute>} />
          <Route element={<ProtectedUpdateProfile />}>
            <Route path='/update-profile' element={<UpdateProfile />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App