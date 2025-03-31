import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedUser: null,
        messages: null,
        onlineUsers: [],
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        handleUnsendMsg: (state, action) => {
            state.messages = state.messages.filter(
                (msg) => msg._id !== action.payload
            );
        }
    },
})

export default chatSlice.reducer;
export const { setSelectedUser, setMessages, addMessage, setOnlineUsers, handleUnsendMsg } = chatSlice.actions;