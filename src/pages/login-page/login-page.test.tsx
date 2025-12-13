import { render, screen, fireEvent } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import LoginPage from './index';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus, CITIES, RequestStatus, NameSpace } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { setCity } from '../../store/offers/offers-slice';
import { makeFakeUser } from '../../utils/mocks';
import { loginAction } from '../../store/user';
import { State } from '../../types/state';

const makeMockUserState = (userStateOverrides: Partial<State[NameSpace.User]> = {}): Partial<State> => ({
  [NameSpace.User]: {
    authorizationStatus: AuthorizationStatus.NoAuth,
    user: null,
    requestStatus: RequestStatus.Idle,
    ...userStateOverrides
  }
});

vi.mock('../../store/user', async () => {
  const actual = await vi.importActual<typeof import('../../store/user')>('../../store/user');
  return {
    ...actual,
    loginAction: vi.fn(),
  };
});

describe('Page: LoginPage', () => {
  it('should render correctly when user is NOT authorized', () => {
    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByAltText('6 cities logo')).toBeInTheDocument();

    const cityLink = screen.getByRole('link', { name: /^[a-zA-Z\s]+$/ });
    expect(cityLink).toBeInTheDocument();
    expect(CITIES).toContain(cityLink.textContent);
  });

  it('should redirect to Main Page when user IS authorized', () => {
    const componentWithRouting = (
      <Routes>
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route path={AppRoute.Main} element={<h1>Main Page Redirected</h1>} />
      </Routes>
    );

    const { withStoreComponent } = withStore(
      withHistory(componentWithRouting, [AppRoute.Login]),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.Auth,
        user: makeFakeUser(),
        requestStatus: RequestStatus.Success,
      })
    );

    render(withStoreComponent);

    expect(screen.getByText('Main Page Redirected')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('should dispatch "setCity" action when clicking the random city link', () => {
    const { withStoreComponent, mockStore } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    const cityLink = screen.getByRole('link', { name: /^[a-zA-Z\s]+$/ });
    const renderedCityName = cityLink.textContent;

    fireEvent.click(cityLink);

    const actions = mockStore.getActions();

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(setCity.type);
    expect(actions[0].payload).toBe(renderedCityName);
  });

  it('should display error message if email or password are empty on submit', () => {
    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    fireEvent.submit(screen.getByTestId('login-form'));

    expect(screen.getByTestId('login-error')).toHaveTextContent('Email and password should not be empty.');
  });

  it('should display error message if password does not contain at least one letter and one number', () => {
    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'passwordonly' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    expect(screen.getByTestId('login-error')).toHaveTextContent('Password must contain at least one letter and one number.');

    fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123456' } });
    fireEvent.submit(screen.getByTestId('login-form'));
    expect(screen.getByTestId('login-error')).toHaveTextContent('Password must contain at least one letter and one number.');
  });

  it('should dispatch loginAction and handle success if inputs are valid', () => {
    const mockUnwrap = vi.fn().mockResolvedValue({});
    (loginAction as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      type: 'user/login',
      unwrap: mockUnwrap
    });

    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'test1' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    expect(loginAction).toHaveBeenCalledWith({ login: 'test@test.com', password: 'test1' });
    expect(mockUnwrap).toHaveBeenCalled();
    expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
  });

  it('should display server error message if login action fails', async () => {
    const mockUnwrap = vi.fn().mockRejectedValue('Server error message');
    (loginAction as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      type: 'user/login',
      unwrap: mockUnwrap
    });

    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />),
      makeMockUserState({
        authorizationStatus: AuthorizationStatus.NoAuth,
      })
    );

    render(withStoreComponent);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'test1' } });
    fireEvent.submit(screen.getByTestId('login-form'));

    await screen.findByTestId('login-error');

    expect(screen.getByTestId('login-error')).toHaveTextContent('Server error message');
  });
});
