import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MockStore, configureMockStore } from '@jedmao/redux-mock-store';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AxiosInstance } from 'axios';
import { createAPI } from '../services/api';
import { State } from '../types/state';

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;

export function withHistory(component: JSX.Element, history?: MemoryRouterProps['initialEntries']): JSX.Element {
  return (
    <MemoryRouter initialEntries={history}>
      <HelmetProvider>
        {component}
      </HelmetProvider>
    </MemoryRouter>
  );
}

type ComponentWithMockStore = {
  withStoreComponent: JSX.Element;
  mockStore: MockStore;
  mockAxiosAdapter: AxiosInstance['defaults']['adapter'];
}

export function withStore(
  component: JSX.Element,
  initialState: Partial<State> = {}
): ComponentWithMockStore {
  const axios = createAPI();
  const mockAxiosAdapter = axios.defaults.adapter;
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(initialState);

  return {
    withStoreComponent: <Provider store={mockStore}>{component}</Provider>,
    mockStore,
    mockAxiosAdapter,
  };
}
