import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts: null,
    activeProfilePosts: null
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
        
    }
})

export default postSlice.reducer
export const { setposts, setActiveProfilePosts, } = postSlice.actions