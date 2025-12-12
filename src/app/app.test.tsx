import { render, screen } from '@testing-library/react';
import { withStore } from '../utils/mock-component';
import App from './app';
import { AuthorizationStatus, NameSpace, RequestStatus } from '../const';
import { checkAuthAction } from '../store/user';

vi.mock('../components/spinner', () => ({
  default: () => <div data-testid="spinner-component">Spinner Component</div>
}));

vi.mock('./app-router', () => ({
  AppRouter: () => <div data-testid="app-router-component">App Router Component</div>
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

    expect(screen.getByTestId('spinner-component')).toBeInTheDocument();
    expect(screen.queryByTestId('app-router-component')).not.toBeInTheDocument();
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

    expect(screen.getByTestId('app-router-component')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner-component')).not.toBeInTheDocument();
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

    expect(screen.getByTestId('app-router-component')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner-component')).not.toBeInTheDocument();
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

    expect(actions).toEqual([
      expect.objectContaining({
        type: checkAuthAction.pending.type,
      })
    ]);
  });
});
