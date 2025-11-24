import { useState, useCallback, useEffect, memo, useMemo } from 'react';
import OfferList from '../../components/offer-list';
import Map from '../../components/map';
import CitiesList from '../../components/cities-list';
import SortOptions from '../../components/sort-options';
import Spinner from '../../components/spinner';
import MainEmpty from '../../components/main-empty';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setCity } from '../../store/offers/offers-slice';
import { fetchOffersAction } from '../../store/offers/offers-thunks';
import {
  selectCity,
  selectCityOffers,
  selectSortedOffers,
  selectIsOffersDataLoading,
  selectOffersError
} from '../../store/offers/offers-selectors';
import { CITIES, SortOption as SortOptionsEnum } from '../../const';
import { Offer } from '../../types/offer';
import { State } from '../../types/state';
import './main-page.css';

type SortOptionValue = typeof SortOptionsEnum[keyof typeof SortOptionsEnum];

const areMapPropsEqual = (
  prevProps: { points: Offer[]; selectedPoint: Offer | undefined; city: Offer['city'] },
  nextProps: { points: Offer[]; selectedPoint: Offer | undefined; city: Offer['city'] }
) => {
  const isCitySame = prevProps.city.name === nextProps.city.name;
  const isSelectedPointSame = prevProps.selectedPoint?.id === nextProps.selectedPoint?.id;

  const arePointsSame =
    prevProps.points.length === nextProps.points.length &&
    prevProps.points[0]?.id === nextProps.points[0]?.id;

  return isCitySame && isSelectedPointSame && arePointsSame;
};

const MapMemo = memo(Map, areMapPropsEqual);
const OfferListMemo = memo(OfferList);

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentCity = useAppSelector(selectCity);
  const isOffersDataLoading = useAppSelector(selectIsOffersDataLoading);
  const error = useAppSelector(selectOffersError);
  const cityOffers = useAppSelector(selectCityOffers);

  const [currentSort, setCurrentSort] = useState<SortOptionValue>(SortOptionsEnum.Popular);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const sortedOffers = useAppSelector((state: State) => selectSortedOffers(state, currentSort));

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const handleCityChange = useCallback((city: string) => {
    dispatch(setCity(city));
  }, [dispatch]);

  const handleSortChange = useCallback((sortType: SortOptionValue) => {
    setCurrentSort(sortType);
  }, []);

  const handleCardMouseEnter = useCallback((offerId: string) => {
    setActiveOfferId(offerId);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setActiveOfferId(null);
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const selectedPoint = useMemo(() =>
    cityOffers.find((offer) => offer.id === activeOfferId),
  [cityOffers, activeOfferId]);

  const offersCount = cityOffers.length;
  const hasOffers = offersCount > 0;
  const isMainEmpty = !hasOffers;

  if (isOffersDataLoading) {
    return (
      <div className="page page--gray page--main">
        <main className="page__main page__main--index">
          <Spinner />
        </main>
      </div>
    );
  }

  const renderContent = () => {
    if (error) {
      return (
        <section className="cities__no-places">
          <div className="cities__status-wrapper tabs__content">
            <b className="cities__status">Could not load offers</b>
            <p className="cities__status-description">{error}</p>
            <button
              onClick={handleRetry}
              className="form__submit button cities__status-button"
            >
              Try Again
            </button>
          </div>
        </section>
      );
    }

    if (isMainEmpty) {
      return <MainEmpty city={currentCity} />;
    }

    return (
      <section className="cities__places places">
        <h2 className="visually-hidden">Places</h2>
        <b className="places__found">{offersCount} places to stay in {currentCity}</b>

        <SortOptions
          currentSort={currentSort}
          onSortChange={handleSortChange}
        />

        <OfferListMemo
          offers={sortedOffers}
          onCardMouseEnter={handleCardMouseEnter}
          onCardMouseLeave={handleCardMouseLeave}
        />
      </section>
    );
  };

  return (
    <div className="page page--gray page--main">
      <main className={`page__main page__main--index ${isMainEmpty ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>

        <div className="tabs">
          <CitiesList
            cities={CITIES}
            currentCity={currentCity}
            onCityChange={handleCityChange}
          />
        </div>

        <div className="cities">
          <div className={`cities__places-container ${isMainEmpty ? 'cities__places-container--empty' : ''} container`}>

            {renderContent()}

            <div className="cities__right-section">
              {!isMainEmpty && !error && (
                <MapMemo
                  city={cityOffers[0].city}
                  points={cityOffers}
                  selectedPoint={selectedPoint}
                  className="cities__map"
                />
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
