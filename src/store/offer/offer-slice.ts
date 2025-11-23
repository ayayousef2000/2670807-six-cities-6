import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import {
  fetchNearbyAction,
  fetchOfferAction,
  fetchReviewsAction,
  postCommentAction,
  changeFavoriteStatusAction
} from './offer-thunks';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error' | 'notFound';

interface OfferState {
  offer: Offer | null;
  reviews: Review[];
  nearbyOffers: Offer[];
  offerStatus: RequestStatus;
  reviewsStatus: RequestStatus;
  nearbyStatus: RequestStatus;
  sendingStatus: RequestStatus;
  sendingError: string | null;
}

const initialState: OfferState = {
  offer: null,
  reviews: [],
  nearbyOffers: [],
  offerStatus: 'idle',
  reviewsStatus: 'idle',
  nearbyStatus: 'idle',
  sendingStatus: 'idle',
  sendingError: null,
};

export const offerSlice = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    dropOffer: (state) => {
      state.offer = null;
      state.reviews = [];
      state.nearbyOffers = [];
      state.offerStatus = 'idle';
      state.reviewsStatus = 'idle';
      state.nearbyStatus = 'idle';
      state.sendingStatus = 'idle';
      state.sendingError = null;
    },
    dropSendingStatus: (state) => {
      state.sendingStatus = 'idle';
      state.sendingError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.offerStatus = 'loading';
      })
      .addCase(fetchOfferAction.fulfilled, (state, action) => {
        state.offerStatus = 'success';
        state.offer = action.payload;
      })
      .addCase(fetchOfferAction.rejected, (state, action) => {
        state.offerStatus = action.payload === 'NOT_FOUND' ? 'notFound' : 'error';
      })
      .addCase(fetchReviewsAction.pending, (state) => {
        state.reviewsStatus = 'loading';
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviewsStatus = 'success';
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.reviewsStatus = 'error';
      })
      .addCase(fetchNearbyAction.pending, (state) => {
        state.nearbyStatus = 'loading';
      })
      .addCase(fetchNearbyAction.fulfilled, (state, action) => {
        state.nearbyStatus = 'success';
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchNearbyAction.rejected, (state) => {
        state.nearbyStatus = 'error';
      })
      .addCase(postCommentAction.pending, (state) => {
        state.sendingStatus = 'loading';
        state.sendingError = null;
      })
      .addCase(postCommentAction.fulfilled, (state, action) => {
        state.sendingStatus = 'success';
        state.reviews.push(action.payload);
        state.sendingError = null;
      })
      .addCase(postCommentAction.rejected, (state, action) => {
        state.sendingStatus = 'error';
        state.sendingError = action.payload || 'Failed to post comment.';
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

export const { dropOffer, dropSendingStatus } = offerSlice.actions;
