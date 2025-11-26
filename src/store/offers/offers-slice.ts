import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_CITY, NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { fetchOffersAction } from './offers-thunks';

interface OffersState {
  city: string;
  offers: Offer[];
  requestStatus: RequestStatus;
  error: string | null;
}

const initialState: OffersState = {
  city: DEFAULT_CITY,
  offers: [],
  requestStatus: RequestStatus.Idle,
  error: null,
};

export const offersSlice = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.requestStatus = RequestStatus.Error;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const offerIndex = state.offers.findIndex((offer) => offer.id === action.payload.id);
        if (offerIndex !== -1) {
          state.offers[offerIndex].isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { setCity } = offersSlice.actions;
