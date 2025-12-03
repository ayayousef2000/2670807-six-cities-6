import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { fetchOfferAction } from './offer-thunks';
import { APIRoute } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

describe('Async actions: fetchOfferAction', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.fulfilled" when server response is 200', async () => {
    const mockOffer = makeFakeOffer();
    const offerId = mockOffer.id;
    mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, mockOffer);

    await store.dispatch(fetchOfferAction(offerId));

    const actions = store.getActions();

    expect(actions[0].type).toBe(fetchOfferAction.pending.type);
    expect(actions[1].type).toBe(fetchOfferAction.fulfilled.type);

    const fulfilledAction = actions[1] as PayloadAction<Offer>;
    expect(fulfilledAction.payload).toEqual(mockOffer);
  });

  it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.rejected" when server response is 400', async () => {
    const offerId = 'invalid-id';
    mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(400);

    await store.dispatch(fetchOfferAction(offerId));

    const actions = store.getActions();

    expect(actions[0].type).toBe(fetchOfferAction.pending.type);
    expect(actions[1].type).toBe(fetchOfferAction.rejected.type);

    const rejectedAction = actions[1] as PayloadAction<string>;
    expect(rejectedAction.payload).toBe('Failed to fetch offer');
  });

  it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.rejected" with "NOT_FOUND" payload when server response is 404', async () => {
    const offerId = 'non-existent-id';
    mockAxiosAdapter.onGet(`${APIRoute.Offers}/${offerId}`).reply(404);

    await store.dispatch(fetchOfferAction(offerId));

    const actions = store.getActions();

    expect(actions[0].type).toBe(fetchOfferAction.pending.type);
    expect(actions[1].type).toBe(fetchOfferAction.rejected.type);

    const rejectedAction = actions[1] as PayloadAction<string>;
    expect(rejectedAction.payload).toBe('NOT_FOUND');
  });
});
