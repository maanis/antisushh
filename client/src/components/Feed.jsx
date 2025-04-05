import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setposts } from '@/store/postSlice'
import apiClient from '@/utils/apiClient'
import RightSideBar from './RightSideBar'
import Home from './Home'

const Feed = () => {
    const { user } = useSelector(state => state.userInfo)
    const [suggestedUsers, setsuggestedUsers] = useState([])
    const dispatch = useDispatch()
    async function fetchPosts() {
        try {
            const data = await apiClient('/post/getAllPosts')
            dispatch(setposts(data.posts))
            console.log(data.posts)
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
    // const posts = null
    return (
        <div className='h-full  flex overflow-y-auto text-zinc-200 w-full'>
            <Home />
            <RightSideBar suggestedUsers={suggestedUsers} />
        </div>
    )
}

export default Feed