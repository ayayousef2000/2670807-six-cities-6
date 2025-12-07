import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { fetchFavoritesAction, changeFavoriteStatusAction } from './favorites-thunks';
import { APIRoute } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

describe('Async actions: Favorites', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  describe('fetchFavoritesAction', () => {
    it('should dispatch "fetchFavoritesAction.pending" and "fetchFavoritesAction.fulfilled" when server response is 200', async () => {
      const mockOffers = [makeFakeOffer(), makeFakeOffer()];
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, mockOffers);

      await store.dispatch(fetchFavoritesAction());

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchFavoritesAction.pending.type);
      expect(actions[1].type).toBe(fetchFavoritesAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<Offer[]>;
      expect(fulfilledAction.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchFavoritesAction.pending" and "fetchFavoritesAction.rejected" when server response is 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);

      await store.dispatch(fetchFavoritesAction());

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchFavoritesAction.pending.type);
      expect(actions[1].type).toBe(fetchFavoritesAction.rejected.type);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.fulfilled" when server response is 200', async () => {
      const mockOffer = makeFakeOffer();
      const statusData = { offerId: mockOffer.id, status: 1 };

      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${statusData.offerId}/${statusData.status}`)
        .reply(200, mockOffer);

      await store.dispatch(changeFavoriteStatusAction(statusData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(changeFavoriteStatusAction.pending.type);
      expect(actions[1].type).toBe(changeFavoriteStatusAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<Offer>;
      expect(fulfilledAction.payload).toEqual(mockOffer);
    });

    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.rejected" with "UNAUTHORIZED" when server response is 401', async () => {
      const statusData = { offerId: '1', status: 1 };

      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${statusData.offerId}/${statusData.status}`)
        .reply(401);

      await store.dispatch(changeFavoriteStatusAction(statusData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(changeFavoriteStatusAction.pending.type);
      expect(actions[1].type).toBe(changeFavoriteStatusAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe('UNAUTHORIZED');
    });

    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.rejected" with error message when server response is 400', async () => {
      const statusData = { offerId: '1', status: 1 };
      const errorMessage = 'Something went wrong';

      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${statusData.offerId}/${statusData.status}`)
        .reply(400, { message: errorMessage });

      await store.dispatch(changeFavoriteStatusAction(statusData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(changeFavoriteStatusAction.pending.type);
      expect(actions[1].type).toBe(changeFavoriteStatusAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe(errorMessage);
    });
  });
});
