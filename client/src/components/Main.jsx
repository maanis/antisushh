import React from 'react'
import RightSideBar from './RightSideBar'
import Home from './Home'

const Main = ({ suggestedUsers }) => {
    return (
        <div className='flex w-[85%] overflow-y-auto'>
            <Home />
            <RightSideBar suggestedUsers={suggestedUsers} />
        </div>
    )
}

export default Main