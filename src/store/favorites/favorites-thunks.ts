import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Offer } from '../../types/offer';
import { State, AppDispatch } from '../../types/state';
import { APIRoute } from '../../const';

interface CommonError {
  message: string;
}

export const fetchFavoritesAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'favorites/fetchFavorites',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorite);
    return data;
  }
);

export const changeFavoriteStatusAction = createAsyncThunk<
  Offer,
  { offerId: string; status: number },
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'favorites/changeStatus',
  async ({ offerId, status }, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<Offer>(`${APIRoute.Favorite}/${offerId}/${status}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<CommonError>;

      if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
        return rejectWithValue('UNAUTHORIZED');
      }

      return rejectWithValue(axiosError.response?.data?.message || 'Failed to change favorite status');
    }
  }
);
