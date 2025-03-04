import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import postReducer from './postSlice';

const userPersistConfig = {
    key: 'user', // Unique key for user state
    storage,
};

const postPersistConfig = {
    key: 'posts', // Unique key for posts state
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedPostReducer = persistReducer(postPersistConfig, postReducer);

const store = configureStore({
    reducer: {
        userInfo: persistedUserReducer,
        posts: persistedPostReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
