import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../header';
import { useFavorites } from '../../hooks/use-favorites';
import { RootState } from '../../store';


function Layout(): JSX.Element {
  const offers = useSelector((state: RootState) => state.offers.offers);
  const { favoriteOffers } = useFavorites(offers);
  return (
    <div className="page">
      <Header favoriteCount={favoriteOffers.length} />
      <Outlet />
    </div>
  );
}

export default Layout;
