import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        addPost: (state, action) => {
            state.user.posts.push(action.payload)
        },
        removePost: (state, action) => {
            state.user.posts.filter(e => e != action.payload.toString())
        },
        addBookmark: (state, action) => {
            state.user.bookmarks.push(action.payload)
        },
        removeBookmark: (state, action) => {
            const index = state.user.bookmarks.indexOf(action.payload)
            if (index != -1) {
                state.user.bookmarks.splice(index, 1)
            }
        },

    }
})

export default userSlice.reducer
export const { setUser, addPost, removePost, addBookmark, removeBookmark } = userSlice.actions