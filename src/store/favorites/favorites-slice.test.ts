import { favoritesSlice, clearFavorites } from './favorites-slice';
import { fetchFavoritesAction, changeFavoriteStatusAction } from './favorites-thunks';
import { RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';

describe('Favorites Slice', () => {
  const initialState = {
    favorites: [],
    requestStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = favoritesSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = favoritesSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  it('should clear favorites and reset status when "clearFavorites" is dispatched', () => {
    const filledState = {
      favorites: [makeFakeOffer(true), makeFakeOffer(true)],
      requestStatus: RequestStatus.Success,
    };

    const result = favoritesSlice.reducer(filledState, clearFavorites());

    expect(result.favorites).toEqual([]);
    expect(result.requestStatus).toBe(RequestStatus.Idle);
  });

  describe('fetchFavoritesAction', () => {
    it('should set requestStatus to "Loading" when pending', () => {
      const result = favoritesSlice.reducer(
        initialState,
        fetchFavoritesAction.pending('', undefined)
      );

      expect(result.requestStatus).toBe(RequestStatus.Loading);
    });

    it('should set requestStatus to "Success" and update favorites when fulfilled', () => {
      const mockOffers = [makeFakeOffer(true), makeFakeOffer(true)];
      const result = favoritesSlice.reducer(
        initialState,
        fetchFavoritesAction.fulfilled(mockOffers, '', undefined)
      );

      expect(result.requestStatus).toBe(RequestStatus.Success);
      expect(result.favorites).toEqual(mockOffers);
    });

    it('should set requestStatus to "Error" when rejected', () => {
      const result = favoritesSlice.reducer(
        initialState,
        fetchFavoritesAction.rejected(null, '', undefined)
      );

      expect(result.requestStatus).toBe(RequestStatus.Error);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should add offer to favorites if isFavorite is true', () => {
      const newFavorite = makeFakeOffer(true);
      const result = favoritesSlice.reducer(
        initialState,
        changeFavoriteStatusAction.fulfilled(newFavorite, '', { offerId: newFavorite.id, status: 1 })
      );

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toEqual(newFavorite);
    });

    it('should remove offer from favorites if isFavorite is false', () => {
      const existingOffer = makeFakeOffer(true);
      const existingState = {
        favorites: [existingOffer],
        requestStatus: RequestStatus.Success,
      };

      const updatedOffer = { ...existingOffer, isFavorite: false };

      const result = favoritesSlice.reducer(
        existingState,
        changeFavoriteStatusAction.fulfilled(updatedOffer, '', { offerId: existingOffer.id, status: 0 })
      );

      expect(result.favorites).toHaveLength(0);
    });

    it('should not modify favorites list if removing an ID that does not exist', () => {
      const existingOffer = makeFakeOffer(true);
      const existingState = {
        favorites: [existingOffer],
        requestStatus: RequestStatus.Success,
      };

      const nonExistentOffer = makeFakeOffer(false);

      const result = favoritesSlice.reducer(
        existingState,
        changeFavoriteStatusAction.fulfilled(nonExistentOffer, '', { offerId: nonExistentOffer.id, status: 0 })
      );

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toEqual(existingOffer);
    });
  });
});
