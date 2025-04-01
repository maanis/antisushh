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
            const index = state.user.posts.indexOf(action.payload)
            if (index != -1) {
                state.user.posts.splice(index, 1)
            }
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
        addOrRemoveSentReq: (state, action) => {
            console.log(action.payload)
            if (action.payload.type === 'Request removed') {
                state.user.sentRequests = state.user.sentRequests.filter(e => e.user.toString() != action.payload.data.toString())
            } else {
                state.user.sentRequests.push(action.payload.data)
            }
        }

    }
})

export default userSlice.reducer
export const { setUser, addPost, removePost, addBookmark, addOrRemoveSentReq, removeBookmark } = userSlice.actions