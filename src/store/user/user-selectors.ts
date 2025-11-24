import { AuthorizationStatus, NameSpace, RequestStatus } from '../../const';
import { State } from '../../types/state';
import { UserData } from '../../types/user-data';

export const selectAuthorizationStatus = (state: State): AuthorizationStatus =>
  state[NameSpace.User].authorizationStatus;

export const selectUser = (state: State): UserData | null =>
  state[NameSpace.User].user;

export const selectUserRequestStatus = (state: State): RequestStatus =>
  state[NameSpace.User].requestStatus;
