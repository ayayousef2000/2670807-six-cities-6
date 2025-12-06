import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './index';
import { withHistory, withStore } from '../../utils/mock-component';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus, RequestStatus } from '../../const';

vi.mock('../../components/login-form', () => ({
  default: () => <div data-testid="login-form">Login Form Content</div>,
}));

describe('Page: LoginPage', () => {
  it('should render login form and random city link when user is NOT authorized', () => {
    const { withStoreComponent } = withStore(<LoginPage />, {
      user: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Idle
      },
    });
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    const cityLink = screen.getByRole('link', { name: /^[a-zA-Z\s]+$/ });
    expect(cityLink).toBeInTheDocument();
    expect(cityLink).toHaveAttribute('href', AppRoute.Main);
  });

  it('should redirect to Main page if user IS authorized', () => {
    const { withStoreComponent } = withStore(<LoginPage />, {
      user: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: null,
        requestStatus: RequestStatus.Success
      },
    });

    const componentWithRouting = (
      <Routes>
        <Route path={AppRoute.Login} element={withStoreComponent} />
        <Route path={AppRoute.Main} element={<h1>Main Page Redirected</h1>} />
      </Routes>
    );

    const preparedComponent = withHistory(componentWithRouting, [AppRoute.Login]);

    render(preparedComponent);

    expect(screen.getByText('Main Page Redirected')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});
