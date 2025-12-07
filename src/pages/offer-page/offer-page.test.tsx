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
  let store: ReturnType<typeof mockStore>;

  const defaultState = {
    offer: {
      offerStatus: RequestStatus.Idle,
      status: RequestStatus.Idle,
      offer: null
    },
    reviews: {
      reviewsStatus: RequestStatus.Idle,
      status: RequestStatus.Idle,
      reviews: []
    },
    nearPlaces: {
      nearPlacesStatus: RequestStatus.Idle,
      status: RequestStatus.Idle,
      nearPlaces: []
    },
    user: {
      authorizationStatus: AuthorizationStatus.Unknown
    },
  };

  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetch actions for Offer, Reviews, and NearPlaces on mount', () => {
    const fetchOfferSpy = vi.spyOn(OfferActions, 'fetchOfferAction');
    const fetchReviewsSpy = vi.spyOn(ReviewActions, 'fetchReviewsAction');
    const fetchNearPlacesSpy = vi.spyOn(NearPlacesActions, 'fetchNearPlacesAction');

    store = mockStore(defaultState as unknown as State);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(fetchOfferSpy).toHaveBeenCalledWith(offerId);
    expect(fetchReviewsSpy).toHaveBeenCalledWith(offerId);
    expect(fetchNearPlacesSpy).toHaveBeenCalledWith(offerId);
  });

  it('should dispatch drop actions on unmount to clear state', () => {
    const dropOfferSpy = vi.spyOn(OfferActions, 'dropOffer');
    const dropReviewsSpy = vi.spyOn(ReviewActions, 'dropReviews');
    const dropNearPlacesSpy = vi.spyOn(NearPlacesActions, 'dropNearPlaces');

    store = mockStore({
      ...defaultState,
      offer: { ...defaultState.offer, offerStatus: RequestStatus.Success, offer: makeFakeOffer() }
    } as unknown as State);

    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    expect(dropOfferSpy).toHaveBeenCalled();
    expect(dropReviewsSpy).toHaveBeenCalled();
    expect(dropNearPlacesSpy).toHaveBeenCalled();
  });

  it('should render Spinner when offer status is Loading', () => {
    store = mockStore({
      ...defaultState,
      offer: { ...defaultState.offer, offerStatus: RequestStatus.Loading },
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
    store = mockStore({
      ...defaultState,
      offer: { ...defaultState.offer, offerStatus: RequestStatus.NotFound },
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

  it('should render Error view with "Try Again" button when offer status is Error', () => {
    const fetchOfferSpy = vi.spyOn(OfferActions, 'fetchOfferAction');
    store = mockStore({
      ...defaultState,
      offer: { ...defaultState.offer, offerStatus: RequestStatus.Error },
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

    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);

    expect(fetchOfferSpy).toHaveBeenCalledWith(offerId);
  });

  it('should render offer content correctly (Premium label, Gallery limit, Price)', () => {
    const detailedOffer = {
      ...makeFakeOffer(),
      isPremium: true,
      price: 999,
      images: Array.from({ length: 10 }, (_, i) => `https://url.com/img${i}.jpg`),
      goods: ['Wi-Fi', 'Heating'],
      host: {
        name: 'Angelina',
        isPro: true,
        avatarUrl: 'img/avatar.jpg'
      }
    };

    store = mockStore({
      ...defaultState,
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: detailedOffer },
      reviews: { reviewsStatus: RequestStatus.Success, status: RequestStatus.Success, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Success, status: RequestStatus.Success, nearPlaces: [] },
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

    expect(screen.getByText('Premium')).toBeInTheDocument();

    expect(screen.getByText('€999')).toBeInTheDocument();

    const images = screen.getAllByRole('img', { name: detailedOffer.title });
    expect(images).toHaveLength(6);

    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.getByTestId('near-places-list')).toBeInTheDocument();
  });

  it('should render CommentForm only when user is Authorized', () => {
    const fakeOffer = makeFakeOffer();
    store = mockStore({
      ...defaultState,
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
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
    store = mockStore({
      ...defaultState,
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
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

  it('should dispatch retry actions when Review or NearPlaces sections fail', () => {
    const fakeOffer = makeFakeOffer();
    store = mockStore({
      ...defaultState,
      offer: { offerStatus: RequestStatus.Success, status: RequestStatus.Success, offer: fakeOffer },
      reviews: { reviewsStatus: RequestStatus.Error, status: RequestStatus.Error, reviews: [] },
      nearPlaces: { nearPlacesStatus: RequestStatus.Error, status: RequestStatus.Error, nearPlaces: [] },
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

    const retryButtons = screen.getAllByRole('button', { name: /Try again/i });
    expect(retryButtons).toHaveLength(2);

    fireEvent.click(retryButtons[0]);
    expect(reviewsSpy).toHaveBeenCalledWith(offerId);

    fireEvent.click(retryButtons[1]);
    expect(placesSpy).toHaveBeenCalledWith(offerId);
  });
});
