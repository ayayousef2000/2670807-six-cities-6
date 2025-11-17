import { useSelector } from 'react-redux';
import { useFavorites } from '../../hooks/use-favorites';
import { RootState } from '../../store';
import FavoritesList from './favorites-list';
import FavoritesEmpty from './favorites-empty';
import Footer from '../../components/footer';

function FavoritesPage(): JSX.Element {
  const offers = useSelector((state: RootState) => state.offers.offers);
  const { favoritesByCity, favoriteOffers } = useFavorites(offers);
  const hasFavorites = favoriteOffers.length > 0;

  return (
    <>
      <main className={`page__main page__main--favorites ${!hasFavorites ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {hasFavorites ? (
            <FavoritesList favoritesByCity={favoritesByCity} />
          ) : (
            <FavoritesEmpty />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FavoritesPage;
