import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import rewardReducer from './rewardSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        reward: rewardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
