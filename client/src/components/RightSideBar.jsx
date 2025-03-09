import React from 'react'
import ProfileUtil from './ProfileUtil'
import { useSelector } from 'react-redux'

const RightSideBar = ({ suggestedUsers }) => {
    const { user } = useSelector(state => state.userInfo)


    return (
        <div className='w-[25%] relative'>
            <div className='w-full  px-8 py-4 border-b border-zinc-700'>
                <ProfileUtil user={user} />
            </div>
            {/* <div className="absolute w-full h-[1px] mt-7 bg-zinc-800 left-0"></div> */}
            <h2 className='text-sm font-medium mt-4 px-8 text-zinc-600'>Suggested Users:</h2>
            <div className='w-full px-8 py-4'>
                {suggestedUsers.length > 0 ? suggestedUsers.map((e => {
                    return <ProfileUtil key={e._id} text='follow' user={e} />
                })) : 'nothing to show...'}
            </div>
        </div>
    )
}

export default RightSideBar