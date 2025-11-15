import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app-router';
import { useAppDispatch } from '../hooks/index';
import { useEffect } from 'react';
import { checkAuthAction } from '../store/api-actions';

function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
