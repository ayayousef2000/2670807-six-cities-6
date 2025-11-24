import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { APIRoute } from '../../const';
import { Offer } from '../../types/offer';
import { AppDispatch, State } from '../../types/state';

interface CommonError {
  message: string;
}

export const fetchOfferAction = createAsyncThunk<
  Offer,
  string,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('offer/fetchOffer', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
      return rejectWithValue('NOT_FOUND');
    }
    return rejectWithValue('Failed to fetch offer');
  }
});
