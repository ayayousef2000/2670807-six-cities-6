import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OfferList from '../../components/offer-list';
import Map from '../../components/map';
import CitiesList from '../../components/cities-list';
import { RootState, AppDispatch } from '../../store';
import { setCity } from '../../store/offers-slice';
import { CITIES } from '../../const';

function MainPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const currentCity = useSelector((state: RootState) => state.offers.city);
  const allOffers = useSelector((state: RootState) => state.offers.offers);

  const cityOffers = useMemo(
    () => allOffers.filter((offer) => offer.city.name === currentCity),
    [allOffers, currentCity]
  );

  const [activeOfferId, setActiveOfferId] = useState<number | null>(null);

  const handleCityChange = useCallback((city: string) => {
    dispatch(setCity(city));
  }, [dispatch]);

  const handleCardMouseEnter = (offerId: number) => {
    setActiveOfferId(offerId);
  };

  const handleCardMouseLeave = () => {
    setActiveOfferId(null);
  };

  const offersCount = cityOffers.length;
  const selectedPoint = cityOffers.find((offer) => offer.id === activeOfferId);
  const cityLocation = cityOffers.length > 0 ? cityOffers[0].city : null;

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
              <form className="places__sorting" action="#" method="get">
              </form>

              <OfferList
                offers={cityOffers}
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
