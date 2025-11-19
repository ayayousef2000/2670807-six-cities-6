import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../header';
import { useFavorites } from '../../hooks/use-favorites';
import { RootState } from '../../store';
import { AppRoute } from '../../app/routes';

function Layout(): JSX.Element {
  const { pathname } = useLocation();
  const offers = useSelector((state: RootState) => state.offers.offers);
  const { favoriteOffers } = useFavorites(offers);

  let pageClass = 'page';
  if (pathname === AppRoute.Main as string) {
    pageClass += ' page--gray page--main';
  }

  return (
    <div className={pageClass}>
      <Header favoriteCount={favoriteOffers.length} />
      <Outlet />
    </div>
  );
}

export default Layout;
