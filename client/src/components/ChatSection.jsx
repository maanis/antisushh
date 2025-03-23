import React, { useEffect, useState } from 'react'
import ProfileUtil from './ProfileUtil'
import apiClient from '@/utils/apiClient'

const ChatSection = () => {
    const [suggestedUsers, setsuggestedUsers] = useState([])
    async function fetchsuggestedUsers() {
        try {
            const data = await apiClient('/user/suggestedUser')
            setsuggestedUsers(data.suggestedUsers)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchsuggestedUsers()
    }, [])
    return (
        <div className='text-white flex w-full'>
            <div className='w-[20%]  px-3'>
                {suggestedUsers?.length > 0 ? suggestedUsers.map((e => {
                    return <div className='flex items-center gap-3 py-2 px-1 hover:bg-zinc-900 my-2 rounded-md cursor-pointer'>
                        <img src={e.pfp} className='w-10 h-10 object-cover rounded-full' alt="" />
                        <p>{e.username}</p>
                    </div>
                })) : 'nothing to show...'}
            </div>
            {/* <div>id</div> */}
        </div>
    )
}

export default ChatSection