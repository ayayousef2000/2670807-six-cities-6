import { memo, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { UserData } from '../../types/user-data';

type UserAuthProps = {
  user: UserData;
  favoriteCount: number;
  onSignOut: () => void;
  isLoggingOut: boolean;
};

function UserAuth({ user, favoriteCount, onSignOut, isLoggingOut }: UserAuthProps): JSX.Element {
  const handleSignOutClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    if (!isLoggingOut) {
      onSignOut();
    }
  };

  return (
    <>
      <li className="header__nav-item user">
        <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
          <div className="header__avatar-wrapper user__avatar-wrapper">
            <img
              className="user__avatar"
              src={user.avatarUrl}
              width={20}
              height={20}
              alt={user.name}
              style={{ borderRadius: '50%' }}
            />
          </div>
          <span className="header__user-name user__name">{user.email}</span>
          <span className="header__favorite-count">{favoriteCount}</span>
        </Link>
      </li>
      <li className="header__nav-item">
        <Link
          className="header__nav-link"
          to={AppRoute.Main}
          onClick={handleSignOutClick}
          style={{
            pointerEvents: isLoggingOut ? 'none' : 'auto',
            opacity: isLoggingOut ? 0.5 : 1
          }}
        >
          <span className="header__signout">
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </span>
        </Link>
      </li>
    </>
  );
}

const UserAuthMemo = memo(UserAuth);
export default UserAuthMemo;
