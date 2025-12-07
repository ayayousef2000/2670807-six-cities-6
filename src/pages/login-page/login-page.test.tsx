import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../../services/api';
import LoginPage from './index';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus, CITIES } from '../../const';
import { State } from '../../types/state';
import * as UserSelectors from '../../store/user/user-selectors';
import * as OffersActions from '../../store/offers/offers-slice';

vi.mock('../../components/login-form', () => ({
  default: () => <div data-testid="login-form">Login Form Component</div>,
}));

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middlewares);

describe('Page: LoginPage', () => {
  let store: ReturnType<typeof mockStore>;
  const selectAuthStatusSpy = vi.spyOn(UserSelectors, 'selectAuthorizationStatus');
  const setCitySpy = vi.spyOn(OffersActions, 'setCity');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    store = mockStore({} as State);
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Login]}>
          <Routes>
            <Route path={AppRoute.Login} element={<LoginPage />} />
            <Route path={AppRoute.Main} element={<h1>Main Page Redirected</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render correctly when user is NOT authorized', () => {
    selectAuthStatusSpy.mockReturnValue(AuthorizationStatus.NoAuth);

    renderLoginPage();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    const cityLink = screen.getByRole('link', { name: /^[a-zA-Z\s]+$/ });
    expect(cityLink).toBeInTheDocument();
    expect(CITIES).toContain(cityLink.textContent);

    expect(screen.getByAltText('6 cities logo')).toBeInTheDocument();
  });

  it('should redirect to Main Page when user IS authorized', () => {
    selectAuthStatusSpy.mockReturnValue(AuthorizationStatus.Auth);

    renderLoginPage();

    expect(screen.getByText('Main Page Redirected')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('should dispatch setCity action when clicking the random city link', () => {
    selectAuthStatusSpy.mockReturnValue(AuthorizationStatus.NoAuth);

    renderLoginPage();

    const cityLink = screen.getByRole('link', { name: /^[a-zA-Z\s]+$/ });
    const renderedCityName = cityLink.textContent;

    fireEvent.click(cityLink);

    expect(setCitySpy).toHaveBeenCalledTimes(1);
    expect(setCitySpy).toHaveBeenCalledWith(renderedCityName);
  });
});
