import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../../services/api';
import FavoritesPage from './index';
import { State } from '../../types/state';
import { RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import * as FavoritesThunks from '../../store/favorites/favorites-thunks';
import * as FavoritesSelectors from '../../store/favorites/favorites-selectors';

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

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middlewares);

describe('Page: FavoritesPage', () => {
  let store: ReturnType<typeof mockStore>;

  const selectFavoritesSpy = vi.spyOn(FavoritesSelectors, 'selectFavorites');
  const selectFavoritesByCitySpy = vi.spyOn(FavoritesSelectors, 'selectFavoritesByCity');
  const selectFavoritesRequestStatusSpy = vi.spyOn(FavoritesSelectors, 'selectFavoritesRequestStatus');
  const fetchFavoritesSpy = vi.spyOn(FavoritesThunks, 'fetchFavoritesAction');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFavoritesPage = () => {
    store = mockStore({} as State);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should dispatch fetchFavoritesAction on mount', () => {
    selectFavoritesRequestStatusSpy.mockReturnValue(RequestStatus.Idle);
    selectFavoritesSpy.mockReturnValue([]);
    selectFavoritesByCitySpy.mockReturnValue({});

    renderFavoritesPage();

    expect(fetchFavoritesSpy).toHaveBeenCalledTimes(1);
  });

  it('should render Spinner when status is Loading', () => {
    selectFavoritesRequestStatusSpy.mockReturnValue(RequestStatus.Loading);
    selectFavoritesSpy.mockReturnValue([]);
    selectFavoritesByCitySpy.mockReturnValue({});

    renderFavoritesPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render FavoritesEmpty and apply "empty" CSS classes when list is empty', () => {
    selectFavoritesRequestStatusSpy.mockReturnValue(RequestStatus.Success);
    selectFavoritesSpy.mockReturnValue([]);
    selectFavoritesByCitySpy.mockReturnValue({});

    const { container } = renderFavoritesPage();

    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument();

    const pageWrapper = container.querySelector('.page');
    expect(pageWrapper).toHaveClass('page--favorites-empty');

    const mainWrapper = container.querySelector('.page__main');
    expect(mainWrapper).toHaveClass('page__main--favorites-empty');
  });

  it('should render FavoritesList and remove "empty" CSS classes when favorites exist', () => {
    const fakeOffer = makeFakeOffer(true);
    const mockFavoritesByCity = { [fakeOffer.city.name]: [fakeOffer] };

    selectFavoritesRequestStatusSpy.mockReturnValue(RequestStatus.Success);
    selectFavoritesSpy.mockReturnValue([fakeOffer]);
    selectFavoritesByCitySpy.mockReturnValue(mockFavoritesByCity);

    const { container } = renderFavoritesPage();

    expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-empty')).not.toBeInTheDocument();

    expect(screen.getByTestId('favorites-list')).toHaveTextContent('Items count: 1');

    const pageWrapper = container.querySelector('.page');
    expect(pageWrapper).not.toHaveClass('page--favorites-empty');

    const mainWrapper = container.querySelector('.page__main');
    expect(mainWrapper).not.toHaveClass('page__main--favorites-empty');
  });
});
