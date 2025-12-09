import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OfferPage from './index';
import { AuthorizationStatus, RequestStatus, NameSpace } from '../../const';
import { withStore } from '../../utils/mock-component';
import { State } from '../../types/state';
import { makeFakeOffer } from '../../utils/mocks';

const { mockHandleFavoriteClick } = vi.hoisted(() => ({
  mockHandleFavoriteClick: vi.fn(),
}));

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

vi.mock('../../hooks/use-favorites', () => ({
  useFavoriteAction: () => ({
    handleFavoriteClick: mockHandleFavoriteClick,
    isFavoriteSubmitting: false,
  }),
}));

vi.mock('../../store/offer', async () => {
  const actual = await vi.importActual<typeof import('../../store/offer')>('../../store/offer');
  return {
    ...actual,
    fetchOfferAction: vi.fn((id) => ({ type: 'offer/fetch', payload: id })),
    dropOffer: vi.fn(() => ({ type: 'offer/drop' })),
  };
});

vi.mock('../../store/reviews', async () => {
  const actual = await vi.importActual<typeof import('../../store/reviews')>('../../store/reviews');
  return {
    ...actual,
    fetchReviewsAction: vi.fn((id) => ({ type: 'reviews/fetch', payload: id })),
    dropReviews: vi.fn(() => ({ type: 'reviews/drop' })),
  };
});

vi.mock('../../store/near-places', async () => {
  const actual = await vi.importActual<typeof import('../../store/near-places')>('../../store/near-places');
  return {
    ...actual,
    fetchNearPlacesAction: vi.fn((id) => ({ type: 'nearPlaces/fetch', payload: id })),
    dropNearPlaces: vi.fn(() => ({ type: 'nearPlaces/drop' })),
  };
});

