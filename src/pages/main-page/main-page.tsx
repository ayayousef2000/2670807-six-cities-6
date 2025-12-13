import { useState, useCallback, useEffect, useMemo } from 'react';
import OfferList from '../../components/offer-list';
import Map from '../../components/map';
import CitiesList from '../../components/cities-list';
import SortOptions from '../../components/sort-options';
import Spinner from '../../components/spinner';
import MainEmpty from '../../components/main-empty';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setCity,
  fetchOffersAction,
  selectCity,
  selectCityOffers,
  selectSortedOffers,
  selectIsOffersDataLoading,
  selectOffersError
} from '../../store/offers';
import { CITIES, SortOption as SortOptionsEnum } from '../../const';
import { State } from '../../types/state';
import './main-page.css';

type SortOptionValue = typeof SortOptionsEnum[keyof typeof SortOptionsEnum];

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
      <main className="page__main page__main--index">
        <Spinner />
      </main>
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

        <OfferList
          offers={sortedOffers}
          onCardMouseEnter={handleCardMouseEnter}
          onCardMouseLeave={handleCardMouseLeave}
        />
      </section>
    );
  };

  return (
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
              <Map
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
  );
}

export default MainPage;
