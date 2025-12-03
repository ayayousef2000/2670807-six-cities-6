import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { fetchOffersAction } from './offers-thunks';
import { APIRoute } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

describe('Async actions: fetchOffersAction', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.fulfilled" when server response is 200', async () => {
    const mockOffers = [makeFakeOffer(), makeFakeOffer()];
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions();

    expect(actions[0].type).toBe(fetchOffersAction.pending.type);
    expect(actions[1].type).toBe(fetchOffersAction.fulfilled.type);

    const fulfilledAction = actions[1] as PayloadAction<Offer[]>;
    expect(fulfilledAction.payload).toEqual(mockOffers);
  });

  it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.rejected" when server response is 400', async () => {
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions();

    expect(actions[0].type).toBe(fetchOffersAction.pending.type);
    expect(actions[1].type).toBe(fetchOffersAction.rejected.type);

    const rejectedAction = actions[1] as PayloadAction<string>;
    expect(rejectedAction.payload).toBe('Failed to load offers.');
  });
});
