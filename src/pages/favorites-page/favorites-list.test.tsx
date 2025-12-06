import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FavoritesList from './favorites-list';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

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
});
