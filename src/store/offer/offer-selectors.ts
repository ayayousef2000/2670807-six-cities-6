import { createSelector } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const';
import { State } from '../../types/state';
import { Offer } from '../../types/offer';

const MAX_NEARBY_OFFERS = 3;

export const selectOffer = (state: State): Offer | null =>
  state[NameSpace.Offer].offer;

export const selectOfferStatus = (state: State): RequestStatus =>
  state[NameSpace.Offer].offerStatus;

export const selectNearbyOffers = (state: State): Offer[] =>
  state[NameSpace.Offer].nearbyOffers;

export const selectNearbyStatus = (state: State): RequestStatus =>
  state[NameSpace.Offer].nearbyStatus;

export const selectNearbyOffersToRender = createSelector(
  [selectNearbyOffers],
  (nearbyOffers) => nearbyOffers.slice(0, MAX_NEARBY_OFFERS)
);

export const selectOfferPageMapPoints = createSelector(
  [selectOffer, selectNearbyOffersToRender],
  (currentOffer, nearbyOffers): Offer[] => {
    if (!currentOffer) {
      return nearbyOffers;
    }
    const isOfferInNearby = nearbyOffers.some((o) => o.id === currentOffer.id);
    return isOfferInNearby ? nearbyOffers : [...nearbyOffers, currentOffer];
  }
);
