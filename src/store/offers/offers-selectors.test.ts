import { describe, it, expect } from 'vitest';
import { NameSpace, RequestStatus, SortOption } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import {
  selectCity,
  selectOffers,
  selectOffersError,
  selectIsOffersDataLoading,
  selectCityOffers,
  selectSortedOffers
} from './offers-selectors';
import { State } from '../../types/state';

describe('Offers Selectors', () => {
  const cityParis = { ...makeFakeOffer().city, name: 'Paris' };
  const cityBerlin = { ...makeFakeOffer().city, name: 'Berlin' };

  const offerParisLowPrice = {
    ...makeFakeOffer(),
    id: '1',
    city: cityParis,
    price: 100,
    rating: 3.0
  };
  const offerParisHighPrice = {
    ...makeFakeOffer(),
    id: '2',
    city: cityParis,
    price: 500,
    rating: 5.0
  };
  const offerParisMediumPrice = {
    ...makeFakeOffer(),
    id: '3',
    city: cityParis,
    price: 300,
    rating: 4.0
  };
  const offerBerlin = {
    ...makeFakeOffer(),
    id: '4',
    city: cityBerlin
  };

  const state = {
    [NameSpace.Offers]: {
      city: 'Paris',
      offers: [offerParisMediumPrice, offerBerlin, offerParisLowPrice, offerParisHighPrice],
      requestStatus: RequestStatus.Loading,
      error: 'Network Error',
    },
  } as unknown as State;

  it('should return the current city', () => {
    const result = selectCity(state);
    expect(result).toBe('Paris');
  });

  it('should return all offers', () => {
    const result = selectOffers(state);
    expect(result).toHaveLength(4);
  });

  it('should return the error message', () => {
    const result = selectOffersError(state);
    expect(result).toBe('Network Error');
  });

  it('should compute "isLoading" based on requestStatus', () => {
    const result = selectIsOffersDataLoading(state);
    expect(result).toBe(true);
  });

  describe('selectCityOffers (Filtering)', () => {
    it('should return only offers belonging to the current city', () => {
      const result = selectCityOffers(state);

      expect(result).toHaveLength(3);
      expect(result.every((offer) => offer.city.name === 'Paris')).toBe(true);
      expect(result.find((offer) => offer.city.name === 'Berlin')).toBeUndefined();
    });
  });

  describe('selectSortedOffers (Sorting)', () => {

    it('should return offers sorted by Price: Low to High', () => {
      const result = selectSortedOffers(state, SortOption.PriceLowToHigh);

      expect(result[0].id).toBe(offerParisLowPrice.id);
      expect(result[1].id).toBe(offerParisMediumPrice.id);
      expect(result[2].id).toBe(offerParisHighPrice.id);
    });

    it('should return offers sorted by Price: High to Low', () => {
      const result = selectSortedOffers(state, SortOption.PriceHighToLow);

      expect(result[0].id).toBe(offerParisHighPrice.id);
      expect(result[1].id).toBe(offerParisMediumPrice.id);
      expect(result[2].id).toBe(offerParisLowPrice.id);
    });

    it('should return offers sorted by Rating: High to Low', () => {
      const result = selectSortedOffers(state, SortOption.TopRatedFirst);

      expect(result[0].id).toBe(offerParisHighPrice.id);
      expect(result[1].id).toBe(offerParisMediumPrice.id);
      expect(result[2].id).toBe(offerParisLowPrice.id);
    });

    it('should return offers in original order for "Popular" option', () => {
      const result = selectSortedOffers(state, SortOption.Popular);

      expect(result[0].id).toBe(offerParisMediumPrice.id);
      expect(result[1].id).toBe(offerParisLowPrice.id);
      expect(result[2].id).toBe(offerParisHighPrice.id);
    });
  });
});
