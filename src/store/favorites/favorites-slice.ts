import { createSlice } from '@reduxjs/toolkit';
import { fetchFavoritesAction, changeFavoriteStatusAction } from './favorites-thunks';
import { Offer } from '../../types/offer';
import { NameSpace, RequestStatus } from '../../const';

interface FavoritesState {
  favorites: Offer[];
  requestStatus: RequestStatus;
}

const initialState: FavoritesState = {
  favorites: [],
  requestStatus: RequestStatus.Idle,
};

export const favoritesSlice = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.requestStatus = RequestStatus.Idle;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.requestStatus = RequestStatus.Error;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const offer = action.payload;
        if (offer.isFavorite) {
          state.favorites.push(offer);
        } else {
          state.favorites = state.favorites.filter((item) => item.id !== offer.id);
        }
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
