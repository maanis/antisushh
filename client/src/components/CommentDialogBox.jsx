import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ChevronLeft, Ellipsis } from "lucide-react";
import { formatTime, userDefaultPfp } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setposts } from "@/store/postSlice";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const CommentDialogBox = ({ post, open, image, setopen, ismenuopen, setismenuopen }) => {
    const currentUser = useSelector(state => state.userInfo.user)
    const reduxPosts = useSelector(state => state.posts.posts)
    const dispatch = useDispatch()
    const [commentText, setcommentText] = useState('')
    const createdAt = new Date(post.createdAt).toLocaleString();
    const date = new Date(createdAt);
    const formattedTime = `${date.getHours()}:${date.getMinutes()}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const [postComments, setpostComments] = useState(post.comments)
    const handleInteraction = () => {
        if (ismenuopen) {
            setopen(true)
        } else {
            setopen(false)
        }

    }



    const handlePostComment = async () => {
        try {
            const res = await fetch(`https://antisushh.onrender.com/post/addComments/${post._id}`, {
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
                const updatedPosts = reduxPosts.map(e => {
                    return e._id === post._id ? { ...e, comments: [...e.comments, { text: data.commentText, user: data.user }] } : e
                })
                dispatch(setposts(updatedPosts))
                toast.success(data.message)

            }
        } catch (error) {
            console.log(error)

        }
    }


    const isMd = useMediaQuery({ query: "(max-width: 768px)" });
    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            if (isMd && open) {
                setopen(false);
            }
            history.pushState(null, "", window.location.href);
        };
        history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isMd, open]);
    return (
        <Dialog open={open} >
            <DialogContent className=' w-[950px] max-h-[35rem] max-[1000px]:w-[700px] max-md:w-[560px] max-[600px]:w-full overflow-hidden max-w-full border-none bg-neutral-900 text-white outline-none rounded-none p-0' onInteractOutside={handleInteraction}>
                <DialogTitle className="hidden">Comment Dialog</DialogTitle>

                <div className="flex">
                    <div className="flex  max-[1000px]:h-[28rem] max-md:h-[22rem] max-[600px]:h-[31rem] flex-1 max-[600px]:hidden">
                        <img src={image} loading='lazy' className="object-cover w-full flex flex-grow-0" alt="" />

                    </div>
                    <div className="flex h-[35rem] max-[1000px]:h-[28rem] max-[600px]:relative max-[600px]:bottom-0 max-md:h-[22rem] max-[600px]:h-[31rem] w-[35%] max-[600px]:w-full max-md:w-[40%] flex-col">
                        {/* Header */}
                        <div className="w-full border-b hidden max-[600px]:flex py-3 border-zinc-700">
                            <ChevronLeft onClick={() => setopen(false)} className="absolute ml-2" />
                            <h2 className="text-center w-full">Comments</h2>
                        </div>
                        <div className="box-a h-[10%] px-3 max-[600px]:py-7 border-b border-zinc-700 flex items-center gap-2">
                            <img src={post?.user?.pfp ? post?.user?.pfp : userDefaultPfp}
                                className="w-8 h-8 max-[1000px]:h-6 max-[1000px]:w-6 max-[600px]:h-8 max-[600px]:w-8 object-cover object-top rounded-full" alt="" />
                            <div className="dets">
                                <div className="flex gap-2 items-center">
                                    <h3 className="text-[16px] max-[1000px]:text-[12px] max-[600px]:mt-0 max-[600px]:text-[16px]">{post?.user?.username}</h3>
                                    <h3 className="text-zinc-300 text-[12px]">{post?.caption}</h3>
                                </div>
                                <p className="text-[10px] max-[1000px]:text-[8px] max-[600px]:text-[10px] text-zinc-400">{formattedTime}</p>
                            </div>
                            <div className="ml-auto relative dot sm:cursor-pointer">
                                <Ellipsis onClick={() => setismenuopen(true)} className="max-[1000px]:size-4" />
                            </div>
                        </div>

                        <div className={`h-[80%] ${postComments.length < 1 && 'flex justify-center items-center'}  py-5 px-3 overflow-y-auto border-b border-zinc-700`}>
                            {postComments.length < 1 ? <p className="max-md:text-xs">nothing to show</p> : postComments.slice().reverse().map((e, index) => (
                                <div key={index} className="flex gap-3 mb-3">
                                    <Link to={`/profile/${e.user.username}`}><img src={e.user.pfp ? e.user.pfp : userDefaultPfp}
                                        className="w-8 h-8 object-cover object-top  rounded-full" alt="" /></Link>
                                    <div>
                                        <p className="text-[12px] text-zinc-400">
                                            <span className="font-semibold text-zinc-200 mr-1 max-[1000px]:text-[11px] max-[600px]:text-[15px] max-[600px]:font-light">{e.user.username}</span> <span className="max-[1000px]:text-[10px] max-[600px]:text-[13px]">{e.text}</span>
                                        </p>
                                        <p className="text-[12px] text-zinc-500 max-[1000px]:text-[10px]">{formatTime(e.createdAt)} <span className="ml-2 max-[1000px]:text-[10px]">Reply</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Box */}
                        <form onSubmit={(e) => e.preventDefault()} className="h-[10%] flex items-center justify-between border-b border-zinc-700">
                            <input value={commentText} onChange={(e) => setcommentText(e.target.value)} type="text" className="w-full px-2 py-2 outline-none bg-transparent max-[1000px]:text-[12px] max-[1000px]:py-1" placeholder="add a comment..." />
                            {commentText.trim() && <button type="submit" onClick={handlePostComment} className="text-blue-500 pr-3">Post</button>}
                        </form>
                    </div>

                </div>

            </DialogContent>
        </Dialog >
    );
};

export default CommentDialogBox;
