import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import { useAppSelector } from '../../hooks';
import { AuthorizationStatus } from '../../const';
import Spinner from '../spinner';

type PrivateRouteProps = {
  children: JSX.Element;
};

export function PrivateRoute({ children }: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return (
    authorizationStatus === AuthorizationStatus.Auth
      ? children
      : <Navigate to={AppRoute.Login} />
  );
}
