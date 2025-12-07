import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../../services/api';
import { State } from '../../types/state';
import { AuthorizationStatus, RequestStatus } from '../../const';
import OfferPage from './index';
import * as OfferActions from '../../store/offer';
import * as ReviewActions from '../../store/reviews';
import * as NearPlacesActions from '../../store/near-places';
import { makeFakeOffer } from '../../utils/mocks';

vi.mock('../../components/map', () => ({
  default: () => <div data-testid="map-component">Map Component</div>
}));
vi.mock('../../components/reviews-list', () => ({
  default: () => <div data-testid="reviews-list">Reviews List</div>
}));
vi.mock('../../components/offer-list', () => ({
  default: () => <div data-testid="near-places-list">Near Places List</div>
}));
vi.mock('../../components/comment-form', () => ({
  default: () => <div data-testid="comment-form">Comment Form</div>
}));
vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));
vi.mock('../not-found-page', () => ({
  default: () => <div data-testid="not-found-page">404 Not Found</div>
}));

const mockHandleFavoriteClick = vi.fn();
vi.mock('../../hooks/use-favorites', () => ({
  useFavoriteAction: () => ({
    handleFavoriteClick: mockHandleFavoriteClick,
    isFavoriteSubmitting: false,
  }),
}));

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middlewares);

describe('Page: OfferPage', () => {
  const offerId = '1';

  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Spinner when offer status is Loading', () => {
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Loading, status: RequestStatus.Loading, offer: null },
      reviews: { reviewsStatus: RequestStatus.Idle, status: RequestStatus.Idle, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Idle, status: RequestStatus.Idle, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.Unknown },
    } as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render NotFoundPage when offer status is NotFound', () => {
    const store = mockStore({
      offer: { offerStatus: RequestStatus.NotFound, status: RequestStatus.NotFound, offer: null },
      reviews: { reviewsStatus: RequestStatus.Idle, status: RequestStatus.Idle, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Idle, status: RequestStatus.Idle, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.Unknown },
    } as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('should render Error view with Try Again button when offer status is Error', () => {
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Error, status: RequestStatus.Error, offer: null },
      reviews: { reviews: [], reviewsStatus: RequestStatus.Idle, status: RequestStatus.Idle },
      nearPlaces: { nearPlaces: [], nearPlacesStatus: RequestStatus.Idle, status: RequestStatus.Idle },
      user: { authorizationStatus: AuthorizationStatus.NoAuth },
    } as unknown as State);

    const fetchSpy = vi.spyOn(OfferActions, 'fetchOfferAction');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(fetchSpy).toHaveBeenCalledWith(offerId);
  });

  it('should render offer content correctly when data is loaded successfully', () => {
    const fakeOffer = makeFakeOffer();
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
      reviews: { reviewsStatus: RequestStatus.Success, status: RequestStatus.Success, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Success, status: RequestStatus.Success, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.NoAuth },
    } as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(fakeOffer.title)).toBeInTheDocument();
    expect(screen.getByText(`€${fakeOffer.price}`)).toBeInTheDocument();
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.getByTestId('near-places-list')).toBeInTheDocument();

    expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
  });

  it('should render CommentForm when user is Authorized', () => {
    const fakeOffer = makeFakeOffer();
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
      reviews: { reviewsStatus: RequestStatus.Success, status: RequestStatus.Success, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Success, status: RequestStatus.Success, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.Auth },
    } as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('comment-form')).toBeInTheDocument();
  });

  it('should handle bookmark button click via custom hook', () => {
    const fakeOffer = makeFakeOffer();
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
      reviews: { reviewsStatus: RequestStatus.Success, status: RequestStatus.Success, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Success, status: RequestStatus.Success, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.Auth },
    } as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(mockHandleFavoriteClick).toHaveBeenCalledTimes(1);
  });

  it('should dispatch retry actions when child sections fail to load', () => {
    const fakeOffer = makeFakeOffer();
    const store = mockStore({
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
      reviews: { reviewsStatus: RequestStatus.Error, status: RequestStatus.Error, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Error, status: RequestStatus.Error, nearPlaces: [] },
      user: { authorizationStatus: AuthorizationStatus.Auth },
    } as unknown as State);

    const reviewsSpy = vi.spyOn(ReviewActions, 'fetchReviewsAction');
    const placesSpy = vi.spyOn(NearPlacesActions, 'fetchNearPlacesAction');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const retryButtons = screen.getAllByText('Try again');
    expect(retryButtons).toHaveLength(2);

    fireEvent.click(retryButtons[0]);
    expect(reviewsSpy).toHaveBeenCalledWith(offerId);

    fireEvent.click(retryButtons[1]);
    expect(placesSpy).toHaveBeenCalledWith(offerId);
  });
});
