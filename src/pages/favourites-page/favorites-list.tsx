import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import OfferCard from '../../components/offer-card';
import { Offer } from '../../types/offer';

type FavoritesListProps = {
  favoritesByCity: Record<string, Offer[]>;
};

function FavoritesList({ favoritesByCity }: FavoritesListProps): JSX.Element {
  return (
    <section className="favorites">
      <h1 className="favorites__title">Saved listing</h1>
      <ul className="favorites__list">
        {Object.entries(favoritesByCity).map(([city, cityOffers]) => (
          <li className="favorites__locations-items" key={city}>
            <div className="favorites__locations locations locations--current">
              <div className="locations__item">
                <Link className="locations__item-link" to={AppRoute.Main}>
                  <span>{city}</span>
                </Link>
              </div>
            </div>
            <div className="favorites__places">
              {cityOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} variant="favorites" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FavoritesList;
