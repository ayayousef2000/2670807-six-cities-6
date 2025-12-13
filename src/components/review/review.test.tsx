import { render, screen } from '@testing-library/react';
import Review from './review';
import { makeFakeReview } from '../../utils/mocks';

describe('Component: Review', () => {
  it('should render correct user data, formatted date, and comment', () => {
    const mockReview = {
      ...makeFakeReview(),
      user: {
        ...makeFakeReview().user,
        name: 'oliver.conner',
      },
    };
    const expectedName = 'Oliver Conner';
    const expectedDate = new Date(mockReview.date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    render(<Review review={mockReview} />);

    expect(screen.getByText(expectedName)).toBeInTheDocument();
    expect(screen.getByAltText(expectedName)).toHaveAttribute('src', mockReview.user.avatarUrl);
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
    expect(screen.getByText(expectedDate)).toHaveAttribute('dateTime', mockReview.date);
  });
});
