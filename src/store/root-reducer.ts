import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { userSlice } from './user/user-slice';
import { offersSlice } from './offers/offers-slice';
import { offerSlice } from './offer/offer-slice';
import { favoritesSlice } from './favorites/favorites-slice';

export const rootReducer = combineReducers({
  [NameSpace.User]: userSlice.reducer,
  [NameSpace.Offers]: offersSlice.reducer,
  [NameSpace.Offer]: offerSlice.reducer,
  [NameSpace.Favorites]: favoritesSlice.reducer,
});
