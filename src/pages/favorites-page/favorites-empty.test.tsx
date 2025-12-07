import { render, screen } from '@testing-library/react';
import FavoritesEmpty from './favorites-empty';

describe('Component: FavoritesEmpty', () => {
  it('should render correct status text', () => {
    const expectedHeader = 'Favorites (empty)';
    const expectedStatus = 'Nothing yet saved.';
    const expectedDescription = 'Save properties to narrow down search or plan your future trips.';

    render(<FavoritesEmpty />);

    expect(screen.getByText(expectedHeader)).toBeInTheDocument();
    expect(screen.getByText(expectedStatus)).toBeInTheDocument();
    expect(screen.getByText(expectedDescription)).toBeInTheDocument();
  });
});
