import { useAppSelector } from '../../hooks';
import { selectOffers } from '../../store/offers/offers-selectors';
import { useFavorites } from '../../hooks/use-favorites';
import FavoritesList from './favorites-list';
import FavoritesEmpty from './favorites-empty';
import Footer from '../../components/footer';

function FavoritesPage(): JSX.Element {
  const offers = useAppSelector(selectOffers);
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
