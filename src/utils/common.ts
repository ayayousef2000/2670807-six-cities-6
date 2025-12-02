const MAX_RATING_STARS = 5;

export const getRatingWidth = (rating: number): string => {
  const roundedRating = Math.round(rating);
  return `${(roundedRating / MAX_RATING_STARS) * 100}%`;
};
