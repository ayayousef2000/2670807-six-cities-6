import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { fetchNearbyAction, fetchOfferAction } from './offer-thunks';

interface OfferState {
  offer: Offer | null;
  nearbyOffers: Offer[];
  offerStatus: RequestStatus;
  nearbyStatus: RequestStatus;
}

const initialState: OfferState = {
  offer: null,
  nearbyOffers: [],
  offerStatus: RequestStatus.Idle,
  nearbyStatus: RequestStatus.Idle,
};

export const offerSlice = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    dropOffer: (state) => {
      state.offer = null;
      state.nearbyOffers = [];
      state.offerStatus = RequestStatus.Idle;
      state.nearbyStatus = RequestStatus.Idle;
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
      .addCase(fetchNearbyAction.pending, (state) => {
        state.nearbyStatus = RequestStatus.Loading;
      })
      .addCase(fetchNearbyAction.fulfilled, (state, action) => {
        state.nearbyStatus = RequestStatus.Success;
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchNearbyAction.rejected, (state) => {
        state.nearbyStatus = RequestStatus.Error;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        if (state.offer && state.offer.id === action.payload.id) {
          state.offer.isFavorite = action.payload.isFavorite;
        }
        const foundNearby = state.nearbyOffers.find((offer) => offer.id === action.payload.id);
        if (foundNearby) {
          foundNearby.isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { dropOffer } = offerSlice.actions;
