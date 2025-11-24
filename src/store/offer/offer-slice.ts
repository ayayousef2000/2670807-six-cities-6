import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import {
  fetchNearbyAction,
  fetchOfferAction,
  fetchReviewsAction,
  postCommentAction
} from './offer-thunks';

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
  offerStatus: RequestStatus.Idle,
  reviewsStatus: RequestStatus.Idle,
  nearbyStatus: RequestStatus.Idle,
  sendingStatus: RequestStatus.Idle,
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
      state.offerStatus = RequestStatus.Idle;
      state.reviewsStatus = RequestStatus.Idle;
      state.nearbyStatus = RequestStatus.Idle;
      state.sendingStatus = RequestStatus.Idle;
      state.sendingError = null;
    },
    dropSendingStatus: (state) => {
      state.sendingStatus = RequestStatus.Idle;
      state.sendingError = null;
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
      .addCase(fetchReviewsAction.pending, (state) => {
        state.reviewsStatus = RequestStatus.Loading;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviewsStatus = RequestStatus.Success;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.reviewsStatus = RequestStatus.Error;
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
      .addCase(postCommentAction.pending, (state) => {
        state.sendingStatus = RequestStatus.Loading;
        state.sendingError = null;
      })
      .addCase(postCommentAction.fulfilled, (state, action) => {
        state.sendingStatus = RequestStatus.Success;
        state.reviews.push(action.payload);
        state.sendingError = null;
      })
      .addCase(postCommentAction.rejected, (state, action) => {
        state.sendingStatus = RequestStatus.Error;
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
