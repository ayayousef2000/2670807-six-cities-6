import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { APIRoute, NameSpace } from '../../const';
import { UserData } from '../../types/user-data';
import { AuthData } from '../../types/auth-data';
import { dropToken, saveToken } from '../../services/token';
import { AppDispatch, State } from '../../types/state';

interface ValidationError {
  errorType: string;
  message: string;
  details: {
    property: string;
    value: string;
    messages: string[];
  }[];
}

export const checkAuthAction = createAsyncThunk<
  UserData,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>(`${NameSpace.User}/checkAuth`, async (_arg, { extra: api }) => {
  const { data } = await api.get<UserData>(APIRoute.Login);
  return data;
});

export const loginAction = createAsyncThunk<
  UserData,
  AuthData,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(`${NameSpace.User}/login`, async ({ login: email, password }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ValidationError>;
    if (axiosError.response?.data) {
      const { details, message } = axiosError.response.data;
      if (details && details.length > 0) {
        const allErrors = details.map((detail) => detail.messages).flat();
        return rejectWithValue(allErrors.join('\n'));
      }
      if (message) {
        return rejectWithValue(message);
      }
    }
    return rejectWithValue('Unable to sign in.');
  }
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>(`${NameSpace.User}/logout`, async (_arg, { extra: api }) => {
  try {
    await api.delete(APIRoute.Logout);
  } finally {
    dropToken();
  }
});
