import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { State } from '../../types/state';
import { Offer } from '../../types/offer';
import { selectNearPlacesToRender } from '../near-places/near-places-selectors';

export const selectOffer = (state: State): Offer | null =>
  state[NameSpace.Offer].offer;

export const selectOfferStatus = (state: State): RequestStatus =>
  state[NameSpace.Offer].offerStatus;

export const selectOfferPageMapPoints = createSelector(
  [selectOffer, selectNearPlacesToRender],
  (currentOffer, nearPlaces): Offer[] => {
    if (!currentOffer) {
      return nearPlaces;
    }
    const isOfferInNearby = nearPlaces.some((o) => o.id === currentOffer.id);
    return isOfferInNearby ? nearPlaces : [...nearPlaces, currentOffer];
  }
);
