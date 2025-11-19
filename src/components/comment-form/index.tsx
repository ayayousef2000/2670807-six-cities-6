import { useState, ChangeEvent, FormEvent, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { postCommentAction } from '../../store/api-actions';
import { resetSendingStatus } from '../../store/offer-slice';

const ratingMap = {
  5: 'perfect',
  4: 'good',
  3: 'not bad',
  2: 'badly',
  1: 'terribly'
};

function CommentForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const sendingStatus = useSelector((state: RootState) => state.offer.sendingStatus);

  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
  });

  const isSubmitting = sendingStatus === 'pending';
  const isValid =
    formData.rating > 0 &&
    formData.review.length >= 50 &&
    formData.review.length <= 300;

  useEffect(() => {
    if (sendingStatus === 'success') {
      setFormData({ rating: 0, review: '' });
      dispatch(resetSendingStatus());
    }
  }, [sendingStatus, dispatch]);

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: name === 'rating' ? Number(value) : value });
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (id && isValid) {
      dispatch(postCommentAction({
        offerId: id,
        comment: formData.review,
        rating: formData.rating
      }));
    }
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <Fragment key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              checked={formData.rating === star}
              onChange={handleFieldChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={ratingMap[star as keyof typeof ratingMap]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleFieldChange}
        disabled={isSubmitting}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
