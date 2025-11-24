import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, SortOptions } from '../../const';
import { RootState } from '../index';

type SortOption = typeof SortOptions[keyof typeof SortOptions];

export const selectCity = (state: RootState) => state[NameSpace.Offers].city;
export const selectOffers = (state: RootState) => state[NameSpace.Offers].offers;
export const selectIsOffersDataLoading = (state: RootState) => state[NameSpace.Offers].isOffersDataLoading;
export const selectError = (state: RootState) => state[NameSpace.Offers].error;

export const selectCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const selectSortedOffers = createSelector(
  [selectCityOffers, (_state: RootState, sortType: SortOption) => sortType],
  (cityOffers, sortType) => {
    switch (sortType) {
      case SortOptions.PRICE_LOW_TO_HIGH:
        return cityOffers.toSorted((a, b) => a.price - b.price);
      case SortOptions.PRICE_HIGH_TO_LOW:
        return cityOffers.toSorted((a, b) => b.price - a.price);
      case SortOptions.TOP_RATED_FIRST:
        return cityOffers.toSorted((a, b) => b.rating - a.rating);
      default:
        return cityOffers;
    }
  }
);
