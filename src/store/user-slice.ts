import { createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const';
import { UserData } from '../types/user-data';
import { checkAuthAction, loginAction, logoutAction } from './api-actions';

export enum RequestStatus {
  Idle = 'IDLE',
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Failed = 'FAILED',
}

interface UserState {
  authorizationStatus: AuthorizationStatus;
  user: UserData | null;
  requestStatus: RequestStatus;
}

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  requestStatus: RequestStatus.Idle,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(loginAction.pending, (state) => {
        state.requestStatus = RequestStatus.Pending;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.user = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(logoutAction.pending, (state) => {
        state.requestStatus = RequestStatus.Pending;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.requestStatus = RequestStatus.Success;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      })
      .addCase(logoutAction.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      });
  },
});
