import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/main-page';
import LoginPage from '../pages/login-page';
import FavouritesPage from '../pages/favourites-page';
import OfferPage from '../pages/offer-page';
import NotFoundPage from '../pages/not-found-page';
import { AppRoute } from './routes';
import { PrivateRoute } from '../components/private-route';
import { Offer } from '../types/offer';
import Layout from '../components/layout';

type AppRouterProps = {
  offers: Offer[];
}

export function AppRouter({ offers }: AppRouterProps): JSX.Element {
  return (
    <Routes>
      <Route path={AppRoute.Main} element={<Layout offers={offers} />}>
        <Route
          index
          element={<MainPage offers={offers} />}
        />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute isAuthorized={false}>
              <FavouritesPage offers={offers} />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Offer}
          element={<OfferPage offers={offers} />}
        />
      </Route>

      <Route
        path={AppRoute.Login}
        element={<LoginPage />}
      />
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}
