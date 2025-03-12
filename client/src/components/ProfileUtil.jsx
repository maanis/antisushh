import { userDefaultPfp } from '@/utils/constant'
import React from 'react'

const ProfileUtil = ({ user, text = 'switch' }) => {
    return (
        <div className='flex items-center justify-between py-2 w-full'>
            <div className="flex items-center gap-3">
                <img src={user?.pfp ? user?.pfp : userDefaultPfp}
                    className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                <h2>{user?.username}</h2>
            </div>
            <button className='text-blue-500 cursor-pointer'>{text}</button>
        </div>
    )
}

export default ProfileUtil