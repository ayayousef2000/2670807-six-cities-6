import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace, RequestStatus } from '../../const';
import { Offer } from '../../types/offer';

export const selectFavorites = (state: State): Offer[] =>
  state[NameSpace.Favorites].favorites;

export const selectFavoritesRequestStatus = (state: State): RequestStatus =>
  state[NameSpace.Favorites].requestStatus;

export const selectFavoritesError = (state: State): boolean =>
  state[NameSpace.Favorites].requestStatus === RequestStatus.Error;

export const selectFavoritesByCity = createSelector(
  [selectFavorites],
  (favorites) => favorites.reduce<Record<string, Offer[]>>((acc, offer) => {
    const city = offer.city.name;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(offer);
    return acc;
  }, {})
);
