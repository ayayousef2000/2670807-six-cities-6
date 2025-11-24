import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header';
import { AppRoute } from '../../app/routes';

function Layout(): JSX.Element {
  const { pathname } = useLocation();

  let pageClass = 'page';
  if (pathname === AppRoute.Main as string) {
    pageClass += ' page--gray page--main';
  }

  return (
    <div className={pageClass}>
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
