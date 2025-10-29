import { Review as ReviewType } from '../../types/review';
import Review from '../review';

type ReviewsListProps = {
  reviews: ReviewType[];
};

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <li key={review.id}>
            <Review review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReviewsList;
