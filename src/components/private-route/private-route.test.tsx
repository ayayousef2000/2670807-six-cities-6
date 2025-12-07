import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrivateRoute } from './index';
import { AuthorizationStatus } from '../../const';
import { useAppSelector } from '../../hooks';
import { withHistory } from '../../utils/mock-component';
import { AppRoute } from '../../app/routes';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../spinner', () => ({
  default: () => <div data-testid="spinner" />,
}));

describe('Component: PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the spinner when authorization status is "Unknown"', () => {
    (useAppSelector as Mock).mockReturnValue(AuthorizationStatus.Unknown);

    const preparedComponent = withHistory(
      <PrivateRoute>
        <span>Private Content</span>
      </PrivateRoute>
    );

    render(preparedComponent);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('should render children when authorization status is "Auth"', () => {
    (useAppSelector as Mock).mockReturnValue(AuthorizationStatus.Auth);

    const preparedComponent = withHistory(
      <PrivateRoute>
        <span>Private Content</span>
      </PrivateRoute>
    );

    render(preparedComponent);

    expect(screen.getByText('Private Content')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('should redirect to the login route when authorization status is "NoAuth"', () => {
    (useAppSelector as Mock).mockReturnValue(AuthorizationStatus.NoAuth);

    const preparedComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Login} element={<h1>Login Page</h1>} />
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <span>Private Content</span>
            </PrivateRoute>
          }
        />
      </Routes>,
      ['/private']
    );

    render(preparedComponent);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });
});
