import { Offer } from './types/offer';

const MAX_RATING = 5;
const NEAR_PLACES_COUNT = 3;

export const getRatingWidth = (rating: number): string =>
  `${(rating / MAX_RATING) * 100}%`;

export const getNearPlaces = (offers: Offer[], currentOfferId: number): Offer[] =>
  offers.filter((offer) => offer.id !== currentOfferId).slice(0, NEAR_PLACES_COUNT);
