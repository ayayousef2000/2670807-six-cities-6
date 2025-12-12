import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FavoritesList from './favorites-list';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';
import { setCity } from '../../store/offers/offers-slice';

vi.mock('../../components/offer-card', () => ({
  default: ({ offer }: { offer: Offer }) => (
    <article data-testid="offer-card">{offer.title}</article>
  ),
}));

describe('Component: FavoritesList', () => {
  it('should render grouped favorites by city', () => {
    const cityOne = 'Paris';
    const cityTwo = 'Cologne';
    const offerOne = { ...makeFakeOffer(), title: 'Paris Hotel' };
    const offerTwo = { ...makeFakeOffer(), title: 'Cologne Apartment' };

    const mockFavoritesByCity: Record<string, Offer[]> = {
      [cityOne]: [offerOne],
      [cityTwo]: [offerTwo],
    };

    const { withStoreComponent } = withStore(
      <FavoritesList favoritesByCity={mockFavoritesByCity} />
    );
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    expect(screen.getByText(cityOne)).toBeInTheDocument();
    expect(screen.getByText(cityTwo)).toBeInTheDocument();

    const cityLinks = screen.getAllByRole('link');
    expect(cityLinks).toHaveLength(2);

    expect(screen.getByText(offerOne.title)).toBeInTheDocument();
    expect(screen.getByText(offerTwo.title)).toBeInTheDocument();
  });

  it('should dispatch "setCity" action when clicking on a city link', () => {
    const targetCity = 'Amsterdam';
    const offer = makeFakeOffer();
    const mockFavoritesByCity = {
      [targetCity]: [offer],
    };

    const { withStoreComponent, mockStore } = withStore(
      <FavoritesList favoritesByCity={mockFavoritesByCity} />
    );
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    const cityLink = screen.getByRole('link', { name: targetCity });
    fireEvent.click(cityLink);

    const actions = mockStore.getActions();

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(setCity.type);
    expect(actions[0].payload).toBe(targetCity);
  });
});
