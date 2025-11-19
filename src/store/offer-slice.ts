import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { fetchOfferAction, fetchReviewsAction, fetchNearbyAction, postCommentAction } from './api-actions';

interface OfferState {
  offer: Offer | null;
  reviews: Review[];
  nearbyOffers: Offer[];
  isOfferLoading: boolean;
  hasError: boolean;
  sendingStatus: 'idle' | 'pending' | 'success' | 'error';
}

const initialState: OfferState = {
  offer: null,
  reviews: [],
  nearbyOffers: [],
  isOfferLoading: false,
  hasError: false,
  sendingStatus: 'idle',
};

export const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    dropOffer: (state) => {
      state.offer = null;
      state.reviews = [];
      state.nearbyOffers = [];
      state.hasError = false;
      state.sendingStatus = 'idle';
    },
    resetSendingStatus: (state) => {
      state.sendingStatus = 'idle';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.isOfferLoading = true;
        state.hasError = false;
      })
      .addCase(fetchOfferAction.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.isOfferLoading = false;
        state.offer = action.payload;
      })
      .addCase(fetchOfferAction.rejected, (state) => {
        state.isOfferLoading = false;
        state.hasError = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.reviews = action.payload;
        state.reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
      .addCase(fetchNearbyAction.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(postCommentAction.pending, (state) => {
        state.sendingStatus = 'pending';
      })
      .addCase(postCommentAction.fulfilled, (state, action: PayloadAction<Review>) => {
        state.sendingStatus = 'success';
        state.reviews.push(action.payload);
        state.reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
      .addCase(postCommentAction.rejected, (state) => {
        state.sendingStatus = 'error';
      });
  },
});

export const { dropOffer, resetSendingStatus } = offerSlice.actions;
