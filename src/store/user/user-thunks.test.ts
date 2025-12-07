import { createAPI } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { PayloadAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { checkAuthAction, loginAction, logoutAction } from './user-thunks';
import { APIRoute } from '../../const';
import { makeFakeUser } from '../../utils/mocks';
import { UserData } from '../../types/user-data';
import { AuthData } from '../../types/auth-data';

vi.mock('../../services/token');

describe('Async actions: User', () => {
  const api = createAPI();
  const mockAxiosAdapter = new MockAdapter(api);
  const middleware = [thunk.withExtraArgument(api)];
  const mockStoreCreator = configureMockStore<State, Action<string>, ThunkDispatch<State, typeof api, Action>>(middleware);

  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({});
  });

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" when server response is 200', async () => {
      const mockUser = makeFakeUser();
      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, mockUser);

      await store.dispatch(checkAuthAction());

      const actions = store.getActions();

      expect(actions[0].type).toBe(checkAuthAction.pending.type);
      expect(actions[1].type).toBe(checkAuthAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<UserData>;
      expect(fulfilledAction.payload).toEqual(mockUser);
    });

    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" when server response is 401', async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(401);

      await store.dispatch(checkAuthAction());

      const actions = store.getActions();

      expect(actions[0].type).toBe(checkAuthAction.pending.type);
      expect(actions[1].type).toBe(checkAuthAction.rejected.type);
    });
  });

  describe('loginAction', () => {
    it('should dispatch "loginAction.pending" and "loginAction.fulfilled" when server response is 200', async () => {
      const mockUser = makeFakeUser();
      const mockAuthData: AuthData = { login: 'test@test.com', password: '123' };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, mockUser);

      await store.dispatch(loginAction(mockAuthData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(loginAction.pending.type);
      expect(actions[1].type).toBe(loginAction.fulfilled.type);

      const fulfilledAction = actions[1] as PayloadAction<UserData>;
      expect(fulfilledAction.payload).toEqual(mockUser);
    });

    it('should dispatch "loginAction.pending" and "loginAction.rejected" with parsing error details when server returns 400 with details', async () => {
      const mockAuthData: AuthData = { login: 'test@test.com', password: '123' };
      const validationResponse = {
        details: [
          { messages: ['Password too short'] },
          { messages: ['Invalid email format'] }
        ]
      };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(400, validationResponse);

      await store.dispatch(loginAction(mockAuthData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(loginAction.pending.type);
      expect(actions[1].type).toBe(loginAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe('Password too short\nInvalid email format');
    });

    it('should dispatch "loginAction.pending" and "loginAction.rejected" with message when server returns 400 with simple message', async () => {
      const mockAuthData: AuthData = { login: 'test@test.com', password: '123' };
      const errorResponse = { message: 'Simple error message' };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(400, errorResponse);

      await store.dispatch(loginAction(mockAuthData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(loginAction.pending.type);
      expect(actions[1].type).toBe(loginAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe('Simple error message');
    });

    it('should dispatch "loginAction.pending" and "loginAction.rejected" with default message on generic error', async () => {
      const mockAuthData: AuthData = { login: 'test@test.com', password: '123' };

      mockAxiosAdapter.onPost(APIRoute.Login).reply(500);

      await store.dispatch(loginAction(mockAuthData));

      const actions = store.getActions();

      expect(actions[0].type).toBe(loginAction.pending.type);
      expect(actions[1].type).toBe(loginAction.rejected.type);

      const rejectedAction = actions[1] as PayloadAction<string>;
      expect(rejectedAction.payload).toBe('Unable to sign in.');
    });
  });

  describe('logoutAction', () => {
    it('should dispatch "logoutAction.pending" and "logoutAction.fulfilled" when server response is 204', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      const actions = store.getActions();

      expect(actions[0].type).toBe(logoutAction.pending.type);
      expect(actions[1].type).toBe(logoutAction.fulfilled.type);
    });
  });
});
