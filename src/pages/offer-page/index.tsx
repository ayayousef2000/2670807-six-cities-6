import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchOfferAction, fetchReviewsAction, fetchNearbyAction } from '../../store/api-actions';
import { dropOffer } from '../../store/offer-slice';
import { AuthorizationStatus } from '../../const';
import CommentForm from '../../components/comment-form';
import Map from '../../components/map';
import OfferList from '../../components/offer-list';
import ReviewsList from '../../components/reviews-list';
import NotFoundPage from '../not-found-page';
import Spinner from '../../components/spinner';
import { getRatingWidth } from '../../utils';
import './offer-page.css';

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const {
    offer,
    reviews,
    nearbyOffers,
    isOfferLoading,
    hasError,
  } = useSelector((state: RootState) => state.offer);

  const authorizationStatus = useSelector(
    (state: RootState) => state.user.authorizationStatus
  );

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      dispatch(fetchOfferAction(id));
      dispatch(fetchReviewsAction(id));
      dispatch(fetchNearbyAction(id));
    }

    return () => {
      dispatch(dropOffer());
    };
  }, [id, dispatch]);

  const { nearbyOffersToRender, mapPoints } = useMemo(() => {
    if (!offer) {
      return { nearbyOffersToRender: [], mapPoints: [] };
    }

    const nearby = nearbyOffers.slice(0, 3);
    const points = [...nearby.filter((o) => o.id !== offer.id), offer];

    return {
      nearbyOffersToRender: nearby,
      mapPoints: points
    };
  }, [offer, nearbyOffers]);

  if (isOfferLoading || (!offer && !hasError)) {
    return <Spinner />;
  }

  if (hasError || !offer) {
    return <NotFoundPage />;
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
    city
  } = offer;

  const ratingWidth = getRatingWidth(rating);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, 6).map((imageSrc) => (
                <div className="offer__image-wrapper" key={imageSrc}>
                  <img className="offer__image" src={imageSrc} alt={title} />
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
                <button
                  className={`offer__bookmark-button ${isFavorite ? 'offer__bookmark-button--active' : ''} button`}
                  type="button"
                >
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
                    <img
                      className="offer__avatar user__avatar"
                      src={host.avatarUrl}
                      width={74}
                      height={74}
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList reviews={reviews} />
                {isAuthorized && <CommentForm />}
              </section>
            </div>
          </div>
          <Map
            className="offer__map map"
            city={city}
            points={mapPoints}
            selectedPoint={offer}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OfferList offers={nearbyOffersToRender} variant="near-places" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
