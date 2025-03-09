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
        }
    }
})

export default userSlice.reducer
export const { setUser, addPost, removePost } = userSlice.actions