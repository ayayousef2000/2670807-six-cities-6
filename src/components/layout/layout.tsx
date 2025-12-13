import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header';
import { AppRoute } from '../../app/routes';
import { useAppSelector } from '../../hooks';
import { selectFavorites } from '../../store/favorites';
import './layout.css';

function Layout(): JSX.Element {
  const { pathname } = useLocation();
  const favorites = useAppSelector(selectFavorites);

  let pageClass = 'page';

  if (pathname === (AppRoute.Main as string)) {
    pageClass += ' page--gray page--main';
  } else if (pathname === (AppRoute.Favorites as string)) {
    if (favorites.length === 0) {
      pageClass += ' page--favorites-empty';
    }
  }

  return (
    <div className={pageClass} data-testid="layout-container">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
