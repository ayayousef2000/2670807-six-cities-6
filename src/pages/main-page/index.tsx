import { useState, useCallback, useEffect } from 'react';
import OfferList from '../../components/offer-list';
import Map from '../../components/map';
import CitiesList from '../../components/cities-list';
import SortOptions from '../../components/sort-options';
import Spinner from '../../components/spinner';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setCity } from '../../store/offers-slice';
import { fetchOffersAction } from '../../store/api-actions';
import {
  selectCity,
  selectCityOffers,
  selectSortedOffers,
  selectIsOffersDataLoading,
  selectError,
  selectErrorMessage
} from '../../store/offers-selectors';
import { CITIES, SortOptions as SortOptionsEnum } from '../../const';
import './main-page.css';

type SortOption = typeof SortOptionsEnum[keyof typeof SortOptionsEnum];

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const currentCity = useAppSelector(selectCity);
  const isOffersDataLoading = useAppSelector(selectIsOffersDataLoading);
  const error = useAppSelector(selectError);
  const errorMessage = useAppSelector(selectErrorMessage);
  const cityOffers = useAppSelector(selectCityOffers);

  const [currentSort, setCurrentSort] = useState<SortOption>(SortOptionsEnum.POPULAR);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const sortedOffers = useAppSelector((state) => selectSortedOffers(state, currentSort));

  useEffect(() => {
    const promise = dispatch(fetchOffersAction());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleCityChange = useCallback((city: string) => {
    dispatch(setCity(city));
  }, [dispatch]);

  const handleSortChange = useCallback((sortType: SortOption) => {
    setCurrentSort(sortType);
  }, []);

  const handleCardMouseEnter = useCallback((offerId: string) => {
    setActiveOfferId(offerId);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setActiveOfferId(null);
  }, []);

  const offersCount = cityOffers.length;
  const hasOffers = offersCount > 0;
  const isMainEmpty = !hasOffers || !!error;

  if (isOffersDataLoading && !hasOffers) {
    return <Spinner />;
  }

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

          {isMainEmpty ? (
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                {error ? (
                  <>
                    <b className="cities__status">Could not load offers</b>
                    <p className="cities__status-description">{errorMessage}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="form__submit button cities__status-button"
                    >
                      Try Again
                    </button>
                  </>
                ) : (
                  <>
                    <b className="cities__status">No places to stay available</b>
                    <p className="cities__status-description">
                      We could not find any property available at the moment in {currentCity}
                    </p>
                  </>
                )}
              </div>
            </section>
          ) : (
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
          )}

          <div className="cities__right-section">
            {!isMainEmpty && (
              <Map
                city={cityOffers[0].city}
                points={cityOffers}
                selectedPoint={cityOffers.find((offer) => offer.id === activeOfferId)}
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
