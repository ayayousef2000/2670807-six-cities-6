import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { State } from '../../types/state';
import { Offer } from '../../types/offer';

const MAX_NEAR_PLACES_COUNT = 3;

export const selectNearPlaces = (state: State): Offer[] =>
  state[NameSpace.NearPlaces].nearPlaces;

export const selectNearPlacesStatus = (state: State): RequestStatus =>
  state[NameSpace.NearPlaces].nearPlacesStatus;

export const selectNearPlacesToRender = createSelector(
  [selectNearPlaces],
  (nearPlaces) => nearPlaces.slice(0, MAX_NEAR_PLACES_COUNT)
);
