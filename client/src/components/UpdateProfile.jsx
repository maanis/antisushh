import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Link as LinkIcon, Mail, User, FileText } from 'lucide-react';


export default function UpdateProfile() {


    return (
        <div
            className="min-h-screen w-full overflow-y-auto  mx-auto text-white bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8 relative"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')"
            }}
        >
            {/* Overlay with blur effect */}
            {/* <div className="absolute inset-0 h-full bottom-0 backdrop-blur-sm bg-black/30" /> */}

            <div className="relative max-w-2xl mx-auto text-white">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Complete Your Profile</h1>
                    <p className="mt-2 text-gray-200 text-lg">Let's make your profile stand out</p>
                </div>

                <div className="backdrop-blur-xl bg-zinc-600/45 rounded-2xl shadow-2xl p-8 transition-all duration-300">
                    <form className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <User className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="profileTitle" className="block text-sm font-medium ">
                                        Profile Title
                                    </label>
                                    <input
                                        type="text"
                                        id="profileTitle"
                                        name="profileTitle"
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium ">
                                        Bio
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute top-3 left-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="bio"
                                            name="bio"

                                            rows={4}
                                            placeholder="Tell us about yourself..."
                                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-100">
                                        Email
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"

                                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                <LinkIcon className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-white">Social Links</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="githubUrl" className="block text-sm font-medium text-zinc-100">
                                        GitHub Profile
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm group">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Github className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        </div>
                                        <input
                                            type="url"
                                            id="githubUrl"
                                            name="githubUrl"
                                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="twitterUrl" className="block text-sm font-medium text-zinc-100">
                                        Twitter Profile
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm group">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <Twitter className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        </div>
                                        <input
                                            type="url"
                                            id="twitterUrl"
                                            name="twitterUrl"
                                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="https://twitter.com/username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-zinc-100">
                                        Personal Website
                                    </label>
                                    <div className="mt-1 relative rounded-lg shadow-sm group">
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <LinkIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        </div>
                                        <input
                                            type="url"
                                            id="websiteUrl"
                                            name="websiteUrl"
                                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="https://yourwebsite.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}