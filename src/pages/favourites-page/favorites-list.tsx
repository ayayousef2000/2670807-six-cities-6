import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { setCity } from '../../store/offers/offers-slice';
import { AppRoute } from '../../app/routes';
import OfferCard from '../../components/offer-card';
import { Offer } from '../../types/offer';

type FavoritesListProps = {
  favoritesByCity: Record<string, Offer[]>;
};

function FavoritesListComponent({ favoritesByCity }: FavoritesListProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <section className="favorites">
      <h1 className="favorites__title">Saved listing</h1>
      <ul className="favorites__list">
        {Object.entries(favoritesByCity).map(([city, offers]) => (
          <li className="favorites__locations-items" key={city}>
            <div className="favorites__locations locations locations--current">
              <div className="locations__item">
                <Link
                  className="locations__item-link"
                  to={AppRoute.Main}
                  onClick={() => dispatch(setCity(city))}
                >
                  <span>{city}</span>
                </Link>
              </div>
            </div>
            <div className="favorites__places">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  variant="favorites"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FavoritesList = memo(FavoritesListComponent);
export default FavoritesList;
