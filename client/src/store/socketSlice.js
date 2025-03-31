import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    socketIo: null,
}
const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socketIo = action.payload
        }
    }
})

export default socketSlice.reducer
export const { setSocket } = socketSlice.actions