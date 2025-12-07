import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withHistory, withStore } from '../../utils/mock-component';
import Header from './index';
import { AuthorizationStatus, RequestStatus, NameSpace } from '../../const';
import { makeFakeUser } from '../../utils/mocks';
import { fetchFavoritesAction } from '../../store/favorites';
import { logoutAction } from '../../store/user';

describe('Component: Header', () => {
  it('should render correctly when user is not authorized', () => {
    const { withStoreComponent } = withStore(withHistory(<Header />), {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Idle,
      },
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Idle,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign out/i)).not.toBeInTheDocument();
  });

  it('should render correctly when user is authorized', () => {
    const fakeUser = makeFakeUser();
    const { withStoreComponent } = withStore(withHistory(<Header />), {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUser,
        requestStatus: RequestStatus.Idle,
      },
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Idle,
      },
    });

    render(withStoreComponent);

    expect(screen.getByText(fakeUser.email)).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
  });

  it('should dispatch logoutAction when Sign out is clicked', async () => {
    const fakeUser = makeFakeUser();
    const { withStoreComponent, mockStore } = withStore(withHistory(<Header />), {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUser,
        requestStatus: RequestStatus.Idle,
      },
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Idle,
      },
    });

    render(withStoreComponent);

    const signOutLink = screen.getByText(/Sign out/i);
    await userEvent.click(signOutLink);

    const actions = mockStore.getActions();
    const isLogoutActionDispatched = actions.some(
      (action) => action.type === logoutAction.pending.type
    );

    expect(isLogoutActionDispatched).toBe(true);
  });

  it('should dispatch fetchFavoritesAction when mounted with Auth status', () => {
    const fakeUser = makeFakeUser();
    const { withStoreComponent, mockStore } = withStore(withHistory(<Header />), {
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUser,
        requestStatus: RequestStatus.Idle,
      },
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Idle,
      },
    });

    render(withStoreComponent);

    const actions = mockStore.getActions();
    const fetchFavoritesDispatched = actions.some(
      (action) => action.type === fetchFavoritesAction.pending.type
    );
    expect(fetchFavoritesDispatched).toBe(true);
  });
});
