import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { RootState } from '../index';
import { Offer } from '../../types/offer';

const MAX_NEARBY_OFFERS = 3;
const MAX_REVIEWS = 10;

export const selectOffer = (state: RootState) => state[NameSpace.Offer].offer;
export const selectOfferStatus = (state: RootState) => state[NameSpace.Offer].offerStatus;

export const selectReviews = (state: RootState) => state[NameSpace.Offer].reviews;
export const selectReviewsStatus = (state: RootState) => state[NameSpace.Offer].reviewsStatus;

export const selectNearbyOffers = (state: RootState) => state[NameSpace.Offer].nearbyOffers;
export const selectNearbyStatus = (state: RootState) => state[NameSpace.Offer].nearbyStatus;

export const selectSendingStatus = (state: RootState) => state[NameSpace.Offer].sendingStatus;
export const selectSendingError = (state: RootState) => state[NameSpace.Offer].sendingError;

export const selectSortedReviews = createSelector(
  [selectReviews],
  (reviews) => [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_REVIEWS)
);

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
