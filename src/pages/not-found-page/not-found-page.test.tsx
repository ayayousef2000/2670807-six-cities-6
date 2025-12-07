import { render, screen } from '@testing-library/react';
import NotFoundPage from './index';
import { withHistory } from '../../utils/mock-component';

describe('Component: NotFoundPage', () => {
  it('should render correctly', () => {
    const expectedHeaderText = '404 Page Not Found';
    const expectedLinkText = 'Go back to the main page';
    const expectedAltText = 'Animated graphic indicating a page is not found';

    const preparedComponent = withHistory(<NotFoundPage />);
    render(preparedComponent);

    expect(screen.getByText(expectedHeaderText)).toBeInTheDocument();
    expect(screen.getByText(expectedLinkText)).toBeInTheDocument();
    expect(screen.getByAltText(expectedAltText)).toBeInTheDocument();
  });
});
