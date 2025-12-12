import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { Review } from '../../types/review';
import { State } from '../../types/state';

const MAX_REVIEWS = 10;

export const selectReviews = (state: State): Review[] =>
  state[NameSpace.Reviews].reviews;

export const selectReviewsStatus = (state: State): RequestStatus =>
  state[NameSpace.Reviews].status;

export const selectSendingStatus = (state: State): RequestStatus =>
  state[NameSpace.Reviews].sendingStatus;

export const selectSendingError = (state: State): string | null =>
  state[NameSpace.Reviews].sendingError;

export const selectSortedReviews = createSelector(
  [selectReviews],
  (reviews) =>
    [...reviews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_REVIEWS)
);
