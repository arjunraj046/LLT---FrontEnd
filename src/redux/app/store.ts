import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userReducer } from '../reducer/userSlice';
import { rangeReducer } from '../reducer/rangeSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'range'],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedRangeReducer = persistReducer(persistConfig, rangeReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    range: persistedRangeReducer,
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
