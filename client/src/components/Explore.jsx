import React, { useEffect } from 'react';
import { Paperclip, Mic, Search, Send, PenBox, ImageIcon, UserCircle2, Code, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { FaRobot } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userDefaultPfp } from '@/utils/constant';

function Explore() {
    const [qna, setQna] = React.useState([]);
    const [input, setInput] = React.useState('');
    const { user } = useSelector((state) => state.userInfo)
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_KEY;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setInput('')
        try {
            setQna((prev) => [...prev, { question: input, answer: '...' }]);

            const res = await axios({
                method: 'POST',
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiUrl}`,
                headers: { 'Content-Type': 'application/json' },
                data: {
                    contents: [
                        { role: "user", parts: [{ text: input.length > 10 ? `${input}; max to max 100 words` : input }] }
                    ]
                }

            });

            const responseText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response found.";

            setQna((prev) => {
                return prev.map((qna, index) =>
                    index === prev.length - 1 ? { ...qna, answer: responseText } : qna
                );
            });

            setInput("");
        } catch (error) {

            setQna((prev) =>
                prev.map((qna, index) =>
                    index === prev.length - 1 ? { ...qna, answer: "Something went wrong. Please try again." } : qna
                )
            );
        }
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
    }, [qna, handleSubmit])
    const bottomRef = React.useRef(null);

    return (
        <div className="h-full w-full overflow-hidden bg-neutral-950 flex flex-col">
            {/* Header */}
            <header className="border-b flex items-center gap-3 border-neutral-800 p-4">
                <ChevronLeft className='text-white md:hidden' onClick={() => navigate(-1 || '/feed')} />
                <h1 className="text-white text-xl font-semibold max-sm:text-lg">AI Chat</h1>
            </header>

            {/* Main Content */}
            <main ref={bottomRef} className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Welcome Section */}
                <div className="max-w-2xl mx-auto text-center space-y-4 max-md:space-y-2 max-[480px]:space-y-1 mb-8">
                    <h2 className="text-white text-2xl max-md:text-lg font-bold max-[450px]:text-sm">Welcome to AntiSush-Bot</h2>
                    <p className="text-neutral-400 text-sm  max-md:text-[10px] max-[450px]:text-[9px]">I know you don't have anyone to talk, so do I</p>
                </div>

                {/* CTA Buttons Grid */}
                <div className="max-w-lg mx-auto grid  grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center space-x-3 p-4 max-md:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <PenBox className="text-amber-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm max-md:text-xs max-[450px]:text-[10px] ">Write copy</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 max-md:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <ImageIcon className="text-blue-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm max-md:text-xs max-[450px]:text-[10px] ">Image generation</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 max-md:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <UserCircle2 className="text-green-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm max-md:text-xs max-[450px]:text-[10px] ">Create avatar</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 max-md:p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                        <div className="bg-pink-100 p-2 rounded-lg">
                            <Code className="text-pink-600 w-3 h-3 size-8" />
                        </div>
                        <span className="text-white text-sm max-md:text-xs max-[450px]:text-[10px] ">Write code</span>
                    </button>
                </div>

                {/* Chat Messages */}
                <div className='max-w-5xl mx-auto'>
                    {qna.length > 0 ? qna.map((e, i) => (
                        <div key={i} className="space-y-5">
                            {/* User Message */}
                            <div className="flex w-full justify-end mt-5">
                                <div className="flex items-start max-w-[70%] max-[500px]:max-w-[85%] flex-row-reverse ">
                                    <div className="bg-neutral-700 ml-2 rounded-full">
                                        <img src={user?.pfp ? user?.pfp : userDefaultPfp} loading='lazy' className='w-8 h-8 max-[500px]:w-5 max-[500px]:h-5 object-cover rounded-full' alt="" />
                                    </div>
                                    <div className="flex-1 bg-neutral-700 rounded-lg px-4 py-3 max-[480px]:py-[6px] max-[480px]:px-[10px]">
                                        <p className="text-white text-sm max-[480px]:text-xs ">{e.question}</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Message */}
                            <div className="flex w-full justify-start">
                                <div className="flex items-start max-w-[70%] max-[500px]:max-w-[85%] ">
                                    <div className="bg-blue-600 rounded-full mr-2 p-2 max-[500px]:p-[3px]">
                                        <FaRobot className="w-6 h-6 max-[500px]:w-4 max-[500px]:h-4 text-white" />
                                    </div>
                                    <div className="flex-1 bg-neutral-800 rounded-lg px-4 py-3 max-[480px]:py-[6px] max-[480px]:px-[10px]">
                                        <p className="text-white text-sm max-[480px]:text-xs ">
                                            {e.answer === "..." ? (
                                                <span className="animate-pulse text-gray-400">Thinking...</span>
                                            ) : (
                                                e.answer
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <h2 className='text-center text-neutral-600 animate-pulse text-sm max-[480px]:text-xs'>start a chat by giving prompt...</h2>}
                </div>

            </main>

            {/* Input Section */}
            <footer className="border-t mt-auto border-neutral-800 p-4 max-[500px]:p-2 w-full absolute bottom-0">
                <div className="max-w-5xl max-[500px]:px-[10px] mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-neutral-800 rounded-lg p-2 max-[500px]:p-[7px]">
                        <input
                            type="text"
                            placeholder="what's on your mind?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent text-white w-full max-md:text-sm max-[500px]:text-xs placeholder-neutral-400 outline-none px-2 max-[330px]:py-[6px]"
                        />
                        <div className="flex items-center space-x-2 px-2">
                            <button type='submit' disabled={!input.trim()} className="bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 max-[500px]:p-[3px] rounded-lg max-[500px]:rounded-sm hover:bg-blue-700 transition">
                                <Send className="w-5 h-5 max-[500px]:w-3 max-[500px]:h-3 max-[330px]:size-4" />
                            </button>
                        </div>
                    </form>
                    <p className="text-neutral-500 text-xs mt-2 max-md:text-[8px] max-[500px]:text-[6px] text-center">
                        Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Explore;