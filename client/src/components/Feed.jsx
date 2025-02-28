import React from 'react'
import Sidebar from './Sidebar'
import { useSelector } from 'react-redux'

const Feed = () => {
    const { user } = useSelector(state => state.userInfo)
    console.log(user)
    return user != null ? (
        <div className='h-screen bg-zinc-950 text-zinc-200 w-full'>
            <Sidebar />
        </div>
    ) : <h2>Loading....</h2>
}

export default Feed