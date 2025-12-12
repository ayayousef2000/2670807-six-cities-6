import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainPage from './index';
import { makeFakeOffer } from '../../utils/mocks';
import { CITIES, SortOption, NameSpace, RequestStatus } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { setCity } from '../../store/offers';
import { Offer } from '../../types/offer';
import { State } from '../../types/state';

vi.mock('../../components/cities-list', () => ({
  default: ({ onCityChange, currentCity }: { onCityChange: (city: string) => void; currentCity: string }) => (
    <div data-testid="cities-list">
      <span>Active: {currentCity}</span>
      <button onClick={() => onCityChange(CITIES[1])}>Select City 2</button>
    </div>
  )
}));

vi.mock('../../components/sort-options', () => ({
  default: ({ currentSort, onSortChange }: { currentSort: string; onSortChange: (sort: string) => void }) => (
    <div data-testid="sort-options">
      <span>Sort: {currentSort}</span>
      <button onClick={() => onSortChange(SortOption.PriceLowToHigh)}>Change Sort</button>
    </div>
  )
}));

vi.mock('../../components/offer-list', () => ({
  default: ({ onCardMouseEnter, onCardMouseLeave }: {
    onCardMouseEnter: (id: string) => void;
    onCardMouseLeave: () => void;
  }) => (
    <div data-testid="offer-list">
      <button onClick={() => onCardMouseEnter('offer-1')}>Hover Card</button>
      <button onClick={() => onCardMouseLeave()}>Leave Card</button>
    </div>
  )
}));

vi.mock('../../components/map', () => ({
  default: ({ selectedPoint }: { selectedPoint: Offer | undefined }) => (
    <div data-testid="map">
      Active Map Point: {selectedPoint ? selectedPoint.id : 'None'}
    </div>
  )
}));

vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock('../../components/main-empty', () => ({
  default: () => <div data-testid="main-empty">No places found</div>
}));

vi.mock('../../store/offers', async () => {
  const actual = await vi.importActual<typeof import('../../store/offers')>('../../store/offers');
  return {
    ...actual,
    fetchOffersAction: vi.fn(() => ({ type: 'offers/fetchOffers' })),
  };
});

describe('Page: MainPage', () => {
  const mockOffer = { ...makeFakeOffer(), id: 'offer-1', city: { name: CITIES[0], location: { latitude: 0, longitude: 0, zoom: 10 } } } as Offer;
  const mockOffers = [mockOffer];

  const makeMockState = (initialState: Partial<State>) => (initialState as State);

  it('should render the Spinner when requestStatus is Loading', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: [],
        requestStatus: RequestStatus.Loading,
        error: null,
      }
    }));

    render(withStoreComponent);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument();
  });

  it('should render the Error view when requestStatus is Error', () => {
    const errorMessage = 'Failed to fetch';
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: [],
        requestStatus: RequestStatus.Error,
        error: errorMessage,
      }
    }));

    render(withStoreComponent);

    expect(screen.getByText(/Could not load offers/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('should render the Empty view when offers list is empty and status is Success', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: [],
        requestStatus: RequestStatus.Success,
        error: null,
      }
    }));

    render(withStoreComponent);

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument();
  });

  it('should render the Content view (List, Map, Sort) when offers exist', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: mockOffers,
        requestStatus: RequestStatus.Success,
        error: null,
      }
    }));

    render(withStoreComponent);

    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
    expect(screen.getByTestId('sort-options')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should dispatch "setCity" action when user selects a city', () => {
    const { withStoreComponent, mockStore } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: mockOffers,
        requestStatus: RequestStatus.Success,
        error: null,
      }
    }));

    render(withStoreComponent);

    const changeCityBtn = screen.getByText('Select City 2');
    fireEvent.click(changeCityBtn);

    const actions = mockStore.getActions();
    const setCityAction = actions.find((action) => action.type === setCity.type);

    expect(setCityAction).toBeDefined();
    expect(setCityAction?.payload).toBe(CITIES[1]);
  });

  it('should dispatch "fetchOffersAction" when clicking Try Again on error', () => {
    const { withStoreComponent, mockStore } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: [],
        requestStatus: RequestStatus.Error,
        error: 'Error',
      }
    }));

    render(withStoreComponent);

    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);

    const actions = mockStore.getActions();
    const fetchAction = actions.find((action) => action.type === 'offers/fetchOffers');
    expect(fetchAction).toBeDefined();
  });

  it('should update local state (Map active point) when hovering an offer card', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: mockOffers,
        requestStatus: RequestStatus.Success,
        error: null,
      }
    }));

    render(withStoreComponent);

    const map = screen.getByTestId('map');

    expect(map).toHaveTextContent('Active Map Point: None');

    fireEvent.click(screen.getByText('Hover Card'));
    expect(map).toHaveTextContent('Active Map Point: offer-1');

    fireEvent.click(screen.getByText('Leave Card'));
    expect(map).toHaveTextContent('Active Map Point: None');
  });

  it('should update local state (Sort Option) when changing sort', () => {
    const { withStoreComponent } = withStore(withHistory(<MainPage />), makeMockState({
      [NameSpace.Offers]: {
        city: CITIES[0],
        offers: mockOffers,
        requestStatus: RequestStatus.Success,
        error: null,
      }
    }));

    render(withStoreComponent);

    expect(screen.getByText(`Sort: ${SortOption.Popular}`)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Change Sort'));
    expect(screen.getByText(`Sort: ${SortOption.PriceLowToHigh}`)).toBeInTheDocument();
  });
});
