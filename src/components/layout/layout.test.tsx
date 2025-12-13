import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Layout from './layout';
import { NameSpace, RequestStatus, AuthorizationStatus } from '../../const';
import { withHistory, withStore } from '../../utils/mock-component';
import { makeFakeOffer } from '../../utils/mocks';
import { AppRoute } from '../../app/routes';

vi.mock('../header', () => ({
  default: () => <header data-testid="header-mock">Header Component</header>,
}));

describe('Component: Layout', () => {
  const defaultState = {
    [NameSpace.Favorites]: { favorites: [], requestStatus: RequestStatus.Idle },
    [NameSpace.User]: { authorizationStatus: AuthorizationStatus.Unknown, user: null, requestStatus: RequestStatus.Idle }
  };

  it('should render Header and Outlet content', () => {
    const expectedContent = 'Content from Outlet';

    const { withStoreComponent } = withStore(
      withHistory(
        <Routes>
          <Route path={AppRoute.Main} element={<Layout />}>
            <Route index element={<span data-testid="outlet-content">{expectedContent}</span>} />
          </Route>
        </Routes>
      ),
      defaultState
    );

    render(withStoreComponent);

    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-content')).toHaveTextContent(expectedContent);
    expect(screen.getByTestId('layout-container')).toBeInTheDocument();
  });

  it('should apply special classes for the Main page', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Layout />, [AppRoute.Main]),
      defaultState
    );

    render(withStoreComponent);

    const layoutWrapper = screen.getByTestId('layout-container');
    expect(layoutWrapper).toHaveClass('page', 'page--gray', 'page--main');
  });

  it('should not apply special classes for Login page', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Layout />, [AppRoute.Login]),
      defaultState
    );

    render(withStoreComponent);

    const layoutWrapper = screen.getByTestId('layout-container');
    expect(layoutWrapper).toHaveClass('page');
    expect(layoutWrapper).not.toHaveClass('page--gray');
    expect(layoutWrapper).not.toHaveClass('page--main');
  });

  it('should apply "page--favorites-empty" class when on Favorites page with NO favorites', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Layout />, [AppRoute.Favorites]),
      {
        ...defaultState,
        [NameSpace.Favorites]: { favorites: [], requestStatus: RequestStatus.Success }
      }
    );

    render(withStoreComponent);

    const layoutWrapper = screen.getByTestId('layout-container');
    expect(layoutWrapper).toHaveClass('page', 'page--favorites-empty');
  });

  it('should NOT apply "page--favorites-empty" class when on Favorites page WITH favorites', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Layout />, [AppRoute.Favorites]),
      {
        ...defaultState,
        [NameSpace.Favorites]: {
          favorites: [makeFakeOffer()],
          requestStatus: RequestStatus.Success
        }
      }
    );

    render(withStoreComponent);

    const layoutWrapper = screen.getByTestId('layout-container');
    expect(layoutWrapper).toHaveClass('page');
    expect(layoutWrapper).not.toHaveClass('page--favorites-empty');
  });
});
