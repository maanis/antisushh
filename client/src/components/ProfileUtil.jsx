import { userDefaultPfp } from '@/utils/constant'
import React from 'react'
import { Link } from 'react-router-dom'

const ProfileUtil = ({ user, text = '' }) => {
    return (
        <div className='flex items-center justify-between py-2 w-full'>
            <Link to={`/profile/${user?.username}`} className="flex items-center gap-3">
                <img loading='lazy' src={user?.pfp ? user?.pfp : userDefaultPfp}
                    className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                <h2>{user?.username}</h2>
            </Link>
        </div>
    )
}

export default ProfileUtil