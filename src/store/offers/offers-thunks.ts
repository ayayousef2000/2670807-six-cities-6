import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, AxiosError } from 'axios';
import { APIRoute, NameSpace } from '../../const';
import { Offer } from '../../types/offer';

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance; rejectValue: string }
>(`${NameSpace.Offers}/fetchOffers`, async (_arg, { extra: api, rejectWithValue, signal }) => {
  try {
    const { data } = await api.get<Offer[]>(APIRoute.Offers, { signal });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.code === 'ERR_CANCELED') {
      throw error;
    }

    return rejectWithValue('Failed to load offers.');
  }
});
