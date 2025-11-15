import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppRoute } from '../../app/routes';
import { useFavorites } from '../../hooks/use-favorites';
import { RootState } from '../../store';
import OfferCard from '../../components/offer-card';

function FavoritesPage(): JSX.Element {
  const offers = useSelector((state: RootState) => state.offers.offers);
  const { favoritesByCity, favoriteOffers } = useFavorites(offers);
  const hasFavorites = favoriteOffers.length > 0;

  return (
    <div className={`page ${!hasFavorites ? 'page--favorites-empty' : ''}`}>
      <main className={`page__main page__main--favorites ${!hasFavorites ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {hasFavorites ? (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(favoritesByCity).map(([city, cityOffers]) => (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} variant="cities" />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            </section>
          )}
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
