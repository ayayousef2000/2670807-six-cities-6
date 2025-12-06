import { render, screen } from '@testing-library/react';
import Footer from './index';
import { withHistory } from '../../utils/mock-component';

describe('Component: Footer', () => {
  it('should render correctly', () => {
    const expectedAltText = '6 cities logo';
    const expectedImgSrc = 'img/logo.svg';
    const preparedComponent = withHistory(<Footer />);

    render(preparedComponent);

    const logoImage = screen.getByAltText<HTMLImageElement>(expectedAltText);
    const linkElement = screen.getByRole('link');

    expect(logoImage).toBeInTheDocument();
    expect(logoImage.getAttribute('src')).toBe(expectedImgSrc);
    expect(linkElement).toBeInTheDocument();
  });
});
