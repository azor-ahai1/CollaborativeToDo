import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice.js';
import taskReducer from './taskSlice.js';
import actionLogReducer from './actionLogSlice.js';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'tasks']
};

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  actionLog: actionLogReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store; 