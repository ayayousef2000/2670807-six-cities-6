import { render, screen, fireEvent } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './index';
import { AppRoute } from '../../app/routes';
import { AuthorizationStatus, CITIES, NameSpace, RequestStatus } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { setCity } from '../../store/offers/offers-slice';
import { makeFakeUser } from '../../utils/mocks';

vi.mock('../../components/login-form', () => ({
  default: () => <div data-testid="login-form">Login Form Component</div>,
}));

describe('Page: LoginPage', () => {
  
  it('should render correctly when user is NOT authorized', () => {
    const { withStoreComponent } = withStore(
      withHistory(<LoginPage />), 
      {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          user: null,
          requestStatus: RequestStatus.Idle,
        }
      }
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
      {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          user: makeFakeUser(),
          requestStatus: RequestStatus.Success,
        }
      }
    );

    render(withStoreComponent);

    expect(screen.getByText('Main Page Redirected')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('should dispatch "setCity" action when clicking the random city link', () => {
    const { withStoreComponent, mockStore } = withStore(
      withHistory(<LoginPage />), 
      {
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          user: null,
          requestStatus: RequestStatus.Idle,
        }
      }
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
});
