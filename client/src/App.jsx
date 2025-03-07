import React from 'react'
import Register from './components/Register'
import { Routes, Route, useLocation } from 'react-router-dom'
import Feed from './components/Feed'
import ProtectedRoute from './utils/ProtectedRoute'
import Sidebar from './components/Sidebar'
import ProfilePage from './components/ProfilePage'
import UpdateProfile from './components/UpdateProfile'
import ProtectedUpdateProfile from './utils/ProtectedUpdateProfile'

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";
  return (
    <>
      <div className='h-screen flex bg-zinc-950 w-full'>
        {location.pathname !== '/' && location.pathname !== '/update-profile' && <Sidebar />}
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route element={<ProtectedUpdateProfile />}>
            <Route path='/update-profile' element={<UpdateProfile />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App