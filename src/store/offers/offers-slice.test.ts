import { offersSlice, setCity } from './offers-slice';
import { fetchOffersAction } from './offers-thunks';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { DEFAULT_CITY, RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';

describe('Offers Slice', () => {
  const initialState = {
    city: DEFAULT_CITY,
    offers: [],
    requestStatus: RequestStatus.Idle,
    error: null,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = offersSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = offersSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  describe('Reducers', () => {
    it('should update city when setCity is dispatched', () => {
      const newCity = 'Amsterdam';
      const result = offersSlice.reducer(initialState, setCity(newCity));
      expect(result.city).toBe(newCity);
    });
  });

  describe('fetchOffersAction', () => {
    it('should set requestStatus to "Loading" and clear error when pending', () => {
      const errorState = { ...initialState, error: 'Previous Error' };
      const result = offersSlice.reducer(errorState, fetchOffersAction.pending('', undefined));

      expect(result.requestStatus).toBe(RequestStatus.Loading);
      expect(result.error).toBeNull();
    });

    it('should set requestStatus to "Success" and update offers when fulfilled', () => {
      const mockOffers = [makeFakeOffer(), makeFakeOffer()];
      const result = offersSlice.reducer(
        initialState,
        fetchOffersAction.fulfilled(mockOffers, '', undefined)
      );

      expect(result.requestStatus).toBe(RequestStatus.Success);
      expect(result.offers).toEqual(mockOffers);
    });

    it('should set requestStatus to "Error" and update error message when rejected', () => {
      const errorMessage = 'Failed to load offers';
      const result = offersSlice.reducer(
        initialState,
        fetchOffersAction.rejected(null, '', undefined, errorMessage)
      );

      expect(result.requestStatus).toBe(RequestStatus.Error);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('changeFavoriteStatusAction (cross-slice interaction)', () => {
    it('should update isFavorite status for the specific offer when fulfilled', () => {
      const offer1 = makeFakeOffer(false);
      const offer2 = makeFakeOffer(true);
      const startState = {
        ...initialState,
        offers: [offer1, offer2],
      };

      const updatedOffer = { ...offer1, isFavorite: true };

      const result = offersSlice.reducer(
        startState,
        changeFavoriteStatusAction.fulfilled(
          updatedOffer,
          '',
          { offerId: offer1.id, status: 1 }
        )
      );

      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(true);
    });

    it('should not modify offers if the updated offer id is not found', () => {
      const offer = makeFakeOffer(false);
      const startState = {
        ...initialState,
        offers: [offer],
      };

      const nonExistentOffer = makeFakeOffer(true);

      const result = offersSlice.reducer(
        startState,
        changeFavoriteStatusAction.fulfilled(
          nonExistentOffer,
          '',
          { offerId: nonExistentOffer.id, status: 1 }
        )
      );

      expect(result.offers).toEqual(startState.offers);
    });
  });
});
