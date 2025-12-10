import { describe, it, expect } from 'vitest';
import { NameSpace, RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { selectFavorites, selectFavoritesRequestStatus, selectFavoritesError, selectFavoritesByCity } from './favorites-selectors';
import { State } from '../../types/state';

describe('Favorites Selectors', () => {
  const cityParis = { ...makeFakeOffer().city, name: 'Paris' };
  const cityCologne = { ...makeFakeOffer().city, name: 'Cologne' };

  const offer1 = { ...makeFakeOffer(), id: '1', city: cityParis, isFavorite: true };
  const offer2 = { ...makeFakeOffer(), id: '2', city: cityParis, isFavorite: true };
  const offer3 = { ...makeFakeOffer(), id: '3', city: cityCologne, isFavorite: true };

  const state = {
    [NameSpace.Favorites]: {
      favorites: [offer1, offer2, offer3],
      requestStatus: RequestStatus.Error,
    },
  } as unknown as State;

  it('should return the favorites list', () => {
    const result = selectFavorites(state);
    expect(result).toHaveLength(3);
    expect(result).toEqual([offer1, offer2, offer3]);
  });

  it('should return the request status', () => {
    const result = selectFavoritesRequestStatus(state);
    expect(result).toBe(RequestStatus.Error);
  });

  it('should return true if request status is Error', () => {
    const result = selectFavoritesError(state);
    expect(result).toBe(true);
  });

  describe('selectFavoritesByCity (Grouping)', () => {
    it('should group favorite offers by city name', () => {
      const result = selectFavoritesByCity(state);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['Paris']).toHaveLength(2);
      expect(result['Cologne']).toHaveLength(1);

      expect(result['Paris'][0].id).toBe('1');
      expect(result['Paris'][1].id).toBe('2');
      expect(result['Cologne'][0].id).toBe('3');
    });

    it('should return an empty object if there are no favorites', () => {
      const emptyState = {
        [NameSpace.Favorites]: {
          favorites: [],
          requestStatus: RequestStatus.Idle,
        },
      } as unknown as State;

      const result = selectFavoritesByCity(emptyState);
      expect(result).toEqual({});
    });
  });
});
