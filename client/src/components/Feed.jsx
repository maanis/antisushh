import React from 'react'
import Sidebar from './Sidebar'
import Main from './Main'
import { useSelector } from 'react-redux'

const Feed = () => {
    const { user } = useSelector(state => state.userInfo)
    return user ? (
        <div className='h-full flex bg-zinc-950 text-zinc-200 w-full'>
            <Sidebar />
            <Main />
        </div>
    ) : <h2 className='text-black'>Loading...</h2>
}

export default Feed