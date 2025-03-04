import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import userReducer from './userSlice';
import postReducer from './postSlice';

// Persist config for user state (stores user info persistently)
const userPersistConfig = {
    key: 'user',
    storage,
};

// Apply persistReducer only to user data
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        userInfo: persistedUserReducer, // Persist user state
        posts: postReducer, // Do NOT persist posts to avoid storage issues
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disables warnings related to non-serializable data
        }),
});

// Persistor for Redux Persist (only for user info)
export const persistor = persistStore(store);
export default store;
