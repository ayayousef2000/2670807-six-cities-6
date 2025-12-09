import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './index';
import { AppRoute } from '../../app/routes';
import { withHistory } from '../../utils/mock-component';

vi.mock('../header', () => ({
  default: () => <header data-testid="header-mock">Header Component</header>,
}));

describe('Component: Layout', () => {
  it('should render Header and Outlet content', () => {
    const expectedContent = 'Content from Outlet';
    
    const componentWithRouting = withHistory(
      <Routes>
        <Route path={AppRoute.Main} element={<Layout />}>
          <Route index element={<span data-testid="outlet-content">{expectedContent}</span>} />
        </Route>
      </Routes>
    );

    render(componentWithRouting);

    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toHaveTextContent(expectedContent);
  });

  it('should apply special classes for the Main page (root route)', () => {
    const component = withHistory(<Layout />, [AppRoute.Main]);

    render(component);

    const layoutWrapper = screen.getByTestId('header-mock').parentElement;
    
    expect(layoutWrapper).toHaveClass('page', 'page--gray', 'page--main');
  });

  it('should not apply special classes for other pages (e.g. Login)', () => {
    const component = withHistory(<Layout />, [AppRoute.Login]);

    render(component);

    const layoutWrapper = screen.getByTestId('header-mock').parentElement;
    
    expect(layoutWrapper).toHaveClass('page');
    expect(layoutWrapper).not.toHaveClass('page--gray');
    expect(layoutWrapper).not.toHaveClass('page--main');
  });
});
