import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Ellipsis } from "lucide-react";
import { userDefaultPfp } from "@/utils/constant";

const CommentDialogBox = ({ open, image, setopen, ismenuopen, setismenuopen }) => {
    const [comment, setcomment] = useState('')
    const handleInteraction = (e) => {
        if (ismenuopen) {
            setopen(true)
        } else {
            setopen(false)
        }

    }
    return (
        <Dialog open={open} >
            <DialogContent className=' w-[950px] max-h-[35rem] overflow-hidden max-w-full border-none outline-none rounded-none p-0' onInteractOutside={handleInteraction}>
                <DialogTitle className="hidden">Comment Dialog</DialogTitle>

                <div className="flex">
                    <div className="flex flex-1">
                        <img src={image} className="object-cover w-full flex flex-grow-0" alt="" />

                    </div>
                    <div className="flex h-[35rem] w-[35%] flex-col">
                        {/* Header */}
                        <div className="box-a h-[10%] px-3 border-b border-zinc-700 flex items-center gap-2">
                            <img src={userDefaultPfp}
                                className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                            <div className="dets">
                                <h3 className="text-[16px]">username</h3>
                                <p className="text-[12px] text-zinc-300">create</p>
                            </div>
                            <div className="ml-auto relative dot cursor-pointer">
                                <Ellipsis onClick={(e) => setismenuopen(true)} />
                            </div>
                        </div>

                        <div className="h-[80%] py-5 px-3 overflow-y-auto border-b border-zinc-700">
                            {Array(20).fill(0).map((_, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                                    <div>
                                        <p className="text-[12px] text-zinc-500">
                                            <span className="font-semibold text-zinc-800">username</span> Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        </p>
                                        <p className="text-[12px] text-zinc-500">1d <span className="ml-2">Reply</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Box */}
                        <div className="h-[10%] flex items-center justify-between border-b border-zinc-700">
                            <input value={comment} onChange={(e) => setcomment(e.target.value)} type="text" className="w-full px-2 py-2 outline-none bg-transparent" placeholder="add a comment..." />
                            {comment.trim() && <button className="text-blue-500 pr-3">Post</button>}
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
};

export default CommentDialogBox;
