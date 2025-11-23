import { useAppSelector } from '../../hooks';
import {
  getFavorites,
  getFavoritesLoadingStatus,
  selectFavoritesByCity
} from '../../store/favorites/favorites-selectors';
import FavoritesList from './favorites-list';
import FavoritesEmpty from './favorites-empty';
import Footer from '../../components/footer';
import Spinner from '../../components/spinner';

function FavoritesPage(): JSX.Element {

  const favorites = useAppSelector(getFavorites);
  const favoritesByCity = useAppSelector(selectFavoritesByCity);
  const isFavoritesLoading = useAppSelector(getFavoritesLoadingStatus);

  if (isFavoritesLoading) {
    return <Spinner />;
  }

  const hasFavorites = favorites.length > 0;

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
