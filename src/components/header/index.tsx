import { memo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus, RequestStatus } from '../../const';
import {
  logoutAction,
  selectAuthorizationStatus,
  selectUser,
  selectUserRequestStatus
} from '../../store/user';
import { fetchFavoritesAction, selectFavorites } from '../../store/favorites';
import UserAuth from './user-auth';
import UserGuest from './user-guest';

function HeaderComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);
  const requestStatus = useAppSelector(selectUserRequestStatus);
  const favorites = useAppSelector(selectFavorites);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  const favoriteCount = favorites.length;
  const isLoggingOut = requestStatus === RequestStatus.Loading;

  const handleSignOut = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link" to={AppRoute.Main}>
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {authorizationStatus === AuthorizationStatus.Auth && user ? (
                <UserAuth
                  user={user}
                  favoriteCount={favoriteCount}
                  onSignOut={handleSignOut}
                  isLoggingOut={isLoggingOut}
                />
              ) : (
                <UserGuest />
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

const Header = memo(HeaderComponent);
export default Header;
