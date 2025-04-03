import React from 'react';
import { Paperclip, Mic, Search, Send, PenBox, ImageIcon, UserCircle2, Code } from 'lucide-react';

function Explore() {
    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-neutral-800 p-4">
                <h1 className="text-white text-xl font-semibold">AI Chat</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Welcome Section */}
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
                    <h2 className="text-white text-3xl font-bold">Welcome to Script</h2>
                    <p className="text-neutral-400">Get started by Script a task and Chat can do the rest. Not sure where to start?</p>
                </div>

                {/* CTA Buttons Grid */}
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <PenBox className="text-amber-600 w-5 h-5" />
                        </div>
                        <span className="text-white">Write copy</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <ImageIcon className="text-blue-600 w-5 h-5" />
                        </div>
                        <span className="text-white">Image generation</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <UserCircle2 className="text-green-600 w-5 h-5" />
                        </div>
                        <span className="text-white">Create avatar</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-pink-100 p-2 rounded-lg">
                            <Code className="text-pink-600 w-5 h-5" />
                        </div>
                        <span className="text-white">Write code</span>
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* AI Message */}
                    <div className="flex items-start space-x-4">
                        <div className="bg-blue-600 rounded-full p-2">
                            <UserCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 bg-neutral-800 rounded-lg p-4">
                            <p className="text-white">Hello! How can I assist you today? I can help with writing, coding, image generation, and more.</p>
                        </div>
                    </div>

                    {/* User Message */}
                    <div className="flex items-start space-x-4 flex-row-reverse">
                        <div className="bg-neutral-700 rounded-full p-2">
                            <UserCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 bg-neutral-700 rounded-lg p-4">
                            <p className="text-white">Can you help me write a blog post about AI technology?</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Input Section */}
            <footer className="border-t border-neutral-800 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex items-center bg-neutral-800 rounded-lg p-2">
                        <input
                            type="text"
                            placeholder="Summarize the latest|"
                            className="flex-1 bg-transparent text-white placeholder-neutral-400 outline-none px-2"
                        />
                        <div className="flex items-center space-x-2 px-2">
                            <button className="p-2 text-neutral-400 hover:text-white transition">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-neutral-400 hover:text-white transition">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-neutral-400 hover:text-white transition">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-neutral-500 text-sm mt-2 text-center">
                        Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Explore;