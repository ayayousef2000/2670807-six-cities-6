import { Review as ReviewType } from '../../types/review';
import { getRatingWidth } from '../../utils';

type ReviewProps = {
  review: ReviewType;
};

function formatUserName(name: string): string {
  return name
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function Review({ review }: ReviewProps): JSX.Element {
  const { user, rating, comment, date } = review;
  const { name, avatarUrl } = user;

  const displayName = formatUserName(name);

  const reviewDate = new Date(date);
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={avatarUrl}
            width={54}
            height={54}
            alt={displayName}
          />
        </div>
        <span className="reviews__user-name">{displayName}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: getRatingWidth(rating) }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime={date}>
          {formattedDate}
        </time>
      </div>
    </div>
  );
}

export default Review;
