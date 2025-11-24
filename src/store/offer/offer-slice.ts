import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { fetchOfferAction } from './offer-thunks';

interface OfferState {
  offer: Offer | null;
  offerStatus: RequestStatus;
}

const initialState: OfferState = {
  offer: null,
  offerStatus: RequestStatus.Idle,
};

export const offerSlice = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    dropOffer: (state) => {
      state.offer = null;
      state.offerStatus = RequestStatus.Idle;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.offerStatus = RequestStatus.Loading;
      })
      .addCase(fetchOfferAction.fulfilled, (state, action) => {
        state.offerStatus = RequestStatus.Success;
        state.offer = action.payload;
      })
      .addCase(fetchOfferAction.rejected, (state, action) => {
        state.offerStatus = action.payload === 'NOT_FOUND' ? RequestStatus.NotFound : RequestStatus.Error;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        if (state.offer && state.offer.id === action.payload.id) {
          state.offer.isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { dropOffer } = offerSlice.actions;
