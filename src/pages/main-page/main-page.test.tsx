import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import MainPage from './index';
import { makeFakeOffer } from '../../utils/mocks';
import { CITIES, SortOption } from '../../const';
import * as offersStore from '../../store/offers';

vi.mock('../../components/cities-list', () => ({
  default: ({ onCityChange }: { onCityChange: (city: string) => void }) => (
    <div data-testid="cities-list">
      <button onClick={() => onCityChange(CITIES[1])}>Change City</button>
    </div>
  )
}));

vi.mock('../../components/sort-options', () => ({
  default: ({ onSortChange }: { onSortChange: (sort: string) => void }) => (
    <div data-testid="sort-options">
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
      <button onClick={() => onCardMouseEnter('offer-1')}>Hover Offer</button>
      <button onClick={() => onCardMouseLeave()}>Leave Offer</button>
    </div>
  )
}));

vi.mock('../../components/map', () => ({
  default: ({ selectedPoint }: { selectedPoint: { id: string } | undefined }) => (
    <div data-testid="map">
      Selected: {selectedPoint ? selectedPoint.id : 'None'}
    </div>
  )
}));

vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock('../../components/main-empty', () => ({
  default: () => <div data-testid="main-empty">No offers available</div>
}));

vi.mock('../../store/offers', async () => {
  const actual = await vi.importActual<typeof import('../../store/offers')>('../../store/offers');
  return {
    ...actual,
    fetchOffersAction: vi.fn(() => ({ type: 'offers/fetchOffers' })),
    setCity: vi.fn((city: string) => ({ type: 'offers/setCity', payload: city })),
  };
});

const mockStore = configureMockStore();

describe('Page: MainPage', () => {
  const mockOffers = [
    { ...makeFakeOffer(), id: 'offer-1' },
    { ...makeFakeOffer(), id: 'offer-2' }
  ];

  let store: ReturnType<typeof mockStore>;

  const selectCitySpy = vi.spyOn(offersStore, 'selectCity');
  const selectIsOffersDataLoadingSpy = vi.spyOn(offersStore, 'selectIsOffersDataLoading');
  const selectOffersErrorSpy = vi.spyOn(offersStore, 'selectOffersError');
  const selectCityOffersSpy = vi.spyOn(offersStore, 'selectCityOffers');
  const selectSortedOffersSpy = vi.spyOn(offersStore, 'selectSortedOffers');

  beforeEach(() => {
    vi.clearAllMocks();
    selectCitySpy.mockReturnValue(CITIES[0]);
    selectIsOffersDataLoadingSpy.mockReturnValue(false);
    selectOffersErrorSpy.mockReturnValue(null);
    selectCityOffersSpy.mockReturnValue(mockOffers);
    selectSortedOffersSpy.mockReturnValue(mockOffers);
  });

  const renderMainPage = () => {
    store = mockStore({});
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should dispatch fetchOffersAction on mount', () => {
    renderMainPage();
    expect(offersStore.fetchOffersAction).toHaveBeenCalled();
  });

  it('should render Spinner when data is loading', () => {
    selectIsOffersDataLoadingSpy.mockReturnValue(true);

    renderMainPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument();
  });

  it('should render Error state with Retry button when there is an error', () => {
    const errorMessage = 'Network Error';
    selectOffersErrorSpy.mockReturnValue(errorMessage);

    renderMainPage();

    expect(screen.getByText(/Could not load offers/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(offersStore.fetchOffersAction).toHaveBeenCalledTimes(2);
  });

  it('should render Empty state when there are no offers', () => {
    selectCityOffersSpy.mockReturnValue([]);
    selectSortedOffersSpy.mockReturnValue([]);

    renderMainPage();

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('map')).not.toBeInTheDocument();
  });

  it('should render Content when offers exist', () => {
    renderMainPage();

    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
    expect(screen.getByTestId('sort-options')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should dispatch setCity when city is changed via CitiesList', () => {
    renderMainPage();

    const changeCityBtn = screen.getByText('Change City');
    fireEvent.click(changeCityBtn);

    expect(offersStore.setCity).toHaveBeenCalledWith(CITIES[1]);
  });

  it('should update active offer on map when hovering an offer card', () => {
    renderMainPage();

    const map = screen.getByTestId('map');
    expect(map).toHaveTextContent('Selected: None');

    fireEvent.click(screen.getByText('Hover Offer'));
    expect(map).toHaveTextContent('Selected: offer-1');

    fireEvent.click(screen.getByText('Leave Offer'));
    expect(map).toHaveTextContent('Selected: None');
  });

  it('should update sorted offers when sort option changes', () => {
    renderMainPage();

    fireEvent.click(screen.getByText('Change Sort'));

    expect(selectSortedOffersSpy).toHaveBeenCalledWith(expect.anything(), SortOption.PriceLowToHigh);
  });
});
