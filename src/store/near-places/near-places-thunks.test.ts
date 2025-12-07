import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { fetchNearPlacesAction } from './near-places-thunks';
import { APIRoute } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

describe('Async actions: NearPlaces', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  describe('fetchNearPlacesAction', () => {
    it('should dispatch "fetchNearPlacesAction.pending" and "fetchNearPlacesAction.fulfilled" when server response is 200', async () => {
      const mockOffers = [makeFakeOffer(), makeFakeOffer()];
      const offerId = '1';

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}/nearby`)
        .reply(200, mockOffers);

      await store.dispatch(fetchNearPlacesAction(offerId));

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchNearPlacesAction.pending.type);
      expect(actions[1].type).toBe(fetchNearPlacesAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<Offer[]>;
      expect(fulfilledAction.payload).toEqual(mockOffers);
    });

    it('should dispatch "fetchNearPlacesAction.pending" and "fetchNearPlacesAction.rejected" when server response is 404', async () => {
      const offerId = 'non-existent-id';

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}/nearby`)
        .reply(404);

      await store.dispatch(fetchNearPlacesAction(offerId));

      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchNearPlacesAction.pending.type);
      expect(actions[1].type).toBe(fetchNearPlacesAction.rejected.type);
    });
  });
});
