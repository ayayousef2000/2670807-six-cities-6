import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../../services/api';
import MainPage from './index';
import { makeFakeOffer } from '../../utils/mocks';
import { CITIES, SortOption } from '../../const';
import * as offersStore from '../../store/offers';
import { State } from '../../types/state';

vi.mock('../../components/cities-list', () => ({
  default: ({ onCityChange }: { onCityChange: (city: string) => void }) => (
    <div data-testid="cities-list">
      <button onClick={() => onCityChange(CITIES[1])}>Select City 2</button>
    </div>
  )
}));

vi.mock('../../components/sort-options', () => ({
  default: ({ onSortChange }: { onSortChange: (sort: string) => void }) => (
    <div data-testid="sort-options">
      <button onClick={() => onSortChange(SortOption.PriceLowToHigh)}>Sort Price</button>
    </div>
  )
}));

vi.mock('../../components/offer-list', () => ({
  default: ({ onCardMouseEnter, onCardMouseLeave }: {
    onCardMouseEnter: (id: string) => void;
    onCardMouseLeave: () => void;
  }) => (
    <div data-testid="offer-list">
      <button onClick={() => onCardMouseEnter('offer-1')}>Hover Offer 1</button>
      <button onClick={() => onCardMouseLeave()}>Leave Offer</button>
    </div>
  )
}));

vi.mock('../../components/map', () => ({
  default: ({ selectedPoint }: { selectedPoint: { id: string } | undefined }) => (
    <div data-testid="map">
      Selected ID: {selectedPoint ? selectedPoint.id : 'None'}
    </div>
  )
}));

vi.mock('../../components/spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock('../../components/main-empty', () => ({
  default: () => <div data-testid="main-empty">No places to stay</div>
}));

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middlewares);

describe('Page: MainPage', () => {
  const mockOffers = [
    { ...makeFakeOffer(), id: 'offer-1', city: { name: CITIES[0], location: { latitude: 0, longitude: 0, zoom: 10 } } },
    { ...makeFakeOffer(), id: 'offer-2', city: { name: CITIES[0], location: { latitude: 0, longitude: 0, zoom: 10 } } }
  ];

  let store: ReturnType<typeof mockStore>;

  const selectCitySpy = vi.spyOn(offersStore, 'selectCity');
  const selectIsOffersDataLoadingSpy = vi.spyOn(offersStore, 'selectIsOffersDataLoading');
  const selectOffersErrorSpy = vi.spyOn(offersStore, 'selectOffersError');
  const selectCityOffersSpy = vi.spyOn(offersStore, 'selectCityOffers');
  const selectSortedOffersSpy = vi.spyOn(offersStore, 'selectSortedOffers');
  const fetchOffersActionSpy = vi.spyOn(offersStore, 'fetchOffersAction');
  const setCitySpy = vi.spyOn(offersStore, 'setCity');

  beforeEach(() => {
    vi.clearAllMocks();
    selectCitySpy.mockReturnValue(CITIES[0]);
    selectIsOffersDataLoadingSpy.mockReturnValue(false);
    selectOffersErrorSpy.mockReturnValue(null);
    selectCityOffersSpy.mockReturnValue(mockOffers);
    selectSortedOffersSpy.mockReturnValue(mockOffers);
  });

  const renderMainPage = () => {
    store = mockStore({} as State);
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
    expect(fetchOffersActionSpy).toHaveBeenCalledTimes(1);
  });

  it('should render Spinner when data is loading', () => {
    selectIsOffersDataLoadingSpy.mockReturnValue(true);
    renderMainPage();

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-list')).not.toBeInTheDocument();
  });

  it('should render Error state with Retry button when there is a fetching error', () => {
    const errorMessage = 'Network Error';
    selectOffersErrorSpy.mockReturnValue(errorMessage);

    renderMainPage();

    expect(screen.getByText(/Could not load offers/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);

    expect(fetchOffersActionSpy).toHaveBeenCalledTimes(2);
  });

  it('should render Empty state when there are no offers', () => {
    selectCityOffersSpy.mockReturnValue([]);
    selectSortedOffersSpy.mockReturnValue([]);

    renderMainPage();

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('map')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sort-options')).not.toBeInTheDocument();
  });

  it('should render standard content (List, Map, Sort) when offers exist', () => {
    renderMainPage();

    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
    expect(screen.getByTestId('sort-options')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByText(/places to stay/i)).toBeInTheDocument();
  });

  it('should dispatch setCity action when a new city is selected', () => {
    renderMainPage();

    const changeCityBtn = screen.getByText('Select City 2');
    fireEvent.click(changeCityBtn);

    expect(setCitySpy).toHaveBeenCalledWith(CITIES[1]);
  });

  it('should update local state and pass activeOfferId to Map on card hover', () => {
    renderMainPage();

    const map = screen.getByTestId('map');

    expect(map).toHaveTextContent('Selected ID: None');

    fireEvent.click(screen.getByText('Hover Offer 1'));
    expect(map).toHaveTextContent('Selected ID: offer-1');

    fireEvent.click(screen.getByText('Leave Offer'));
    expect(map).toHaveTextContent('Selected ID: None');
  });

  it('should trigger re-selection of sorted offers when sort option changes', () => {
    renderMainPage();

    expect(selectSortedOffersSpy).toHaveBeenCalledWith(expect.anything(), SortOption.Popular);

    fireEvent.click(screen.getByText('Sort Price'));

    expect(selectSortedOffersSpy).toHaveBeenCalledWith(expect.anything(), SortOption.PriceLowToHigh);
  });
});
