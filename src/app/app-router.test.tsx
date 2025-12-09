import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './app-router';
import { AppRoute } from './routes';
import { AuthorizationStatus, NameSpace, RequestStatus } from '../const';
import { withStore } from '../utils/mock-component';

vi.mock('../components/layout', async () => {
  const { Outlet } = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    default: () => (
      <div data-testid="layout-component">
        Layout Component
        <Outlet />
      </div>
    ),
  };
});

vi.mock('../pages/main-page', () => ({ default: () => <h1>Main Page</h1> }));
vi.mock('../pages/login-page', () => ({ default: () => <h1>Login Page</h1> }));
vi.mock('../pages/favorites-page', () => ({ default: () => <h1>Favorites Page</h1> }));
vi.mock('../pages/offer-page', () => ({ default: () => <h1>Offer Page</h1> }));
vi.mock('../pages/not-found-page', () => ({ default: () => <h1>Not Found Page</h1> }));

describe('Component: AppRouter', () => {
  const renderAppRouter = (initialRoute: string, authStatus: AuthorizationStatus) => {
    const { withStoreComponent } = withStore(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRouter />
      </MemoryRouter>,
      {
        [NameSpace.User]: {
          authorizationStatus: authStatus,
          user: null,
          requestStatus: RequestStatus.Idle,
        },
      }
    );

    render(withStoreComponent);
  };

  it('should render "MainPage" inside Layout when user navigates to "/"', () => {
    renderAppRouter(AppRoute.Main, AuthorizationStatus.NoAuth);

    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    expect(screen.getByText(/Main Page/i)).toBeInTheDocument();
  });

  it('should render "LoginPage" when user navigates to "/login"', () => {
    renderAppRouter(AppRoute.Login, AuthorizationStatus.NoAuth);

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('should render "OfferPage" when user navigates to "/offer/:id"', () => {
    renderAppRouter('/offer/1', AuthorizationStatus.NoAuth);

    expect(screen.getByText(/Offer Page/i)).toBeInTheDocument();
  });

  it('should render "FavoritesPage" when user navigates to "/favorites" and is authorized', () => {
    renderAppRouter(AppRoute.Favorites, AuthorizationStatus.Auth);

    expect(screen.getByText(/Favorites Page/i)).toBeInTheDocument();
  });

  it('should redirect to "LoginPage" when user navigates to "/favorites" and is not authorized', () => {
    renderAppRouter(AppRoute.Favorites, AuthorizationStatus.NoAuth);

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Favorites Page/i)).not.toBeInTheDocument();
  });

  it('should render "NotFoundPage" when user navigates to a non-existent route', () => {
    renderAppRouter('/non-existent-route', AuthorizationStatus.NoAuth);

    expect(screen.getByText(/Not Found Page/i)).toBeInTheDocument();
  });
});
