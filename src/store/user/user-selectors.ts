import { NameSpace } from '../../const';
import { RootState } from '../index';

export const selectAuthorizationStatus = (state: RootState) => state[NameSpace.User].authorizationStatus;
export const selectUser = (state: RootState) => state[NameSpace.User].user;
export const selectUserRequestStatus = (state: RootState) => state[NameSpace.User].requestStatus;
