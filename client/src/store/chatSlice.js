import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedUser: null,
        messages: null,
        onlineUsers: [],
        unreadChats: []
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
        },
        setUnreadChats: (state, action) => {
            console.log(action.payload)
            const index = state.unreadChats.findIndex(e => e.senderId.toString() === action.payload.toString())
            if (index === -1) {
                state.unreadChats.push({ senderId: action.payload, msgs: 1 });
            } else {
                state.unreadChats[index].msgs += 1;
            }
        },
        filterUnreadChats: (state, action) => {
            state.unreadChats = state.unreadChats.filter(e => e.senderId.toString() != action.payload.toString())
        },
        clearUnreadChats: (state, action) => {
            state.unreadChats = []
        }
    },
})

export default chatSlice.reducer;
export const { setSelectedUser, setUnreadChats, filterUnreadChats, clearUnreadChats, setMessages, addMessage, setOnlineUsers, handleUnsendMsg } = chatSlice.actions;