import React from 'react'
import Register from './components/Register'
import { Routes, Route } from 'react-router-dom'
import Feed from './components/Feed'
import ProtectedRoute from './utils/ProtectedRoute'

const App = () => {
  return (
    <div className='h-screen w-full'>

      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App