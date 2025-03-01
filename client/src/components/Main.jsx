import React from 'react'
import RightSideBar from './RightSideBar'
import Home from './Home'

const Main = () => {
    return (
        <div className='flex w-[85%] overflow-y-auto'>
            <Home />
            <RightSideBar />
        </div>
    )
}

export default Main