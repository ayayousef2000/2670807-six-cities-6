import { render, screen } from '@testing-library/react';
import { withStore } from '../utils/mock-component';
import App from './app';
import { AuthorizationStatus, NameSpace, RequestStatus } from '../const';
import { checkAuthAction } from '../store/user';

vi.mock('../components/spinner', () => ({
  default: () => <div data-testid="spinner">Spinner</div>
}));

vi.mock('./app-router', () => ({
  AppRouter: () => <div data-testid="app-router">App Router</div>
}));

describe('Component: App', () => {
  it('should render "Spinner" when authorization status is "Unknown"', () => {
    const { withStoreComponent } = withStore(<App />, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        requestStatus: RequestStatus.Idle,
      }
    });

    render(withStoreComponent);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('app-router')).not.toBeInTheDocument();
  });

  it('should render "AppRouter" when authorization status is "Auth"', () => {
    const { withStoreComponent } = withStore(<App />, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: null,
        requestStatus: RequestStatus.Success,
      }
    });

    render(withStoreComponent);

    expect(screen.getByTestId('app-router')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('should render "AppRouter" when authorization status is "NoAuth"', () => {
    const { withStoreComponent } = withStore(<App />, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Success,
      }
    });

    render(withStoreComponent);

    expect(screen.getByTestId('app-router')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('should dispatch "checkAuthAction" when the app is initialized', () => {
    const { withStoreComponent, mockStore } = withStore(<App />, {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        requestStatus: RequestStatus.Idle,
      }
    });

    render(withStoreComponent);

    const actions = mockStore.getActions();
    const isCheckAuthActionDispatched = actions.some(
      (action) => action.type === checkAuthAction.pending.type
    );

    expect(isCheckAuthActionDispatched).toBe(true);
  });
});
