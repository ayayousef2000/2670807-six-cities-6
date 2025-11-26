import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';
import { fetchNearPlacesAction } from './near-places-thunks';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';

interface NearPlacesState {
  nearPlaces: Offer[];
  nearPlacesStatus: RequestStatus;
}

const initialState: NearPlacesState = {
  nearPlaces: [],
  nearPlacesStatus: RequestStatus.Idle,
};

export const nearPlacesSlice = createSlice({
  name: NameSpace.NearPlaces,
  initialState,
  reducers: {
    dropNearPlaces: (state) => {
      state.nearPlaces = [];
      state.nearPlacesStatus = RequestStatus.Idle;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNearPlacesAction.pending, (state) => {
        state.nearPlacesStatus = RequestStatus.Loading;
      })
      .addCase(fetchNearPlacesAction.fulfilled, (state, action) => {
        state.nearPlacesStatus = RequestStatus.Success;
        state.nearPlaces = action.payload;
      })
      .addCase(fetchNearPlacesAction.rejected, (state) => {
        state.nearPlacesStatus = RequestStatus.Error;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const foundPlace = state.nearPlaces.find((place) => place.id === action.payload.id);
        if (foundPlace) {
          foundPlace.isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { dropNearPlaces } = nearPlacesSlice.actions;
