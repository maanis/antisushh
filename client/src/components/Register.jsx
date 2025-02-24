import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Apple, Facebook } from 'lucide-react';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: 'United States',
        agreed: false
    });


    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
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
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-300 p-4 rounded-2xl">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Nixon+!</h1>
                        <p className="text-blue-200 text-sm">
                            Credentials are only used to authenticate in ProHub. All saved data will be stored in your database.
                        </p>
                    </div>

                    {/* Form */}
                    <form>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <select
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                            </select>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400"
                                    checked={formData.agreed}
                                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                />
                                <label htmlFor="terms" className="text-sm text-white">
                                    I agree to the <a href="#" className="text-blue-300 hover:text-blue-200">Terms of service</a> and{' '}
                                    <a href="#" className="text-blue-300 hover:text-blue-200">Privacy policies</a> of ProHub Corporation
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg p-3 mt-6 font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                        >
                            SIGN UP
                        </button>

                        {/* Social Login */}
                        <div className="mt-8">
                            <div className="flex items-center justify-center space-x-4">
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Apple className="w-6 h-6 text-white" />
                                </button>
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </button>
                                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <Facebook className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;