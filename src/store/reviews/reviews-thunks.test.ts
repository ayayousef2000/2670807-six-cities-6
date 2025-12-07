import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { fetchReviewsAction, postCommentAction } from './reviews-thunks';
import { APIRoute } from '../../const';
import { makeFakeReview } from '../../utils/mocks';
import { Review } from '../../types/review';

describe('Async actions: Reviews', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  describe('fetchReviewsAction', () => {
    it('should dispatch "fetchReviewsAction.pending" and "fetchReviewsAction.fulfilled" when server response is 200', async () => {
      const mockReviews = [makeFakeReview(), makeFakeReview()];
      const offerId = '1';

      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${offerId}`)
        .reply(200, mockReviews);

      await store.dispatch(fetchReviewsAction(offerId));

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchReviewsAction.pending.type);
      expect(actions[1].type).toBe(fetchReviewsAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<Review[]>;
      expect(fulfilledAction.payload).toEqual(mockReviews);
    });

    it('should dispatch "fetchReviewsAction.pending" and "fetchReviewsAction.rejected" when server response is 404', async () => {
      const offerId = 'non-existent-id';

      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${offerId}`)
        .reply(404);

      await store.dispatch(fetchReviewsAction(offerId));

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchReviewsAction.pending.type);
      expect(actions[1].type).toBe(fetchReviewsAction.rejected.type);
    });
  });

  describe('postCommentAction', () => {
    it('should dispatch "postCommentAction.pending" and "postCommentAction.fulfilled" when server response is 201', async () => {
      const mockReview = makeFakeReview();
      const commentData = { offerId: '1', comment: 'Great place!', rating: 5 };

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${commentData.offerId}`)
        .reply(201, mockReview);

      await store.dispatch(postCommentAction(commentData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(postCommentAction.pending.type);
      expect(actions[1].type).toBe(postCommentAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<Review>;
      expect(fulfilledAction.payload).toEqual(mockReview);
    });

    it('should dispatch "postCommentAction.pending" and "postCommentAction.rejected" with "UNAUTHORIZED" when server response is 401', async () => {
      const commentData = { offerId: '1', comment: 'Great place!', rating: 5 };

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${commentData.offerId}`)
        .reply(401);

      await store.dispatch(postCommentAction(commentData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(postCommentAction.pending.type);
      expect(actions[1].type).toBe(postCommentAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe('UNAUTHORIZED');
    });

    it('should dispatch "postCommentAction.pending" and "postCommentAction.rejected" with error message when server response is 400', async () => {
      const commentData = { offerId: '1', comment: 'Short', rating: 0 };
      const errorMessage = 'Validation failed';

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${commentData.offerId}`)
        .reply(400, { message: errorMessage });

      await store.dispatch(postCommentAction(commentData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(postCommentAction.pending.type);
      expect(actions[1].type).toBe(postCommentAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe(errorMessage);
    });
  });
});
