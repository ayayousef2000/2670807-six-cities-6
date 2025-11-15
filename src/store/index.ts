import { configureStore } from '@reduxjs/toolkit';
import { offersSlice } from './offers-slice';
import { offerSlice } from './offer-slice';
import { userSlice } from './user-slice';
import { createAPI } from './api';

export const api = createAPI();

export const store = configureStore({
  reducer: {
    [offersSlice.name]: offersSlice.reducer,
    [offerSlice.name]: offerSlice.reducer,
    [userSlice.name]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
