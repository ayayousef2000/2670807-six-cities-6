import { render, screen } from '@testing-library/react';
import FavoritesPage from './favorites-page';
import { RequestStatus, NameSpace } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import { withStore, withHistory } from '../../utils/mock-component';
import * as FavoritesThunks from '../../store/favorites/favorites-thunks';

vi.mock('./favorites-list', () => ({
  default: ({ favoritesByCity }: { favoritesByCity: Record<string, unknown[]> }) => (
    <div data-testid="favorites-list">
      Items count: {Object.keys(favoritesByCity).length}
    </div>
  )
}));

vi.mock('./favorites-empty', () => ({
  default: () => <div data-testid="favorites-empty">Favorites Empty Component</div>
}));

vi.mock('../../components/footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));

vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Loading Favorites...</div>
}));

vi.mock('../../store/favorites/favorites-thunks', async () => {
  const actual = await vi.importActual<typeof import('../../store/favorites/favorites-thunks')>('../../store/favorites/favorites-thunks');
  return {
    ...actual,
    fetchFavoritesAction: vi.fn(() => ({ type: 'favorites/fetchFavorites' })),
  };
});

describe('Page: FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch "fetchFavoritesAction" on mount', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), {
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Idle,
      }
    });

    render(withStoreComponent);

    expect(FavoritesThunks.fetchFavoritesAction).toHaveBeenCalledTimes(1);
  });

  it('should render Spinner when status is Loading', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), {
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Loading,
      }
    });

    render(withStoreComponent);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render FavoritesEmpty when list is empty and status is Success', () => {
    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), {
      [NameSpace.Favorites]: {
        favorites: [],
        requestStatus: RequestStatus.Success,
      }
    });

    const { container } = render(withStoreComponent);

    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument();

    const mainWrapper = container.querySelector('.page__main');
    expect(mainWrapper).toHaveClass('page__main--favorites-empty');
  });

  it('should render FavoritesList when favorites exist', () => {
    const fakeOffer = makeFakeOffer(true);

    const { withStoreComponent } = withStore(withHistory(<FavoritesPage />), {
      [NameSpace.Favorites]: {
        favorites: [fakeOffer],
        requestStatus: RequestStatus.Success,
      }
    });

    const { container } = render(withStoreComponent);

    expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-empty')).not.toBeInTheDocument();
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('Items count: 1');

    const mainWrapper = container.querySelector('.page__main');
    expect(mainWrapper).not.toHaveClass('page__main--favorites-empty');
  });
});
