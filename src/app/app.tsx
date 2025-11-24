import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app-router';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { checkAuthAction } from '../store/user/user-thunks';
import { selectAuthorizationStatus } from '../store/user/user-selectors';
import { AuthorizationStatus } from '../const';
import Spinner from '../components/spinner';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
