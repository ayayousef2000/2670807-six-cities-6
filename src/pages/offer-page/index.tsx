import { Link, useParams, Navigate } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import CommentForm from '../../components/comment-form';
import { Offer } from '../../types/offer';

type OfferPageProps = {
  offers: Offer[];
}

function OfferPage({ offers }: OfferPageProps): JSX.Element {
  const { id } = useParams();
  const offerId = Number(id);

  const currentOffer = offers.find((offer) => offer.id === offerId);

  if (!currentOffer) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  const {
    images,
    isPremium,
    title,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    host,
    description,
  } = currentOffer;

  const ratingWidth = `${(rating / 5) * 100}%`;
  const nearPlaces = offers.filter((offer) => offer.id !== offerId).slice(0, 3);

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, 6).map((imageSrc) => (
                <div className="offer__image-wrapper" key={imageSrc}>
                  <img className="offer__image" src={`../${imageSrc}`} alt={title} />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <button className={`offer__bookmark-button ${isFavorite ? 'offer__bookmark-button--active' : ''} button`} type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{type}</li>
                <li className="offer__feature offer__feature--bedrooms">{bedrooms} Bedrooms</li>
                <li className="offer__feature offer__feature--adults">Max {maxAdults} adults</li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {goods.map((good) => (
                    <li className="offer__inside-item" key={good}>{good}</li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img className="offer__avatar user__avatar" src={`../${host.avatarUrl}`} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  {description.split('\n\n').map((paragraph) => <p className="offer__text" key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">1</span></h2>
                <ul className="reviews__list">
                </ul>
                <CommentForm />
              </section>
            </div>
          </div>
          <section className="offer__map map"></section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {nearPlaces.map((place) => {
                const placeRatingWidth = `${(place.rating / 5) * 100}%`;
                return (
                  <article className="near-places__card place-card" key={place.id}>
                    {place.isPremium && <div className="place-card__mark"><span>Premium</span></div>}
                    <div className="near-places__image-wrapper place-card__image-wrapper">
                      <Link to={`/offer/${place.id}`}>
                        <img className="place-card__image" src={`../${place.images[0]}`} width="260" height="200" alt={place.title} />
                      </Link>
                    </div>
                    <div className="place-card__info">
                      <div className="place-card__price-wrapper">
                        <div className="place-card__price">
                          <b className="place-card__price-value">&euro;{place.price}</b>
                          <span className="place-card__price-text">&#47;&nbsp;night</span>
                        </div>
                        <button className={`place-card__bookmark-button ${place.isFavorite ? 'place-card__bookmark-button--active' : ''} button`} type="button">
                          <svg className="place-card__bookmark-icon" width="18" height="19">
                            <use xlinkHref="#icon-bookmark"></use>
                          </svg>
                          <span className="visually-hidden">To bookmarks</span>
                        </button>
                      </div>
                      <div className="place-card__rating rating">
                        <div className="place-card__stars rating__stars">
                          <span style={{ width: placeRatingWidth }}></span>
                          <span className="visually-hidden">Rating</span>
                        </div>
                      </div>
                      <h2 className="place-card__name">
                        <Link to={`/offer/${place.id}`}>{place.title}</Link>
                      </h2>
                      <p className="place-card__type">{place.type}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
