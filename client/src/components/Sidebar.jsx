import { Globe, Home, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'

const Sidebar = () => {
    const data = [
        { icon: <Home size={'20px'} />, text: 'home' },
        { icon: <Search size={'20px'} />, text: 'search' },
        { icon: <Globe size={'20px'} />, text: 'explore' },
        { icon: <MessageCircle size={'20px'} />, text: 'messages' },
        { icon: <PlusSquare size={'20px'} />, text: 'create' },
    ]
    return (
        <div className='w-[15%] flex flex-col p-8 border-r border-zinc-700 h-full fixed'>
            <h2 className='font-extralight text-3xl logoText my-5 mb-8'>AntiSush</h2>
            {data.map((e, i) => {
                return <div className='flex cursor-pointer gap-2 my-4 font-medium items-center' key={i}>
                    <span className='text-sm'>{e.icon}</span>
                    <h3 className='capitalize'>{e.text}</h3>
                </div>
            })}
            <span className='mt-auto'>hii</span>
        </div>
    )
}

export default Sidebar