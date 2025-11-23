import { createSlice } from '@reduxjs/toolkit';
import { fetchFavoritesAction } from './favorites-thunks';
import { changeFavoriteStatusAction } from '../offer/offer-thunks';
import { Offer } from '../../types/offer';
import { NameSpace } from '../../const';

type FavoritesState = {
  favorites: Offer[];
  isFavoritesLoading: boolean;
  hasError: boolean;
};

const initialState: FavoritesState = {
  favorites: [],
  isFavoritesLoading: false,
  hasError: false,
};

export const favoritesSlice = createSlice({
  name: NameSpace.Favorites,
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.isFavoritesLoading = true;
        state.hasError = false;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.isFavoritesLoading = false;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.isFavoritesLoading = false;
        state.hasError = true;
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
