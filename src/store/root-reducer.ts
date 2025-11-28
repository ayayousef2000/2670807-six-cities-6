import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { userSlice } from './user';
import { offersSlice } from './offers';
import { offerSlice } from './offer';
import { favoritesSlice } from './favorites';
import { reviewsSlice } from './reviews';
import { nearPlacesSlice } from './near-places';

export const rootReducer = combineReducers({
  [NameSpace.User]: userSlice.reducer,
  [NameSpace.Offers]: offersSlice.reducer,
  [NameSpace.Offer]: offerSlice.reducer,
  [NameSpace.Favorites]: favoritesSlice.reducer,
  [NameSpace.Reviews]: reviewsSlice.reducer,
  [NameSpace.NearPlaces]: nearPlacesSlice.reducer,
});
