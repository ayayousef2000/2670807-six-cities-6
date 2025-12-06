import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OfferCard from './index';
import { withHistory } from '../../utils/mock-component';
import { makeFakeOffer } from '../../utils/mocks';

vi.mock('../../hooks/use-favorites', () => ({
  useFavoriteAction: () => ({
    handleFavoriteClick: vi.fn(),
    isFavoriteSubmitting: false,
  }),
}));

describe('Component: OfferCard', () => {
  it('should render correct content for a standard card (not premium)', () => {
    const mockOffer = { ...makeFakeOffer(), isPremium: false };
    const expectedPriceText = `€${mockOffer.price}`;

    const preparedComponent = withHistory(<OfferCard offer={mockOffer} />);
    render(preparedComponent);

    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    expect(screen.getByText(expectedPriceText)).toBeInTheDocument();
    expect(screen.getByText(mockOffer.type)).toBeInTheDocument();

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render "Premium" label when isPremium is true', () => {
    const mockOffer = { ...makeFakeOffer(), isPremium: true };

    const preparedComponent = withHistory(<OfferCard offer={mockOffer} />);
    render(preparedComponent);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should render "In bookmarks" button state when isFavorite is true', () => {
    const mockOffer = { ...makeFakeOffer(), isFavorite: true };

    const preparedComponent = withHistory(<OfferCard offer={mockOffer} />);
    render(preparedComponent);

    const button = screen.getByRole('button');
    const iconSpan = screen.getByText('In bookmarks');

    expect(button).toHaveClass('place-card__bookmark-button--active');
    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan).toHaveClass('visually-hidden');
  });

  it('should render "To bookmarks" button state when isFavorite is false', () => {
    const mockOffer = { ...makeFakeOffer(), isFavorite: false };

    const preparedComponent = withHistory(<OfferCard offer={mockOffer} />);
    render(preparedComponent);

    const button = screen.getByRole('button');
    const iconSpan = screen.getByText('To bookmarks');

    expect(button).not.toHaveClass('place-card__bookmark-button--active');
    expect(iconSpan).toBeInTheDocument();
  });

  it('should render correctly for the "cities" variant (default)', () => {
    const mockOffer = makeFakeOffer();
    const preparedComponent = withHistory(<OfferCard offer={mockOffer} variant="cities" />);

    render(preparedComponent);

    expect(screen.getByRole('article')).toHaveClass('cities__card');
    expect(screen.getByRole('article')).toHaveClass('place-card');

    const image = screen.getByAltText(mockOffer.title);
    expect(image).toHaveAttribute('width', '260');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should render correctly for the "favorites" variant', () => {
    const mockOffer = makeFakeOffer();
    const preparedComponent = withHistory(<OfferCard offer={mockOffer} variant="favorites" />);

    render(preparedComponent);

    expect(screen.getByRole('article')).toHaveClass('favorites__card');

    const image = screen.getByAltText(mockOffer.title);
    expect(image).toHaveAttribute('width', '150');
    expect(image).toHaveAttribute('height', '110');
  });

  it('should render correctly for the "near-places" variant', () => {
    const mockOffer = makeFakeOffer();
    const preparedComponent = withHistory(<OfferCard offer={mockOffer} variant="near-places" />);

    render(preparedComponent);

    expect(screen.getByRole('article')).toHaveClass('near-places__card');
  });
});
