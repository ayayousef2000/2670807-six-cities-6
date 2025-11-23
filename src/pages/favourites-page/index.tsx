import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFavoritesAction } from '../../store/favorites/favorites-thunks';
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
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(getFavorites);
  const favoritesByCity = useAppSelector(selectFavoritesByCity);
  const isFavoritesLoading = useAppSelector(getFavoritesLoadingStatus);

  useEffect(() => {
    dispatch(fetchFavoritesAction());
  }, [dispatch]);

  if (isFavoritesLoading) {
    return (
      <div className="page">
        <main className="page__main page__main--favorites">
          <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasFavorites = favorites.length > 0;

  return (
    <div className={`page ${!hasFavorites ? 'page--favorites-empty' : ''}`}>
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
    </div>
  );
}

export default FavoritesPage;
