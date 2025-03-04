import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts: null
}
const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setposts: (state, action) => {
            state.posts = action.payload
        }
    }
})

export default postSlice.reducer
export const { setposts } = postSlice.actions