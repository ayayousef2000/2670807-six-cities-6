import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AppRouter } from './app-router';
import { AppRoute } from './routes';
import { AuthorizationStatus, NameSpace } from '../const';

vi.mock('../components/layout', async () => {
  const { Outlet } = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    default: () => <Outlet />,
  };
});

vi.mock('../pages/main-page', () => ({ default: () => <h1>Main Page</h1> }));
vi.mock('../pages/login-page', () => ({ default: () => <h1>Login Page</h1> }));
vi.mock('../pages/favorites-page', () => ({ default: () => <h1>Favorites Page</h1> }));
vi.mock('../pages/offer-page', () => ({ default: () => <h1>Offer Page</h1> }));
vi.mock('../pages/not-found-page', () => ({ default: () => <h1>Not Found Page</h1> }));

describe('AppRouter', () => {
  const createTestStore = (authorizationStatus: AuthorizationStatus) => {
    const initialState = {
      [NameSpace.User]: {
        authorizationStatus,
      },
    };

    return configureStore({
      reducer: {
        [NameSpace.User]: (state: typeof initialState.user = initialState[NameSpace.User]) => state,
      },
      preloadedState: initialState,
    });
  };

  it('should render "MainPage" when user navigates to "/"', () => {
    const store = createTestStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Main]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Main Page/i)).toBeInTheDocument();
  });

  it('should render "LoginPage" when user navigates to "/login"', () => {
    const store = createTestStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('should render "OfferPage" when user navigates to "/offer/:id"', () => {
    const store = createTestStore(AuthorizationStatus.NoAuth);
    const offerPath = '/offer/1';

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[offerPath]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Offer Page/i)).toBeInTheDocument();
  });

  it('should render "FavoritesPage" when user navigates to "/favorites" and is authorized', () => {
    const store = createTestStore(AuthorizationStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Favorites Page/i)).toBeInTheDocument();
  });

  it('should redirect to "LoginPage" when user navigates to "/favorites" and is not authorized', () => {
    const store = createTestStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Favorites Page/i)).not.toBeInTheDocument();
  });

  it('should render "NotFoundPage" when user navigates to a non-existent route', () => {
    const store = createTestStore(AuthorizationStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/non-existent-route']}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Not Found Page/i)).toBeInTheDocument();
  });
});
