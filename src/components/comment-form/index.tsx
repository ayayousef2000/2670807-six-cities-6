import { useState, ChangeEvent, FormEvent, useEffect, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  postCommentAction,
  dropSendingStatus,
  selectSendingStatus,
  selectSendingError
} from '../../store/reviews';
import { RequestStatus } from '../../const';
import './comment-form.css';

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;
const RATING_STARS = [5, 4, 3, 2, 1];

const RATING_MAP: Record<number, string> = {
  5: 'perfect',
  4: 'good',
  3: 'not bad',
  2: 'badly',
  1: 'terribly'
};

interface StarInputProps {
  star: number;
  checked: boolean;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const StarInput = memo(({ star, checked, disabled, onChange }: StarInputProps) => (
  <>
    <input
      className="form__rating-input visually-hidden"
      name="rating"
      value={star}
      id={`${star}-stars`}
      type="radio"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label
      htmlFor={`${star}-stars`}
      className="reviews__rating-label form__rating-label"
      title={RATING_MAP[star]}
    >
      <svg className="form__star-image" width="37" height="33">
        <use xlinkHref="#icon-star"></use>
      </svg>
    </label>
  </>
));

StarInput.displayName = 'StarInput';

function CommentFormComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const sendingStatus = useAppSelector(selectSendingStatus);
  const sendingError = useAppSelector(selectSendingError);

  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
  });

  const isSubmitting = sendingStatus === RequestStatus.Loading;
  const isSuccess = sendingStatus === RequestStatus.Success;
  const isError = sendingStatus === RequestStatus.Error;

  useEffect(() => {
    if (isSuccess) {
      setFormData({ rating: 0, review: '' });
      dispatch(dropSendingStatus());
    }
  }, [isSuccess, dispatch]);

  const handleFieldChange = useCallback((evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));

    if (isError) {
      dispatch(dropSendingStatus());
    }
  }, [isError, dispatch]);

  const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const isValid =
      formData.rating > 0 &&
      formData.review.length >= MIN_COMMENT_LENGTH &&
      formData.review.length <= MAX_COMMENT_LENGTH;

    if (id && isValid) {
      dispatch(postCommentAction({
        offerId: id,
        comment: formData.review,
        rating: formData.rating
      }));
    }
  }, [dispatch, id, formData]);

  const isValid =
    formData.rating > 0 &&
    formData.review.length >= MIN_COMMENT_LENGTH &&
    formData.review.length <= MAX_COMMENT_LENGTH;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {RATING_STARS.map((star) => (
          <StarInput
            key={star}
            star={star}
            checked={formData.rating === star}
            disabled={isSubmitting}
            onChange={handleFieldChange}
          />
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
        maxLength={MAX_COMMENT_LENGTH}
      />

      {isError && sendingError && (
        <div className="reviews__error">
          {sendingError}
        </div>
      )}

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{MIN_COMMENT_LENGTH} characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

const CommentForm = memo(CommentFormComponent);

export default CommentForm;
