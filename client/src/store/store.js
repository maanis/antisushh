import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import postReducer from './postSlice';
import chatReducer from './chatSlice';
import socketReducer from './socketSlice';

const userPersistConfig = {
    key: 'user',
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        userInfo: persistedUserReducer,
        posts: postReducer,
        chat: chatReducer,
        socket: socketReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
