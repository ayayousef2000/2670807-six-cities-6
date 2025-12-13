import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFavoritesAction } from '../../store/favorites/favorites-thunks';
import {
  selectFavorites,
  selectFavoritesRequestStatus,
  selectFavoritesByCity
} from '../../store/favorites/favorites-selectors';
import { RequestStatus } from '../../const';
import FavoritesList from './favorites-list';
import FavoritesEmpty from './favorites-empty';
import Footer from '../../components/footer';
import Spinner from '../../components/spinner';
import './favorites-page.css';

function FavoritesPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(selectFavorites);
  const favoritesByCity = useAppSelector(selectFavoritesByCity);
  const requestStatus = useAppSelector(selectFavoritesRequestStatus);

  useEffect(() => {
    dispatch(fetchFavoritesAction());
  }, [dispatch]);

  if (requestStatus === RequestStatus.Loading) {
    return (
      <>
        <main className="page__main page__main--favorites">
          <div className="container favorites__loading">
            <Spinner />
          </div>
        </main>
        <Footer />
      </>
    );
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
