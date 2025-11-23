import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { UserData } from '../../types/user-data';
import { AuthorizationStatus } from '../../const';
import { RequestStatus } from './user-slice';

export const selectAuthorizationStatus = (state: State): AuthorizationStatus =>
  state[NameSpace.User].authorizationStatus;

export const selectUser = (state: State): UserData | null =>
  state[NameSpace.User].user;

export const selectUserRequestStatus = (state: State): RequestStatus =>
  state[NameSpace.User].requestStatus;
