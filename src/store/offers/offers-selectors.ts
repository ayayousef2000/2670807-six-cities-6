import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus, SortOption } from '../../const';
import { State } from '../../types/state';
import { Offer } from '../../types/offer';

type SortOptionValue = typeof SortOption[keyof typeof SortOption];

export const selectCity = (state: State): string => state[NameSpace.Offers].city;

export const selectOffers = (state: State): Offer[] => state[NameSpace.Offers].offers;

export const selectOffersRequestStatus = (state: State): RequestStatus =>
  state[NameSpace.Offers].requestStatus;

export const selectOffersError = (state: State): string | null =>
  state[NameSpace.Offers].error;

export const selectIsOffersDataLoading = createSelector(
  [selectOffersRequestStatus],
  (requestStatus) => requestStatus === RequestStatus.Loading
);

export const selectCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const selectSortedOffers = createSelector(
  [selectCityOffers, (_state: State, sortType: SortOptionValue) => sortType],
  (cityOffers, sortType) => {
    switch (sortType) {
      case SortOption.PriceLowToHigh:
        return cityOffers.toSorted((a: Offer, b: Offer) => a.price - b.price);
      case SortOption.PriceHighToLow:
        return cityOffers.toSorted((a: Offer, b: Offer) => b.price - a.price);
      case SortOption.TopRatedFirst:
        return cityOffers.toSorted((a: Offer, b: Offer) => b.rating - a.rating);
      default:
        return cityOffers;
    }
  }
);
