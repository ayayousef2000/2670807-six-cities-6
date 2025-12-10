import { describe, it, expect } from 'vitest';
import { NameSpace, AuthorizationStatus, RequestStatus } from '../../const';
import { makeFakeUser } from '../../utils/mocks';
import { selectAuthorizationStatus, selectUser, selectUserRequestStatus } from './user-selectors';
import { State } from '../../types/state';

describe('User Selectors', () => {
  const mockUser = makeFakeUser();
  const state = {
    [NameSpace.User]: {
      authorizationStatus: AuthorizationStatus.Auth,
      user: mockUser,
      requestStatus: RequestStatus.Success,
    },
  } as State;

  it('should return authorization status from state', () => {
    const { authorizationStatus } = state[NameSpace.User];
    const result = selectAuthorizationStatus(state);
    expect(result).toBe(authorizationStatus);
  });

  it('should return user data from state', () => {
    const { user } = state[NameSpace.User];
    const result = selectUser(state);
    expect(result).toEqual(user);
  });

  it('should return request status from state', () => {
    const { requestStatus } = state[NameSpace.User];
    const result = selectUserRequestStatus(state);
    expect(result).toBe(requestStatus);
  });
});
