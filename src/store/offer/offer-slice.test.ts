import { offerSlice, dropOffer } from './offer-slice';
import { fetchOfferAction } from './offer-thunks';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';

describe('Offer Slice', () => {
  const initialState = {
    offer: null,
    offerStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = offerSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = offerSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  it('should reset state when dropOffer is dispatched', () => {
    const modifiedState = {
      offer: makeFakeOffer(),
      offerStatus: RequestStatus.Success,
    };

    const result = offerSlice.reducer(modifiedState, dropOffer());

    expect(result).toEqual(initialState);
  });

  describe('fetchOfferAction', () => {
    it('should set offerStatus to Loading when pending', () => {
      const result = offerSlice.reducer(initialState, fetchOfferAction.pending('', ''));
      expect(result.offerStatus).toBe(RequestStatus.Loading);
    });

    it('should set offerStatus to Success and update offer when fulfilled', () => {
      const mockOffer = makeFakeOffer();
      const result = offerSlice.reducer(
        initialState,
        fetchOfferAction.fulfilled(mockOffer, '', '')
      );

      expect(result.offerStatus).toBe(RequestStatus.Success);
      expect(result.offer).toEqual(mockOffer);
    });

    it('should set offerStatus to NotFound when rejected with NOT_FOUND', () => {
      const result = offerSlice.reducer(
        initialState,
        fetchOfferAction.rejected(null, '', '', 'NOT_FOUND')
      );

      expect(result.offerStatus).toBe(RequestStatus.NotFound);
    });

    it('should set offerStatus to Error when rejected with generic error', () => {
      const result = offerSlice.reducer(
        initialState,
        fetchOfferAction.rejected(null, '', '', 'Some other error')
      );

      expect(result.offerStatus).toBe(RequestStatus.Error);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should update isFavorite when offer is present and ids match', () => {
      const currentOffer = makeFakeOffer(false);
      const stateWithOffer = {
        offer: currentOffer,
        offerStatus: RequestStatus.Success,
      };

      const updatedOffer = { ...currentOffer, isFavorite: true };

      const result = offerSlice.reducer(
        stateWithOffer,
        changeFavoriteStatusAction.fulfilled(updatedOffer, '', { offerId: currentOffer.id, status: 1 })
      );

      expect(result.offer?.isFavorite).toBe(true);
    });

    it('should not update isFavorite when offer ids do not match', () => {
      const currentOffer = makeFakeOffer(false);
      const stateWithOffer = {
        offer: currentOffer,
        offerStatus: RequestStatus.Success,
      };

      const otherOffer = makeFakeOffer(true);

      const result = offerSlice.reducer(
        stateWithOffer,
        changeFavoriteStatusAction.fulfilled(otherOffer, '', { offerId: otherOffer.id, status: 1 })
      );

      expect(result.offer?.isFavorite).toBe(false);
    });

    it('should not do anything if offer is null', () => {
      const result = offerSlice.reducer(
        initialState,
        changeFavoriteStatusAction.fulfilled(makeFakeOffer(true), '', { offerId: '1', status: 1 })
      );

      expect(result.offer).toBeNull();
    });
  });
});
