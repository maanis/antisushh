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
        },
        addRecieveReq: (state, action) => {
            console.log(action.payload)
            state.user.recieveRequests.push(action.payload)
        },
        removeRecieveReq: (state, action) => {
            console.log(action.payload)
            state.user.recieveRequests = state.user.recieveRequests.filter(e => e.user._id.toString() != action.payload.toString())
        },
        addToPal: (state, action) => {
            console.log(action.payload)
            state.user.pals.push(action.payload)
        },
        acceptReq: (state, action) => {
            console.log(action.payload)
            state.user.sentRequests = state.user.sentRequests.filter(e => e.user.toString() != action.payload.toString())
            state.user.pals.push(action.payload.toString())
        },
        removeSentReq: (state, action) => {
            console.log(action.payload)
            state.user.sentRequests = state.user.sentRequests.filter(e => e.user.toString() != action.payload.toString())
        },



    }
})

export default userSlice.reducer
export const { setUser, addPost, removePost, acceptReq, addToPal, removeRecieveReq, addRecieveReq, addBookmark, addOrRemoveSentReq, removeSentReq, removeBookmark } = userSlice.actions