import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Offer } from '../types/offer';

const MAX_NEARBY_OFFERS = 3;
const MAX_REVIEWS = 10;

export const selectOffer = (state: RootState) => state.offer.offer;
export const selectOfferStatus = (state: RootState) => state.offer.offerStatus;

export const selectReviews = (state: RootState) => state.offer.reviews;
export const selectReviewsStatus = (state: RootState) => state.offer.reviewsStatus;

export const selectNearbyOffers = (state: RootState) => state.offer.nearbyOffers;
export const selectNearbyStatus = (state: RootState) => state.offer.nearbyStatus;

export const selectSendingStatus = (state: RootState) => state.offer.sendingStatus;
export const selectError = (state: RootState) => state.offer.error;

export const selectSortedReviews = createSelector(
  [selectReviews],
  (reviews) => [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_REVIEWS)
);

export const selectNearbyOffersToRender = createSelector(
  [selectNearbyOffers],
  (nearbyOffers) => (nearbyOffers || []).slice(0, MAX_NEARBY_OFFERS)
);

export const selectOfferPageMapPoints = createSelector(
  [selectOffer, selectNearbyOffersToRender],
  (currentOffer, nearbyOffers): Offer[] => {
    if (!currentOffer) {
      return nearbyOffers || [];
    }

    const safeNearbyOffers = nearbyOffers || [];
    const isOfferInNearby = safeNearbyOffers.some((o) => o.id === currentOffer.id);

    if (isOfferInNearby) {
      return safeNearbyOffers;
    }

    return [...safeNearbyOffers, currentOffer];
  }
);
