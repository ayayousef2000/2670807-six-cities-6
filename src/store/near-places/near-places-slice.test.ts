import { nearPlacesSlice, dropNearPlaces } from './near-places-slice';
import { fetchNearPlacesAction } from './near-places-thunks';
import { changeFavoriteStatusAction } from '../favorites/favorites-thunks';
import { RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';

describe('NearPlaces Slice', () => {
  const initialState = {
    nearPlaces: [],
    nearPlacesStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = nearPlacesSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = nearPlacesSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  it('should reset state when dropNearPlaces is dispatched', () => {
    const modifiedState = {
      nearPlaces: [makeFakeOffer()],
      nearPlacesStatus: RequestStatus.Success,
    };

    const result = nearPlacesSlice.reducer(modifiedState, dropNearPlaces());

    expect(result).toEqual(initialState);
  });

  describe('fetchNearPlacesAction', () => {
    it('should set nearPlacesStatus to Loading when pending', () => {
      const result = nearPlacesSlice.reducer(
        initialState,
        fetchNearPlacesAction.pending('', '')
      );

      expect(result.nearPlacesStatus).toBe(RequestStatus.Loading);
    });

    it('should set nearPlacesStatus to Success and update nearPlaces when fulfilled', () => {
      const mockOffers = [makeFakeOffer(), makeFakeOffer()];
      const result = nearPlacesSlice.reducer(
        initialState,
        fetchNearPlacesAction.fulfilled(mockOffers, '', '')
      );

      expect(result.nearPlacesStatus).toBe(RequestStatus.Success);
      expect(result.nearPlaces).toEqual(mockOffers);
    });

    it('should set nearPlacesStatus to Error when rejected', () => {
      const result = nearPlacesSlice.reducer(
        initialState,
        fetchNearPlacesAction.rejected(null, '', '')
      );

      expect(result.nearPlacesStatus).toBe(RequestStatus.Error);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should update isFavorite when offer is present in nearPlaces', () => {
      const nearPlace = makeFakeOffer(false);
      const stateWithPlaces = {
        nearPlaces: [nearPlace],
        nearPlacesStatus: RequestStatus.Success,
      };

      const updatedOffer = { ...nearPlace, isFavorite: true };

      const result = nearPlacesSlice.reducer(
        stateWithPlaces,
        changeFavoriteStatusAction.fulfilled(updatedOffer, '', { offerId: nearPlace.id, status: 1 })
      );

      expect(result.nearPlaces[0].isFavorite).toBe(true);
    });

    it('should not update any place if ID does not match', () => {
      const nearPlace = makeFakeOffer(false);
      const stateWithPlaces = {
        nearPlaces: [nearPlace],
        nearPlacesStatus: RequestStatus.Success,
      };

      const otherOffer = makeFakeOffer(true);

      const result = nearPlacesSlice.reducer(
        stateWithPlaces,
        changeFavoriteStatusAction.fulfilled(otherOffer, '', { offerId: otherOffer.id, status: 1 })
      );

      expect(result.nearPlaces[0].isFavorite).toBe(false);
    });
  });
});
