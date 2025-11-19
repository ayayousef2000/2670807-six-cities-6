import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchOfferAction, fetchReviewsAction, fetchNearbyAction } from '../../store/api-actions';
import { dropOffer } from '../../store/offer-slice';
import {
  selectOffer,
  selectOfferStatus,
  selectSortedReviews,
  selectNearbyOffersToRender,
  selectOfferPageMapPoints
} from '../../store/offer-selectors';
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

  const offer = useSelector(selectOffer);
  const status = useSelector(selectOfferStatus);
  const reviews = useSelector(selectSortedReviews);
  const nearbyOffers = useSelector(selectNearbyOffersToRender);
  const mapPoints = useSelector(selectOfferPageMapPoints);

  const authorizationStatus = useSelector(
    (state: RootState) => state.user.authorizationStatus
  );

  const loadData = useCallback(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchReviewsAction(id));
      dispatch(fetchNearbyAction(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();

    return () => {
      dispatch(dropOffer());
    };
  }, [loadData, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <div className="container" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  if (status === 'notFound') {
    return <NotFoundPage />;
  }

  if (status === 'error' || !offer) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <div className="container">
            <section className="offer__no-data">
              <b className="cities__status">Failed to load data</b>
              <p className="cities__status-description">
                  Please check your internet connection or try again later.
              </p>
              <button
                className="button form__submit"
                style={{marginTop: '20px'}}
                onClick={loadData}
              >
                  Try Again
              </button>
            </section>
          </div>
        </main>
      </div>
    );
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
            <OfferList offers={nearbyOffers} variant="near-places" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
