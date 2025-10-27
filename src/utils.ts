const MAX_RATING = 5;

export const getRatingWidth = (rating: number): string =>
  `${(rating / MAX_RATING) * 100}%`;
