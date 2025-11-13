import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { fetchOfferDataAction } from './api-actions';

interface OfferState {
  offer: Offer | null;
  reviews: Review[];
  nearbyOffers: Offer[];
  isOfferDataLoading: boolean;
  hasError: boolean;
}

const initialState: OfferState = {
  offer: null,
  reviews: [],
  nearbyOffers: [],
  isOfferDataLoading: false,
  hasError: false,
};

export const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOfferDataAction.pending, (state) => {
        state.isOfferDataLoading = true;
        state.hasError = false;
      })
      .addCase(
        fetchOfferDataAction.fulfilled,
        (
          state,
          action: PayloadAction<{
            offer: Offer;
            reviews: Review[];
            nearbyOffers: Offer[];
          }>
        ) => {
          state.isOfferDataLoading = false;
          state.offer = action.payload.offer;
          state.reviews = action.payload.reviews;
          state.nearbyOffers = action.payload.nearbyOffers;
        }
      )
      .addCase(fetchOfferDataAction.rejected, (state) => {
        state.isOfferDataLoading = false;
        state.hasError = true;
      });
  },
});
