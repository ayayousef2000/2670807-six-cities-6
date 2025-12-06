import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Layout from './index';
import { AppRoute } from '../../app/routes';
import { withHistory } from '../../utils/mock-component';

vi.mock('../header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

describe('Component: Layout', () => {
  it('should apply special classes for the Main page', () => {
    const component = withHistory(<Layout />, [AppRoute.Main]);

    render(component);

    const layoutWrapper = screen.getByTestId('header').parentElement;
    expect(layoutWrapper).toHaveClass('page', 'page--gray', 'page--main');
  });

  it('should not apply special classes for other pages', () => {
    const component = withHistory(<Layout />, [AppRoute.Login]);

    render(component);

    const layoutWrapper = screen.getByTestId('header').parentElement;
    expect(layoutWrapper).toHaveClass('page');
    expect(layoutWrapper).not.toHaveClass('page--gray');
    expect(layoutWrapper).not.toHaveClass('page--main');
  });
});
