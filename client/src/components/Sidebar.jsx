import { Globe, HeartIcon, Home, LogOut, MessageCircle, PlusSquare, Search } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

const Sidebar = () => {
    const navigate = useNavigate('/')
    const data = [
        { icon: <Home size={'20px'} />, text: 'home' },
        { icon: <Search size={'20px'} />, text: 'search' },
        { icon: <Globe size={'20px'} />, text: 'explore' },
        { icon: <MessageCircle size={'20px'} />, text: 'messages' },
        { icon: <HeartIcon size={'20px'} />, text: 'notifications' },
        { icon: <PlusSquare size={'20px'} />, text: 'create' },
    ]
    const handleLogout = async () => {
        const res = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        })
        const data = await res.json()
        console.log(data)
        if (data.success) {
            navigate('/')
            toast.success(data.message)
        }
    }
    return (
        <div className='w-[15%] flex flex-col px-3 py-4 border-r border-zinc-700 h-full fixed'>
            <h2 className='font-extralight text-3xl logoText my-5 mb-8'>AntiSush</h2>
            {data.map((e, i) => {
                return <div className='flex cursor-pointer gap-2 my-2 font-medium items-center hover:bg-zinc-800 rounded-md px-3 py-3 ' key={i}>
                    <span className='text-sm'>{e.icon}</span>
                    <h3 className='capitalize'>{e.text}</h3>
                </div>
            })}
            <div className='mt-auto'>
                <div className="flex cursor-pointer items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                    <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-8 h-8 object-cover rounded-full ' alt="" />
                    <h3>username</h3>
                </div>
                <div onClick={handleLogout} className="flex cursor-pointer mt-2 items-center hover:bg-zinc-800 rounded-md px-3 py-3 gap-2">
                    <LogOut size={'20px'} />
                    <h3>Logout</h3>
                </div>
            </div>
        </div>
    )
}

export default Sidebar