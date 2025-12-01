import { reviewsSlice, dropReviews, dropSendingStatus } from './reviews-slice';
import { fetchReviewsAction, postCommentAction } from './reviews-thunks';
import { RequestStatus } from '../../const';
import { makeFakeReview } from '../../utils/mocks';

describe('Reviews Slice', () => {
  const initialState = {
    reviews: [],
    status: RequestStatus.Idle,
    sendingStatus: RequestStatus.Idle,
    sendingError: null,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = reviewsSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = reviewsSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  describe('Reducers', () => {
    it('should reset state when dropReviews is dispatched', () => {
      const modifiedState = {
        reviews: [makeFakeReview()],
        status: RequestStatus.Success,
        sendingStatus: RequestStatus.Error,
        sendingError: 'Error',
      };

      const result = reviewsSlice.reducer(modifiedState, dropReviews());

      expect(result).toEqual(initialState);
    });

    it('should reset sending status and error when dropSendingStatus is dispatched', () => {
      const modifiedState = {
        reviews: [makeFakeReview()],
        status: RequestStatus.Success,
        sendingStatus: RequestStatus.Error,
        sendingError: 'Error',
      };

      const result = reviewsSlice.reducer(modifiedState, dropSendingStatus());

      expect(result.sendingStatus).toBe(RequestStatus.Idle);
      expect(result.sendingError).toBeNull();
      expect(result.reviews).toHaveLength(1);
    });
  });

  describe('fetchReviewsAction', () => {
    it('should set status to Loading when pending', () => {
      const result = reviewsSlice.reducer(
        initialState,
        fetchReviewsAction.pending('', '')
      );

      expect(result.status).toBe(RequestStatus.Loading);
    });

    it('should set status to Success and update reviews when fulfilled', () => {
      const mockReviews = [makeFakeReview(), makeFakeReview()];
      const result = reviewsSlice.reducer(
        initialState,
        fetchReviewsAction.fulfilled(mockReviews, '', '')
      );

      expect(result.status).toBe(RequestStatus.Success);
      expect(result.reviews).toEqual(mockReviews);
    });

    it('should set status to Error when rejected', () => {
      const result = reviewsSlice.reducer(
        initialState,
        fetchReviewsAction.rejected(null, '', '')
      );

      expect(result.status).toBe(RequestStatus.Error);
    });
  });

  describe('postCommentAction', () => {
    it('should set sendingStatus to Loading when pending', () => {
      const result = reviewsSlice.reducer(
        initialState,
        postCommentAction.pending('', { offerId: '1', comment: 'test', rating: 5 })
      );

      expect(result.sendingStatus).toBe(RequestStatus.Loading);
      expect(result.sendingError).toBeNull();
    });

    it('should set sendingStatus to Success and add new review when fulfilled', () => {
      const existingReview = makeFakeReview();
      const newReview = makeFakeReview();
      const currentState = {
        ...initialState,
        reviews: [existingReview],
      };

      const result = reviewsSlice.reducer(
        currentState,
        postCommentAction.fulfilled(newReview, '', { offerId: '1', comment: 'test', rating: 5 })
      );

      expect(result.sendingStatus).toBe(RequestStatus.Success);
      expect(result.reviews).toHaveLength(2);
      expect(result.reviews[1]).toEqual(newReview);
      expect(result.sendingError).toBeNull();
    });

    it('should set sendingStatus to Error and set error message when rejected', () => {
      const errorMessage = 'Validation Error';
      const result = reviewsSlice.reducer(
        initialState,
        postCommentAction.rejected(null, '', { offerId: '1', comment: 'test', rating: 5 }, errorMessage)
      );

      expect(result.sendingStatus).toBe(RequestStatus.Error);
      expect(result.sendingError).toBe(errorMessage);
    });

    it('should set default error message when rejected without payload', () => {
      const result = reviewsSlice.reducer(
        initialState,
        postCommentAction.rejected(null, '', { offerId: '1', comment: 'test', rating: 5 })
      );

      expect(result.sendingStatus).toBe(RequestStatus.Error);
      expect(result.sendingError).toBe('Failed to post comment.');
    });
  });
});
