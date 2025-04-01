import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification._id !== action.payload
            );
        },
        markNotificationsAsRead: (state, action) => {
            const unreadIds = action.payload;
            state.notifications = state.notifications.map(notification =>
                unreadIds.includes(notification._id)
                    ? { ...notification, isRead: true }
                    : notification
            );
        },
    },
})

export default notificationSlice.reducer;
export const { setNotifications, addNotification, removeNotification, markNotificationsAsRead } = notificationSlice.actions;