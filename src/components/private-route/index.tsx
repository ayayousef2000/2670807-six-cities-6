import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus } from '../../const';
import { useAppSelector } from '../../hooks';
import { selectAuthorizationStatus } from '../../store/user';
import Spinner from '../spinner';

type PrivateRouteProps = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}
