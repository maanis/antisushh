import React, { useEffect, useState } from 'react';
import { Sparkles, Eye, EyeOff, Apple, Facebook, Loader2 } from 'lucide-react';
import bg from '/bg.webp'
import logo from '/logo.png'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import apiClient from '@/utils/apiClient';
import { setUnreadChats } from '@/store/chatSlice';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setloading] = useState(false);
    const [isSignUp, setisSignUp] = useState(false);
    const [name, setname] = useState('');
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fetchUnreadMsgs = async () => {
        try {
            const res = await apiClient('/chat/msgsToRead')
            if (res.success) {
                res.unreadMsgs.length > 0 && res.unreadMsgs?.map(e => dispatch(setUnreadChats(e.senderId)))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setloading(true)
            if (isSignUp && name === '') return toast('All fields are required')
            if (username === '' || password === '') return toast('All fields are required')
            if (isSignUp) {
                //register
                if (password.length < 6) return toast('password must be atleast 6 digit long')
                const userData = { name, username, password }
                const data = await apiClient('/register', "POST", userData)
                if (!data.success) return toast.error(data.message)
                if (data.success) {
                    toast.success(data.message)
                    localStorage.setItem("hasVisitedUpdateProfile", "false")
                    dispatch(setUser(data.user))
                    navigate('/update-profile')

                }
            } else {
                //login
                const userData = { username, password }
                const data = await apiClient("/login", "POST", userData);
                if (!data.success) return toast.error(data.message)
                data.success && toast.success(data.message)
                dispatch(setUser(data.user))
                fetchUnreadMsgs()
                navigate('/feed')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }

    }

    useEffect(() => {
        localStorage.clear()
        const token = Cookies.get("token");

        if (token) {
            navigate("/feed"); // Redirect to feed if token exists
        }
    }, []);


    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} className="h-full absolute w-full bg-gradient-to-b flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute h-full w-full bg-black opacity-45"></div>
            {/* Decorative stars */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 animate-pulse">
                    <Sparkles className="w-8 h-8 text-blue-200 transform rotate-45" />
                </div>
                <div className="absolute bottom-20 right-20 animate-pulse delay-300">
                    <Sparkles className="w-8 h-8 text-blue-200 transform -rotate-45" />
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-[550px]:p-5 shadow-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img src={logo} className='h-12 w-12 object-cover' alt="" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8 max-[550px]:mb-3">
                        <h1 className="text-2xl font-bold text-white mb-2 max-[550px]:text-lg">Welcome to AntiSush</h1>

                    </div>

                    {/* Form */}
                    <form>

                        <div className="space-y-4">
                            {isSignUp && <input
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                type="text"
                                placeholder="Full name"
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />}

                            <input
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                type="text"
                                placeholder="Username"
                                className="w-full bg-white/10 max-[550px]:text-sm max-[550px]:py-2 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="w-full bg-white/10 max-[550px]:text-sm max-[550px]:py-2 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                        </div>

                        {isSignUp ? <p className='text-white mt-3 max-[550px]:text-xs'>Already have an account? <span onClick={() => setisSignUp(!isSignUp)} className='text-blue-700 sm:cursor-pointer hover:underline font-semibold'>Sign In</span></p> : <p className='text-white mt-3 max-[550px]:text-xs'>Don't have an account? <span onClick={() => setisSignUp(!isSignUp)} className='text-blue-700 sm:cursor-pointer hover:underline font-semibold'>Sign Up</span></p>}

                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 transition-colors text-white rounded-lg p-3 mt-6 font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                        >
                            {loading ? (<h2 className='flex w-full justify-center max-[550px]:text-sm gap-1'><Loader2 className='animate-spin font-bold max-[550px]:text-sm' /><span>Please wait...</span></h2>) : isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;