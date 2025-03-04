import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Main from './Main'
import { useDispatch, useSelector } from 'react-redux'
import { setposts } from '@/store/postSlice'
import { Loader, Loader2 } from 'lucide-react'

const Feed = () => {
    const { user } = useSelector(state => state.userInfo)
    const dispatch = useDispatch()
    async function fetchPosts() {
        try {
            const res = await fetch('http://localhost:3000/post/getAllPosts', {
                method: 'GET',
                credentials: 'include'
            })

            const data = await res.json()
            dispatch(setposts(data.posts))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchPosts()
    }, [])
    const { posts } = useSelector(state => state.posts)
    console.log(posts)
    return  posts ? (
        <div className='h-full flex bg-zinc-950 text-zinc-200 w-full'>
            <Sidebar />
            <Main />
        </div>
    ) : <h2 className='text-black h-full w-full flex items-center justify-center'><Loader2 size={58} className='animate-spin  text-black' /></h2>
}

export default Feed