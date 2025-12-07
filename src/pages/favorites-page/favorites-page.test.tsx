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
import {
  selectFavorites,
  selectFavoritesByCity,
  selectFavoritesRequestStatus
} from '../../store/favorites/favorites-selectors';

vi.mock('./favorites-list', () => ({
  default: () => <div data-testid="favorites-list">Favorites List Component</div>
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

vi.mock('../../store/favorites/favorites-selectors', () => ({
  selectFavorites: vi.fn(),
  selectFavoritesByCity: vi.fn(),
  selectFavoritesRequestStatus: vi.fn()
}));

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middlewares);

describe('Page: FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Spinner when status is Loading', () => {
    vi.mocked(selectFavoritesRequestStatus).mockReturnValue(RequestStatus.Loading);
    vi.mocked(selectFavorites).mockReturnValue([]);
    vi.mocked(selectFavoritesByCity).mockReturnValue({});

    const store = mockStore({} as State);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render FavoritesEmpty when list is empty', () => {
    vi.mocked(selectFavoritesRequestStatus).mockReturnValue(RequestStatus.Success);
    vi.mocked(selectFavorites).mockReturnValue([]);
    vi.mocked(selectFavoritesByCity).mockReturnValue({});

    const store = mockStore({} as State);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render FavoritesList when favorites exist', () => {
    const fakeOffer = makeFakeOffer(true);

    vi.mocked(selectFavoritesRequestStatus).mockReturnValue(RequestStatus.Success);
    vi.mocked(selectFavorites).mockReturnValue([fakeOffer]);
    vi.mocked(selectFavoritesByCity).mockReturnValue({ [fakeOffer.city.name]: [fakeOffer] });

    const store = mockStore({} as State);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-empty')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should dispatch fetchFavoritesAction on mount', () => {
    vi.mocked(selectFavoritesRequestStatus).mockReturnValue(RequestStatus.Idle);
    vi.mocked(selectFavorites).mockReturnValue([]);
    vi.mocked(selectFavoritesByCity).mockReturnValue({});

    const store = mockStore({} as State);
    const fetchSpy = vi.spyOn(FavoritesThunks, 'fetchFavoritesAction');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(fetchSpy).toHaveBeenCalled();
  });
});
