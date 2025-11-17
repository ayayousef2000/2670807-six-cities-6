import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { UserData } from '../../types/user-data';

type UserAuthProps = {
  user: UserData | null;
  favoriteCount: number;
  onSignOut: () => void;
};

function UserAuth({ user, favoriteCount, onSignOut }: UserAuthProps): JSX.Element {
  return (
    <>
      <li className="header__nav-item user">
        <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
          <div className="header__avatar-wrapper user__avatar-wrapper" style={{ backgroundImage: `url(${user?.avatarUrl})` }}>
          </div>
          <span className="header__user-name user__name">{user?.email}</span>
          <span className="header__favorite-count">{favoriteCount}</span>
        </Link>
      </li>
      <li className="header__nav-item">
        <Link
          className="header__nav-link"
          to={AppRoute.Main}
          onClick={onSignOut}
        >
          <span className="header__signout">Sign out</span>
        </Link>
      </li>
    </>
  );
}

export default UserAuth;
