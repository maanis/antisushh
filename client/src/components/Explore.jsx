import React from 'react';
import { Paperclip, Mic, Search, Send, PenBox, ImageIcon, UserCircle2, Code } from 'lucide-react';
import axios from 'axios';

function Explore() {
    const [qna, setQna] = React.useState([]);
    const [input, setInput] = React.useState('');
    console.log(qna)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            // Add question with a placeholder answer
            setQna((prev) => [...prev, { question: input, answer: '...' }]);

            const res = await axios({
                method: 'POST',
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDqrF609vEHUsW6I57_6nFQglFLGvMR5zY',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    contents: [{ role: "user", parts: [{ text: input }] }],
                }
            });

            const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response found.";

            // ✅ Correctly update the last answer instead of adding a new one
            setQna((prev) => {
                return prev.map((qna, index) =>
                    index === prev.length - 1 ? { ...qna, answer: responseText } : qna
                );
            });

            setInput(""); // Clear input
        } catch (error) {
            console.error("Error:", error);

            setQna((prev) =>
                prev.map((qna, index) =>
                    index === prev.length - 1 ? { ...qna, answer: "Something went wrong. Please try again." } : qna
                )
            );
        }
    };

    return (
        <div className="h-full w-full bg-neutral-950 flex flex-col">
            {/* Header */}
            <header className="border-b border-neutral-800 p-4">
                <h1 className="text-white text-xl font-semibold">AI Chat</h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Welcome Section */}
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
                    <h2 className="text-white text-2xl font-bold">Welcome to Script</h2>
                    <p className="text-neutral-400 text-sm">Get started by Script a task and Chat can do the rest. Not sure where to start?</p>
                </div>

                {/* CTA Buttons Grid */}
                <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <PenBox className="text-amber-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm">Write copy</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <ImageIcon className="text-blue-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm">Image generation</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <UserCircle2 className="text-green-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm">Create avatar</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-pink-100 p-2 rounded-lg">
                            <Code className="text-pink-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm">Write code</span>
                    </button>
                </div>

                {/* Chat Messages */}
                <div className='max-w-5xl mx-auto'>
                    {qna.length > 0 ? qna.map((e, i) => (
                        <div key={i} className="space-y-5">
                            {/* User Message */}
                            <div className="flex w-full justify-end">
                                <div className="flex items-start max-w-[70%] flex-row-reverse ">
                                    <div className="bg-neutral-700 ml-2 rounded-full p-2">
                                        <UserCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 bg-neutral-700 rounded-lg px-4 py-3">
                                        <p className="text-white text-sm">{e.question}</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Message */}
                            <div className="flex w-full justify-start">
                                <div className="flex items-start max-w-[70%] ">
                                    <div className="bg-blue-600 rounded-full mr-2 p-2">
                                        <UserCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 bg-neutral-800 rounded-lg px-4 py-3">
                                        <p className="text-white text-sm">
                                            {e.answer === "..." ? (
                                                <span className="animate-pulse text-gray-400">Loading...</span>
                                            ) : (
                                                e.answer
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <h2 className='text-center text-neutral-600 text-sm'>start a chat by giving prompt...</h2>}
                </div>

            </main>

            {/* Input Section */}
            <footer className="border-t border-neutral-800 p-4 w-full">
                <div className="max-w-5xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-neutral-800 rounded-lg p-2">
                        <input
                            type="text"
                            placeholder="what's on your mind?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent text-white w-full placeholder-neutral-400 outline-none px-2"
                        />
                        <div className="flex items-center space-x-2 px-2">
                            <button type='submit' disabled={!input.trim()} className="bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-lg hover:bg-blue-700 transition">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    <p className="text-neutral-500 text-xs mt-2 text-center">
                        Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Explore;