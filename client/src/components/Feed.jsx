import React from 'react'
import Sidebar from './Sidebar'
import Main from './Main'

const Feed = () => {
    // const { user } = useSelector(state => state.userInfo)
    return (
        <div className='h-full flex bg-zinc-950 text-zinc-200 w-full'>
            <Sidebar />
            <Main />
        </div>
    )
}

export default Feed