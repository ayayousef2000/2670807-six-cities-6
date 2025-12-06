import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OfferList from './index';
import { withHistory } from '../../utils/mock-component';
import { makeFakeOffer } from '../../utils/mocks';
import { Offer } from '../../types/offer';

vi.mock('../offer-card', () => ({
  default: ({ offer }: { offer: Offer }) => (
    <div data-testid="offer-card">{offer.title}</div>
  ),
}));

describe('Component: OfferList', () => {
  it('should render correct number of cards', () => {
    const mockOffers = [makeFakeOffer(), makeFakeOffer(), makeFakeOffer()];
    const preparedComponent = withHistory(<OfferList offers={mockOffers} />);

    render(preparedComponent);

    const cards = screen.getAllByTestId('offer-card');
    expect(cards).toHaveLength(mockOffers.length);
  });

  it('should render with correct class for cities variant', () => {
    const mockOffers = [makeFakeOffer()];
    const preparedComponent = withHistory(<OfferList offers={mockOffers} variant="cities" />);

    const { container } = render(preparedComponent);
    const listElement = container.querySelector('.cities__places-list');

    expect(listElement).toBeInTheDocument();
    expect(listElement).toHaveClass('places__list', 'tabs__content');
  });

  it('should render with correct class for near-places variant', () => {
    const mockOffers = [makeFakeOffer()];
    const preparedComponent = withHistory(<OfferList offers={mockOffers} variant="near-places" />);

    const { container } = render(preparedComponent);
    const listElement = container.querySelector('.near-places__list');

    expect(listElement).toBeInTheDocument();
    expect(listElement).toHaveClass('places__list');
  });
});
