import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { fetchOfferAction, fetchReviewsAction, fetchNearbyAction, postCommentAction } from './api-actions';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error' | 'notFound';

interface OfferState {
  offer: Offer | null;
  reviews: Review[];
  nearbyOffers: Offer[];
  error: string | null;
  offerStatus: RequestStatus;
  reviewsStatus: RequestStatus;
  nearbyStatus: RequestStatus;
  sendingStatus: RequestStatus;
}

const initialState: OfferState = {
  offer: null,
  reviews: [],
  nearbyOffers: [],
  error: null,
  offerStatus: 'idle',
  reviewsStatus: 'idle',
  nearbyStatus: 'idle',
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
      state.error = null;
      state.offerStatus = 'idle';
      state.reviewsStatus = 'idle';
      state.nearbyStatus = 'idle';
      state.sendingStatus = 'idle';
    },
    resetSendingStatus: (state) => {
      state.sendingStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.offerStatus = 'loading';
      })
      .addCase(fetchOfferAction.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.offerStatus = 'success';
        state.offer = action.payload;
      })
      .addCase(fetchOfferAction.rejected, (state, action) => {
        if (action.payload === 'NOT_FOUND') {
          state.offerStatus = 'notFound';
        } else {
          state.offerStatus = 'error';
        }
      })
      .addCase(fetchReviewsAction.pending, (state) => {
        state.reviewsStatus = 'loading';
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.reviewsStatus = 'success';
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.reviewsStatus = 'error';
      })
      .addCase(fetchNearbyAction.pending, (state) => {
        state.nearbyStatus = 'loading';
      })
      .addCase(fetchNearbyAction.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.nearbyStatus = 'success';
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchNearbyAction.rejected, (state) => {
        state.nearbyStatus = 'error';
      })
      .addCase(postCommentAction.pending, (state) => {
        state.sendingStatus = 'loading';
        state.error = null;
      })
      .addCase(postCommentAction.fulfilled, (state, action: PayloadAction<Review>) => {
        state.sendingStatus = 'success';
        state.reviews.push(action.payload);
        state.error = null;
      })
      .addCase(postCommentAction.rejected, (state, action) => {
        state.sendingStatus = 'error';
        state.error = action.payload as string;
      });
  },
});

export const { dropOffer, resetSendingStatus } = offerSlice.actions;
