import { Outlet } from 'react-router-dom';
import Header from '../header';
import { useFavorites } from '../../hooks/use-favorites';
import { Offer } from '../../types/offer';

type LayoutProps = {
  offers: Offer[];
};

function Layout({ offers }: LayoutProps): JSX.Element {
  const { favoriteOffers } = useFavorites(offers);

  return (
    <>
      <Header favoriteCount={favoriteOffers.length} />
      <Outlet />
    </>
  );
}

export default Layout;
