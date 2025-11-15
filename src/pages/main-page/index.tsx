import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OfferList from '../../components/offer-list';
import Map from '../../components/map';
import CitiesList from '../../components/cities-list';
import SortOptions from '../../components/sort-options';
import Spinner from '../../components/spinner';
import { RootState, AppDispatch } from '../../store';
import { setCity } from '../../store/offers-slice';
import { fetchOffersAction } from '../../store/api-actions';
import { CITIES, SortOptions as SortOptionsEnum } from '../../const';
import { Offer } from '../../types/offer';

type SortOption = typeof SortOptionsEnum[keyof typeof SortOptionsEnum];

const sortOffers = (offers: Offer[], sortType: SortOption): Offer[] => {
  switch (sortType) {
    case SortOptionsEnum.PRICE_LOW_TO_HIGH:
      return offers.toSorted((a, b) => a.price - b.price);
    case SortOptionsEnum.PRICE_HIGH_TO_LOW:
      return offers.toSorted((a, b) => b.price - a.price);
    case SortOptionsEnum.TOP_RATED_FIRST:
      return offers.toSorted((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
};

function MainPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isOffersDataLoading = useSelector((state: RootState) => state.offers.isOffersDataLoading);
  const hasError = useSelector((state: RootState) => state.offers.hasError);

  const currentCity = useSelector((state: RootState) => state.offers.city);
  const allOffers = useSelector((state: RootState) => state.offers.offers);

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const [currentSort, setCurrentSort] = useState<SortOption>(SortOptionsEnum.POPULAR);
  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);

  const cityOffers = useMemo(
    () => allOffers.filter((offer) => offer.city.name === currentCity),
    [allOffers, currentCity]
  );

  const sortedOffers = useMemo(
    () => sortOffers(cityOffers, currentSort),
    [cityOffers, currentSort]
  );

  const handleCityChange = useCallback((city: string) => {
    dispatch(setCity(city));
  }, [dispatch]);

  const handleSortChange = useCallback((sortType: SortOption) => {
    setCurrentSort(sortType);
  }, []);

  const handleCardMouseEnter = useCallback((offerId: number) => {
    setActiveOfferId(offerId);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setActiveOfferId(null);
  }, []);

  const offersCount = cityOffers.length;
  const selectedPoint = cityOffers.find((offer) => offer.id === activeOfferId);
  const cityLocation = cityOffers.length > 0 ? cityOffers[0].city : undefined;

  if (isOffersDataLoading) {
    return <Spinner />;
  }

  if (hasError) {
    return (
      <div className="page page--gray page--main">
        <div className="cities">
          <div className="cities__places-container cities__places-container--empty container">
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">Failed to load offers</b>
                <p className="cities__status-description">The server is currently unavailable. Please try again later.</p>
              </div>
            </section>
            <div className="cities__right-section"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <CitiesList
          cities={CITIES}
          currentCity={currentCity}
          onCityChange={handleCityChange}
        />

        <div className="cities">
          <div className="cities__places-container container">
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
            <div className="cities__right-section">
              {cityLocation && (
                <Map
                  city={cityLocation}
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