describe('Page: OfferPage', () => {
  
  const makeMockState = (overrides: Partial<State> = {}) => {
    const defaultState = {
      [NameSpace.Offer]: {
        offer: null,
        offerStatus: RequestStatus.Idle,
      },
      [NameSpace.Reviews]: {
        reviews: [],
        status: RequestStatus.Idle,
        sendingStatus: RequestStatus.Idle,
        sendingError: null,
      },
      [NameSpace.NearPlaces]: {
        nearPlaces: [],
        nearPlacesStatus: RequestStatus.Idle,
      },
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        requestStatus: RequestStatus.Idle,
      },
    };
    return { ...defaultState, ...overrides } as State;
  };

  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
  });

  const getComponentWithRouter = () => (
    <MemoryRouter initialEntries={['/offer/1']}>
      <Routes>
        <Route path="/offer/:id" element={<OfferPage />} />
      </Routes>
    </MemoryRouter>
  );

  it('should dispatch fetch actions for Offer, Reviews, and NearPlaces on mount', () => {
    const { withStoreComponent, mockStore } = withStore(getComponentWithRouter(), makeMockState());

    render(withStoreComponent);

    const actions = mockStore.getActions().map((action) => action.type);

    expect(actions).toContain('offer/fetch');
    expect(actions).toContain('reviews/fetch');
    expect(actions).toContain('nearPlaces/fetch');
  });

  it('should dispatch drop actions on unmount to clear state', () => {
    const { withStoreComponent, mockStore } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: makeFakeOffer(), offerStatus: RequestStatus.Success },
    }));

    const { unmount } = render(withStoreComponent);
    
    unmount();

    const actions = mockStore.getActions().map((action) => action.type);
    expect(actions).toContain('offer/drop');
    expect(actions).toContain('reviews/drop');
    expect(actions).toContain('nearPlaces/drop');
  });

  it('should render Spinner when offerStatus is Loading', () => {
    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: null, offerStatus: RequestStatus.Loading },
    }));

    render(withStoreComponent);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render NotFoundPage when offerStatus is NotFound', () => {
    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: null, offerStatus: RequestStatus.NotFound },
    }));

    render(withStoreComponent);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('should render Error view with "Try Again" button when offerStatus is Error', () => {
    const { withStoreComponent, mockStore } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: null, offerStatus: RequestStatus.Error },
    }));

    render(withStoreComponent);

    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);

    const actions = mockStore.getActions();
    const fetchActions = actions.filter((a) => a.type === 'offer/fetch');
    expect(fetchActions.length).toBeGreaterThan(0);
  });

  it('should render offer content correctly (Premium, Price, Image slicing)', () => {
    const detailedOffer = {
      ...makeFakeOffer(),
      isPremium: true,
      price: 500,
      images: Array.from({ length: 10 }, (_, i) => `img${i}.jpg`),
      title: 'Luxury Villa'
    };

    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: detailedOffer, offerStatus: RequestStatus.Success },
      [NameSpace.Reviews]: { reviews: [], status: RequestStatus.Success, sendingStatus: RequestStatus.Idle, sendingError: null },
      [NameSpace.NearPlaces]: { nearPlaces: [], nearPlacesStatus: RequestStatus.Success },
      [NameSpace.User]: { authorizationStatus: AuthorizationStatus.Auth, user: null, requestStatus: RequestStatus.Idle },
    }));

    render(withStoreComponent);

    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('€500')).toBeInTheDocument();
    
    const images = screen.getAllByRole('img', { name: 'Luxury Villa' });
    expect(images).toHaveLength(6);

    expect(screen.getByTestId('map-component')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.getByTestId('near-places-list')).toBeInTheDocument();
  });

  it('should render CommentForm ONLY when user is Authorized', () => {
    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: makeFakeOffer(), offerStatus: RequestStatus.Success },
      [NameSpace.User]: { authorizationStatus: AuthorizationStatus.Auth, user: null, requestStatus: RequestStatus.Idle },
    }));

    render(withStoreComponent);
    expect(screen.getByTestId('comment-form')).toBeInTheDocument();
  });

  it('should NOT render CommentForm when user is Guest', () => {
    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: makeFakeOffer(), offerStatus: RequestStatus.Success },
      [NameSpace.User]: { authorizationStatus: AuthorizationStatus.NoAuth, user: null, requestStatus: RequestStatus.Idle },
    }));

    render(withStoreComponent);
    expect(screen.queryByTestId('comment-form')).not.toBeInTheDocument();
  });

  it('should handle bookmark button click', () => {
    const { withStoreComponent } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: makeFakeOffer(), offerStatus: RequestStatus.Success },
      [NameSpace.User]: { authorizationStatus: AuthorizationStatus.Auth, user: null, requestStatus: RequestStatus.Idle },
    }));

    render(withStoreComponent);

    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(mockHandleFavoriteClick).toHaveBeenCalledTimes(1);
  });

  it('should display error messages and retry buttons for Reviews and NearPlaces sections', () => {
    const { withStoreComponent, mockStore } = withStore(getComponentWithRouter(), makeMockState({
      [NameSpace.Offer]: { offer: makeFakeOffer(), offerStatus: RequestStatus.Success },
      [NameSpace.Reviews]: { reviews: [], status: RequestStatus.Error, sendingStatus: RequestStatus.Idle, sendingError: null },
      [NameSpace.NearPlaces]: { nearPlaces: [], nearPlacesStatus: RequestStatus.Error },
      [NameSpace.User]: { authorizationStatus: AuthorizationStatus.Auth, user: null, requestStatus: RequestStatus.Idle },
    }));

    render(withStoreComponent);

    expect(screen.getByText('Failed to load reviews.')).toBeInTheDocument();
    expect(screen.getByText('Failed to load nearby places.')).toBeInTheDocument();

    const retryButtons = screen.getAllByRole('button', { name: /Try again/i });
    expect(retryButtons).toHaveLength(2);

    fireEvent.click(retryButtons[0]);
    fireEvent.click(retryButtons[1]);

    const actions = mockStore.getActions().map((a) => a.type);
    expect(actions).toContain('reviews/fetch');
    expect(actions).toContain('nearPlaces/fetch');
  });
});
