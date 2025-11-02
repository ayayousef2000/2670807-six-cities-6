import { configureStore } from '@reduxjs/toolkit';
import { offersSlice } from './offers-slice';

export const store = configureStore({
  reducer: {
    [offersSlice.name]: offersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
