import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFoundPage from './not-found-page';
import { withHistory } from '../../utils/mock-component';

describe('Page: NotFoundPage', () => {
  it('should render the correct content (Title, Image, Link)', () => {
    const expectedHeaderText = '404 Page Not Found';
    const expectedLinkText = 'Go back to the main page';
    const expectedAltText = 'Animated graphic indicating a page is not found';

    render(withHistory(<NotFoundPage />));

    expect(screen.getByText(expectedHeaderText)).toBeInTheDocument();
    expect(screen.getByAltText(expectedAltText)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: expectedLinkText })).toBeInTheDocument();
  });

  it('should contain a link that navigates to the root route', () => {
    render(withHistory(<NotFoundPage />));

    const link = screen.getByRole('link', { name: /Go back to the main page/i });

    expect(link).toHaveAttribute('href', '/');
  });
});
