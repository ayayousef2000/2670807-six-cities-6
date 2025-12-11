import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from './index';
import { loginAction } from '../../store/user';

const mockDispatch = vi.fn();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../store/user', () => ({
  loginAction: vi.fn(),
}));

const MOCK_LOGIN_DATA = {
  validEmail: 'user@test.com',
  validPassword: 'password123',
  emptyErrorText: 'Email and Password are required.',
  serverErrorText: 'Server unavailable',
  loadingText: 'Signing in...'
};

describe('Component: LoginForm', () => {
  const mockStore = configureStore({
    reducer: {
      user: (state: { authorizationStatus: string } = { authorizationStatus: 'UNKNOWN' }) => state,
    },
  });

  const renderLoginForm = () =>
    render(
      <Provider store={mockStore}>
        <LoginForm />
      </Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with initial state', () => {
    renderLoginForm();

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    await user.type(emailInput, MOCK_LOGIN_DATA.validEmail);
    await user.type(passwordInput, MOCK_LOGIN_DATA.validPassword);

    expect(emailInput).toHaveValue(MOCK_LOGIN_DATA.validEmail);
    expect(passwordInput).toHaveValue(MOCK_LOGIN_DATA.validPassword);
  });

  it('should display error and not dispatch action if fields are empty', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(screen.getByTestId('login-error')).toHaveTextContent(MOCK_LOGIN_DATA.emptyErrorText);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should clear error message when user resumes typing', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Sign in/i }));
    expect(screen.getByTestId('login-error')).toBeInTheDocument();

    await user.type(screen.getByTestId('email-input'), 'a');
    expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
  });

  it('should dispatch "loginAction" and set loading state when form is valid', async () => {
    mockDispatch.mockReturnValue({ unwrap: () => new Promise(() => {}) });

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByTestId('email-input'), MOCK_LOGIN_DATA.validEmail);
    await user.type(screen.getByTestId('password-input'), MOCK_LOGIN_DATA.validPassword);

    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(loginAction).toHaveBeenCalledWith({
      login: MOCK_LOGIN_DATA.validEmail,
      password: MOCK_LOGIN_DATA.validPassword,
    });

    expect(screen.getByRole('button', { name: MOCK_LOGIN_DATA.loadingText })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: MOCK_LOGIN_DATA.loadingText })).toBeDisabled();
    expect(screen.getByTestId('email-input')).toBeDisabled();
  });

  it('should display server error message if loginAction fails', async () => {
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.reject(MOCK_LOGIN_DATA.serverErrorText)
    });

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByTestId('email-input'), MOCK_LOGIN_DATA.validEmail);
    await user.type(screen.getByTestId('password-input'), MOCK_LOGIN_DATA.validPassword);

    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    expect(await screen.findByText(MOCK_LOGIN_DATA.serverErrorText)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sign in/i })).not.toBeDisabled();
  });
});
