import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { PrivateRoute } from './index';
import { withHistory } from '../../utils/mock-component';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus } from '../../const';
import { useAppSelector } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

describe('Component: PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render spinner when status is Unknown', () => {
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

  it('should render children when status is Auth', () => {
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

  it('should redirect to login when status is NoAuth', () => {
    (useAppSelector as Mock).mockReturnValue(AuthorizationStatus.NoAuth);
    const publicRoute = <h1>Login Page</h1>;
    const privateRoute = (
      <PrivateRoute>
        <span>Private Content</span>
      </PrivateRoute>
    );

    const componentWithRouting = (
      <Routes>
        <Route path={AppRoute.Login} element={publicRoute} />
        <Route path="/private" element={privateRoute} />
      </Routes>
    );

    const preparedComponent = withHistory(componentWithRouting, ['/private']);

    render(preparedComponent);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });
});
