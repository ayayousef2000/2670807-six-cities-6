import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import { logoutAction } from '../../store/api-actions';
import UserAuth from './user-auth';
import UserGuest from './user-guest';

type HeaderProps = {
  favoriteCount: number;
}

function Header({ favoriteCount }: HeaderProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const user = useAppSelector((state) => state.user.user);

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

export default Header;
