import { createSelector } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { NameSpace } from '../../const';
import { Offer } from '../../types/offer';

export const getFavorites = (state: State): Offer[] => state[NameSpace.Favorites].favorites;
export const getFavoritesLoadingStatus = (state: State): boolean => state[NameSpace.Favorites].isFavoritesLoading;
export const getFavoritesErrorStatus = (state: State): boolean => state[NameSpace.Favorites].hasError;

export const selectFavoritesByCity = createSelector(
  [getFavorites],
  (favorites) => favorites.reduce<Record<string, Offer[]>>((acc, offer) => {
    const city = offer.city.name;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(offer);
    return acc;
  }, {})
);
