import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Main from './Main'
import { useDispatch, useSelector } from 'react-redux'
import { setposts } from '@/store/postSlice'
import { Loader, Loader2 } from 'lucide-react'
import apiClient from '@/utils/apiClient'

const Feed = () => {
    const { user } = useSelector(state => state.userInfo)
    const [suggestedUsers, setsuggestedUsers] = useState([])
    const dispatch = useDispatch()
    async function fetchPosts() {
        try {
            const data = await apiClient('/post/getAllPosts')
            dispatch(setposts(data.posts))
        } catch (error) {
            console.log(error)
        }
    }
    async function fetchsuggestedUsers() {
        try {
            const data = await apiClient('/user/suggestedUser')
            setsuggestedUsers(data.suggestedUsers)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchPosts()
        fetchsuggestedUsers()
    }, [])
    const { posts } = useSelector(state => state.posts)
    return posts ? (
        <div className='h-full flex bg-zinc-950 text-zinc-200 w-full'>
            <Sidebar />
            <Main suggestedUsers={suggestedUsers}/>
        </div>
    ) : <h2 className='text-black h-full w-full flex items-center justify-center'><Loader2 size={58} className='animate-spin  text-black' /></h2>
}

export default Feed