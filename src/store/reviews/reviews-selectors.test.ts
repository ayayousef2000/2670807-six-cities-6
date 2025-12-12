import { describe, it, expect } from 'vitest';
import { NameSpace, RequestStatus } from '../../const';
import { makeFakeReview } from '../../utils/mocks';
import {
  selectReviews,
  selectReviewsStatus,
  selectSendingStatus,
  selectSendingError,
  selectSortedReviews
} from './reviews-selectors';
import { State } from '../../types/state';

describe('Reviews Selectors', () => {
  const mockReviewOld = { ...makeFakeReview(), date: '2023-01-01T12:00:00Z', id: 'old' };
  const mockReviewNew = { ...makeFakeReview(), date: '2023-12-31T12:00:00Z', id: 'new' };

  const manyReviews = Array.from({ length: 12 }, (_, i) => ({
    ...makeFakeReview(),
    id: `review-${i}`,
    date: '2023-06-01T12:00:00Z'
  }));

  const state = {
    [NameSpace.Reviews]: {
      reviews: [mockReviewOld, mockReviewNew, ...manyReviews],
      status: RequestStatus.Success,
      sendingStatus: RequestStatus.Error,
      sendingError: 'Network Error',
    },
  } as unknown as State;

  it('should return all reviews from state', () => {
    const result = selectReviews(state);
    expect(result).toHaveLength(14);
  });

  it('should return review fetching status', () => {
    const result = selectReviewsStatus(state);
    expect(result).toBe(RequestStatus.Success);
  });

  it('should return comment sending status', () => {
    const result = selectSendingStatus(state);
    expect(result).toBe(RequestStatus.Error);
  });

  it('should return comment sending error message', () => {
    const result = selectSendingError(state);
    expect(result).toBe('Network Error');
  });

  describe('selectSortedReviews', () => {
    it('should sort reviews by date (newest first)', () => {
      const sortState = {
        [NameSpace.Reviews]: {
          reviews: [mockReviewOld, mockReviewNew],
          status: RequestStatus.Idle,
        }
      } as unknown as State;

      const result = selectSortedReviews(sortState);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('new');
      expect(result[1].id).toBe('old');
    });

    it('should limit the number of reviews to 10', () => {
      const result = selectSortedReviews(state);

      expect(result).toHaveLength(10);
    });
  });
});
