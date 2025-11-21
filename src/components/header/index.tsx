import { memo } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import { logoutAction } from '../../store/api-actions';
import { RequestStatus } from '../../store/user-slice';
import { selectFavoriteOffersCount } from '../../store/offers-selectors';
import UserAuth from './user-auth';
import UserGuest from './user-guest';

function HeaderComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const user = useAppSelector((state) => state.user.user);
  const requestStatus = useAppSelector((state) => state.user.requestStatus);
  const favoriteCount = useAppSelector(selectFavoriteOffersCount);
  const isLoggingOut = requestStatus === RequestStatus.Pending;

  const handleSignOut = () => {
    dispatch(logoutAction());
  };

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
              {authorizationStatus === AuthorizationStatus.Auth ? (
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
