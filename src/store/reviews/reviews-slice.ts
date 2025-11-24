import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Review } from '../../types/review';
import { fetchReviewsAction, postCommentAction } from './reviews-thunks';

interface ReviewsState {
  reviews: Review[];
  status: RequestStatus;
  sendingStatus: RequestStatus;
  sendingError: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  status: RequestStatus.Idle,
  sendingStatus: RequestStatus.Idle,
  sendingError: null,
};

export const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {
    dropReviews: (state) => {
      state.reviews = [];
      state.status = RequestStatus.Idle;
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
      .addCase(fetchReviewsAction.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.status = RequestStatus.Error;
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
      });
  },
});

export const { dropReviews, dropSendingStatus } = reviewsSlice.actions;
