import { render, screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Footer from './footer';
import { AppRoute } from '../../app/routes';
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
    expect(linkElement).toHaveAttribute('href', AppRoute.Main);
  });

  it('should redirect to root url when user clicks the logo link', () => {
    const componentWithRouting = withHistory(
      <Routes>
        <Route path="/test" element={<Footer />} />
        <Route path={AppRoute.Main} element={<div>Main Page Target</div>} />
      </Routes>,
      ['/test']
    );

    render(componentWithRouting);

    const linkElement = screen.getByRole('link');
    fireEvent.click(linkElement);

    expect(screen.getByText('Main Page Target')).toBeInTheDocument();
  });
});
