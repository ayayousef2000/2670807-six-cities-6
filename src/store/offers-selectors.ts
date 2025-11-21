import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { SortOptions } from '../const';

type SortOption = typeof SortOptions[keyof typeof SortOptions];

export const selectCity = (state: RootState) => state.offers.city;
export const selectOffers = (state: RootState) => state.offers.offers;
export const selectIsOffersDataLoading = (state: RootState) => state.offers.isOffersDataLoading;
export const selectError = (state: RootState) => state.offers.error;

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

export const selectErrorMessage = createSelector(
  [selectError],
  (error) => {
    if (!error) {
      return '';
    }
    if (error.includes('404')) {
      return 'The offers data could not be found. The server might be down or configured incorrectly.';
    }
    if (error.includes('timeout') || error.includes('Network') || error.includes('500')) {
      return 'The server is not responding. Please check your internet connection.';
    }
    return 'An unexpected error occurred. Please try again later.';
  }
);
