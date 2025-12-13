import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import { AuthorizationStatus, NameSpace, RequestStatus } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { AppRoute } from '../../app/routes';

vi.mock('../spinner', () => ({
  default: () => <div data-testid="spinner-mock">Spinner Component</div>,
}));

describe('Component: PrivateRoute', () => {
  it('should render the spinner when authorization status is "Unknown"', () => {
    const component = withHistory(
      <PrivateRoute>
        <span>Private Content</span>
      </PrivateRoute>
    );

    const { withStoreComponent } = withStore(component, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        requestStatus: RequestStatus.Idle,
      }
    });

    render(withStoreComponent);

    expect(screen.getByTestId('spinner-mock')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('should render children when authorization status is "Auth"', () => {
    const component = withHistory(
      <PrivateRoute>
        <span>Private Content</span>
      </PrivateRoute>
    );

    const { withStoreComponent } = withStore(component, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: null,
        requestStatus: RequestStatus.Success,
      }
    });

    render(withStoreComponent);

    expect(screen.getByText('Private Content')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner-mock')).not.toBeInTheDocument();
  });

  it('should redirect to login route when authorization status is "NoAuth"', () => {
    const component = withHistory(
      <Routes>
        <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <span>Private Content</span>
            </PrivateRoute>
          }
        />
      </Routes>,
      ['/private']
    );

    const { withStoreComponent } = withStore(component, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Success,
      }
    });

    render(withStoreComponent);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });
});
