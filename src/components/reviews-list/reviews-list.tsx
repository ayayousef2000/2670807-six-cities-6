import { memo } from 'react';
import { Review as ReviewType } from '../../types/review';
import Review from '../review';

type ReviewsListProps = {
  reviews: ReviewType[];
};

function ReviewsListComponent({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => (
        <li key={review.id}>
          <Review review={review} />
        </li>
      ))}
    </ul>
  );
}

const ReviewsList = memo(ReviewsListComponent);
export default ReviewsList;
