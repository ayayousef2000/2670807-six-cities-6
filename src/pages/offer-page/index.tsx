import { useEffect, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchOfferAction, fetchReviewsAction, fetchNearbyAction } from '../../store/api-actions';
import { dropOffer } from '../../store/offer-slice';
import {
  selectOffer,
  selectOfferStatus,
  selectSortedReviews,
  selectReviewsStatus,
  selectNearbyOffersToRender,
  selectNearbyStatus,
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
import { Host } from '../../types/offer';
import './offer-page.css';

const OfferGallery = memo(({ images, title }: { images: string[]; title: string }) => (
  <div className="offer__gallery-container container">
    <div className="offer__gallery">
      {images.slice(0, 6).map((imageSrc) => (
        <div className="offer__image-wrapper" key={imageSrc}>
          <img className="offer__image" src={imageSrc} alt={title} />
        </div>
      ))}
    </div>
  </div>
));
OfferGallery.displayName = 'OfferGallery';

const OfferFeatures = memo(({ type, bedrooms, maxAdults }: { type: string; bedrooms: number; maxAdults: number }) => (
  <ul className="offer__features">
    <li className="offer__feature offer__feature--entire">{type}</li>
    <li className="offer__feature offer__feature--bedrooms">{bedrooms} Bedrooms</li>
    <li className="offer__feature offer__feature--adults">Max {maxAdults} adults</li>
  </ul>
));
OfferFeatures.displayName = 'OfferFeatures';

const OfferInside = memo(({ goods }: { goods: string[] }) => (
  <div className="offer__inside">
    <h2 className="offer__inside-title">What&apos;s inside</h2>
    <ul className="offer__inside-list">
      {goods.map((good) => (
        <li className="offer__inside-item" key={good}>{good}</li>
      ))}
    </ul>
  </div>
));
OfferInside.displayName = 'OfferInside';

const OfferHost = memo(({ host, description }: { host: Host; description: string }) => (
  <div className="offer__host">
    <h2 className="offer__host-title">Meet the host</h2>
    <div className="offer__host-user user">
      <div className={`offer__avatar-wrapper ${host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
        <img className="offer__avatar user__avatar" src={host.avatarUrl} width={74} height={74} alt="Host avatar" />
      </div>
      <span className="offer__user-name">{host.name}</span>
      {host.isPro && <span className="offer__user-status">Pro</span>}
    </div>
    <div className="offer__description">
      <p className="offer__text">{description}</p>
    </div>
  </div>
));
OfferHost.displayName = 'OfferHost';

const MapMemo = memo(Map);
const ReviewsListMemo = memo(ReviewsList);
const OfferListMemo = memo(OfferList);

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const offer = useSelector(selectOffer);
  const offerStatus = useSelector(selectOfferStatus);
  const reviews = useSelector(selectSortedReviews);
  const reviewsStatus = useSelector(selectReviewsStatus);
  const nearbyOffers = useSelector(selectNearbyOffersToRender);
  const nearbyStatus = useSelector(selectNearbyStatus);
  const mapPoints = useSelector(selectOfferPageMapPoints);

  const authorizationStatus = useSelector((state: RootState) => state.user.authorizationStatus);
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

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

  if (offerStatus === 'loading' || offerStatus === 'idle') {
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

  if (offerStatus === 'notFound') {
    return <NotFoundPage />;
  }

  if (offerStatus === 'error' || !offer) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <div className="container">
            <section className="offer__no-data">
              <b className="cities__status">Failed to load data</b>
              <p className="cities__status-description">
                  Please check your internet connection or try again later.
              </p>
              <button className="button form__submit" style={{marginTop: '20px'}} onClick={loadData}>
                  Try Again
              </button>
            </section>
          </div>
        </main>
      </div>
    );
  }

  const { images, isPremium, title, isFavorite, rating, type, bedrooms, maxAdults, price, goods, host, description, city } = offer;
  const ratingWidth = getRatingWidth(rating);

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <OfferGallery images={images} title={title} />

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

              <OfferFeatures type={type} bedrooms={bedrooms} maxAdults={maxAdults} />

              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <OfferInside goods={goods} />

              <OfferHost host={host} description={description} />

              <section className="offer__reviews reviews">

                {reviewsStatus === 'error' ? (
                  <div className="reviews__error">Failed to load reviews</div>
                ) : (
                  <ReviewsListMemo reviews={reviews} />
                )}

                {isAuthorized && <CommentForm />}
              </section>
            </div>
          </div>

          <MapMemo
            className="offer__map map"
            city={city}
            points={mapPoints}
            selectedPoint={offer}
          />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            {nearbyStatus === 'error' ? (
              <div className="near-places__error">Failed to load nearby places</div>
            ) : (
              <OfferListMemo offers={nearbyOffers} variant="near-places" />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
