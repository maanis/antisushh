import React from 'react'
import Register from './components/Register'
import { Routes, Route, useLocation } from 'react-router-dom'
import Feed from './components/Feed'
import ProtectedRoute from './utils/ProtectedRoute'
import Sidebar from './components/Sidebar'

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";
  return (
    <>
      <div className='h-screen flex bg-zinc-950 w-full'>
        {showSidebar && <Sidebar />}
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App