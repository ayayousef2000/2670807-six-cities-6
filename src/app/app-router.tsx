import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/main-page';
import LoginPage from '../pages/login-page';
import FavouritesPage from '../pages/favourites-page';
import OfferPage from '../pages/offer-page';
import NotFoundPage from '../pages/not-found-page';
import { AppRoute } from './routes';
import { PrivateRoute } from '../components/private-route';
import Layout from '../components/layout';

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path={AppRoute.Main} element={<Layout />}>
        <Route
          index
          element={<MainPage />}
        />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute>
              <FavouritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Offer}
          element={<OfferPage />}
        />
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
      <Route
        path={AppRoute.Login}
        element={<LoginPage />}
      />
    </Routes>
  );
}
