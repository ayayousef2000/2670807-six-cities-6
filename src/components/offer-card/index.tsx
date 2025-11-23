import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { getRatingWidth } from '../../utils';
import { AppRoute } from '../../app/routes';
import { useFavoriteAction } from '../../hooks/use-favorites';

type CardVariant = 'cities' | 'near-places' | 'favorites';

type OfferCardProps = {
  offer: Offer;
  variant?: CardVariant;
  priority?: boolean;
  onMouseEnter?: (offerId: string) => void;
  onMouseLeave?: () => void;
};

const cardSizeMap: Record<CardVariant, { width: string; height: string }> = {
  cities: { width: '260', height: '200' },
  'near-places': { width: '260', height: '200' },
  favorites: { width: '150', height: '110' },
};

function OfferCardComponent({
  offer,
  variant = 'cities',
  priority = false,
  onMouseEnter,
  onMouseLeave
}: OfferCardProps): JSX.Element {
  const {
    id,
    isPremium,
    isFavorite,
    previewImage,
    price,
    rating,
    title,
    type,
  } = offer;

  const { handleFavoriteClick, isFavoriteSubmitting } = useFavoriteAction(id, isFavorite);

  const ratingWidth = getRatingWidth(rating);
  const offerLink = AppRoute.Offer.replace(':id', id);
  const { width, height } = cardSizeMap[variant];

  const handleMouseEnter = () => {
    onMouseEnter?.(id);
  };

  const handleMouseLeave = () => {
    onMouseLeave?.();
  };

  return (
    <article
      className={`${variant}__card place-card`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={`${variant}__image-wrapper place-card__image-wrapper`}>
        <Link to={offerLink}>
          <img
            className="place-card__image"
            src={previewImage}
            width={width}
            height={height}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>
      </div>
      <div className={`${variant}__card-info place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${isFavorite ? 'place-card__bookmark-button--active' : ''} button`}
            type="button"
            onClick={handleFavoriteClick}
            disabled={isFavoriteSubmitting}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerLink}>
            {title}
          </Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

const OfferCard = memo(OfferCardComponent);
export default OfferCard;
