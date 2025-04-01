import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import localForage from 'localforage';
import userReducer from './userSlice';
import postReducer from './postSlice';
import chatReducer from './chatSlice';
import socketReducer from './socketSlice';
import notificationReducer from './notificationsSlice';

const userPersistConfig = {
    key: 'user',
    storage: localForage, // Use IndexedDB instead of localStorage
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        userInfo: persistedUserReducer,
        posts: postReducer,
        chat: chatReducer,
        socket: socketReducer,
        notifications: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
