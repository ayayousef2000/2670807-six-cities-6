import { userSlice } from './user-slice';
import { checkAuthAction, loginAction, logoutAction } from './user-thunks';
import { AuthorizationStatus, RequestStatus } from '../../const';
import { makeFakeUser } from '../../utils/mocks';

describe('User Slice', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    user: null,
    requestStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = userSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const result = userSlice.reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  describe('checkAuthAction', () => {
    it('should set "Auth" status and user data when fulfilled', () => {
      const mockUser = makeFakeUser();
      const expectedState = {
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        requestStatus: RequestStatus.Idle,
      };

      const result = userSlice.reducer(
        initialState,
        checkAuthAction.fulfilled(mockUser, '', undefined)
      );

      expect(result).toEqual(expectedState);
    });

    it('should set "NoAuth" status and null user when rejected', () => {
      const expectedState = {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Idle,
      };

      const result = userSlice.reducer(
        initialState,
        checkAuthAction.rejected(null, '', undefined)
      );

      expect(result).toEqual(expectedState);
    });
  });

  describe('loginAction', () => {
    it('should set requestStatus to "Loading" when pending', () => {
      const expectedState = {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        requestStatus: RequestStatus.Loading,
      };

      const result = userSlice.reducer(
        initialState,
        loginAction.pending('', { login: 'test', password: '123' })
      );

      expect(result).toEqual(expectedState);
    });

    it('should set "Auth" status and requestStatus "Success" when fulfilled', () => {
      const mockUser = makeFakeUser();
      const expectedState = {
        authorizationStatus: AuthorizationStatus.Auth,
        user: mockUser,
        requestStatus: RequestStatus.Success,
      };

      const result = userSlice.reducer(
        initialState,
        loginAction.fulfilled(mockUser, '', { login: 'test', password: '123' })
      );

      expect(result).toEqual(expectedState);
    });

    it('should set "NoAuth" status and requestStatus "Error" when rejected', () => {
      const expectedState = {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        requestStatus: RequestStatus.Error,
      };

      const result = userSlice.reducer(
        initialState,
        loginAction.rejected(null, '', { login: 'test', password: '123' })
      );

      expect(result).toEqual(expectedState);
    });
  });

  describe('logoutAction', () => {
    it('should set requestStatus to "Loading" when pending', () => {
      const result = userSlice.reducer(initialState, logoutAction.pending('', undefined));
      expect(result.requestStatus).toBe(RequestStatus.Loading);
    });

    it('should set "NoAuth" and requestStatus "Success" when fulfilled', () => {
      const result = userSlice.reducer(initialState, logoutAction.fulfilled(undefined, '', undefined));

      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.user).toBe(null);
      expect(result.requestStatus).toBe(RequestStatus.Success);
    });
  });
});
