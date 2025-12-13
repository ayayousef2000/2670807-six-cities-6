import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewsList from './reviews-list';
import { withHistory } from '../../utils/mock-component';
import { makeFakeReview } from '../../utils/mocks';
import { Review } from '../../types/review';

vi.mock('../review', () => ({
  default: ({ review }: { review: Review }) => (
    <div data-testid="review-item">{review.comment}</div>
  ),
}));

describe('Component: ReviewsList', () => {
  it('should render correct number of reviews', () => {
    const mockReviews = [makeFakeReview(), makeFakeReview(), makeFakeReview()];
    const preparedComponent = withHistory(<ReviewsList reviews={mockReviews} />);

    render(preparedComponent);

    const items = screen.getAllByTestId('review-item');
    expect(items).toHaveLength(mockReviews.length);
  });
});
