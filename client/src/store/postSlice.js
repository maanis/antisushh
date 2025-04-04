import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts: null,
    activeProfilePosts: null,
    activeBookmarkPosts: null,
    searchDialog: false,
    commentDialog: false,
}
const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setposts: (state, action) => {
            state.posts = action.payload
        },
        setActiveProfilePosts: (state, action) => {
            state.activeProfilePosts = action.payload
        },
        addActiveProfilePosts: (state, action) => {
            state.activeProfilePosts.push(action.payload)
        },
        setActiveBookmarkPosts: (state, action) => {
            state.activeBookmarkPosts = action.payload
        },
        setSearchDialog: (state, action) => {
            state.searchDialog = action.payload
        },
        setCommentDialog: (state, action) => {
            state.commentDialog = action.payload
        },
    }
})

export default postSlice.reducer
export const { setposts, setActiveProfilePosts, setCommentDialog, addActiveProfilePosts, setSearchDialog, setActiveBookmarkPosts } = postSlice.actions