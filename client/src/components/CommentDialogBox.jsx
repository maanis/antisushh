import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Ellipsis } from "lucide-react";
import { userDefaultPfp } from "@/utils/constant";
import { toast } from "sonner";

const CommentDialogBox = ({ post, open, image, setopen, ismenuopen, setismenuopen }) => {
    const currentUser = useSelector(state => state.userInfo.user)
    const reduxPosts = useSelector(state => state.posts.posts)

    const [commentText, setcommentText] = useState('')

    const [postComments, setpostComments] = useState(post.comments)
    console.log(post.comments)
    const handleInteraction = (e) => {
        if (ismenuopen) {
            setopen(true)
        } else {
            setopen(false)
        }

    }

    const handlePostComment = async () => {
        try {
            const res = await fetch(`http://localhost:3000/post/addComments/${post._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentText }),
                credentials: 'include'
            })
            const data = await res.json();
            if (data.success) {
                setcommentText('');
                setpostComments([...postComments, { text: data.commentText, user: data.user }])
                console.log(data)
                toast.success(data.message)

            }
        } catch (error) {
            console.log(error)

        }
    }
    return (
        <Dialog open={open} >
            <DialogContent className=' w-[950px] max-h-[35rem] overflow-hidden max-w-full border-none bg-neutral-900 text-white outline-none rounded-none p-0' onInteractOutside={handleInteraction}>
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
                                <h3 className="text-[16px]">{post?.user.username}</h3>
                                <p className="text-[12px] text-zinc-300">create</p>
                            </div>
                            <div className="ml-auto relative dot cursor-pointer">
                                <Ellipsis onClick={(e) => setismenuopen(true)} />
                            </div>
                        </div>

                        <div className={`h-[80%] ${postComments.length < 1 && 'flex justify-center items-center'}  py-5 px-3 overflow-y-auto border-b border-zinc-700`}>
                            {postComments.length < 1 ? 'Nothing to show!' : postComments.map((e, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <img src={e.user.pfp ? e.user.pfp : userDefaultPfp}
                                        className="w-10 h-10 object-cover object-top rounded-full" alt="" />
                                    <div>
                                        <p className="text-[12px] text-zinc-400">
                                            <span className="font-semibold text-zinc-200 mr-1">{e.user.username}</span> {e.text}
                                        </p>
                                        <p className="text-[12px] text-zinc-500">1d <span className="ml-2">Reply</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Box */}
                        <form onSubmit={(e) => e.preventDefault()} className="h-[10%] flex items-center justify-between border-b border-zinc-700">
                            <input value={commentText} onChange={(e) => setcommentText(e.target.value)} type="text" className="w-full px-2 py-2 outline-none bg-transparent" placeholder="add a comment..." />
                            {commentText.trim() && <button type="submit" onClick={handlePostComment} className="text-blue-500 pr-3">Post</button>}
                        </form>
                    </div>

                </div>

            </DialogContent>
        </Dialog >
    );
};

export default CommentDialogBox;
