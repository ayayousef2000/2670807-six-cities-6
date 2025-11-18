import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { AppDispatch, RootState } from './';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from '../types/user-data';
import { AuthData } from '../types/auth-data';
import { saveToken, dropToken } from '../services/token';
import { APIRoute } from '../const';

interface ValidationError {
  errorType: string;
  message: string;
  details: {
    property: string;
    value: string;
    messages: string[];
  }[];
}

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('data/fetchOffers', async (_arg, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response && axiosError.response.data) {
      return rejectWithValue(axiosError.response.data.message);
    }
    return rejectWithValue(axiosError.message || 'Failed to fetch offers');
  }
});

export const checkAuthAction = createAsyncThunk<
  UserData,
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<UserData>(APIRoute.Login);
    return data;
  } catch (error) {
    dropToken();
    return rejectWithValue(null);
  }
});

export const loginAction = createAsyncThunk<
  UserData,
  AuthData,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('user/login', async ({ login: email, password }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ValidationError>;

    if (axiosError.response && axiosError.response.data) {
      const responseData = axiosError.response.data;

      if (responseData.details && responseData.details.length > 0) {
        const allErrors = responseData.details
          .map((detail) => detail.messages)
          .flat();

        return rejectWithValue(allErrors.join('\n'));
      }

      if (responseData.message) {
        return rejectWithValue(responseData.message);
      }
    }

    return rejectWithValue('Unable to sign in. Please try again later.');
  }
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('user/logout', async (_arg, { extra: api }) => {
  try {
    await api.delete(APIRoute.Logout);
  } finally {
    dropToken();
  }
});

export const fetchOfferDataAction = createAsyncThunk<
  {
    offer: Offer;
    reviews: Review[];
    nearbyOffers: Offer[];
  },
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('data/fetchOfferData', async (offerId, { extra: api }) => {
  const [offer, reviews, nearbyOffers] = await Promise.all([
    api.get<Offer>(`${APIRoute.Offers}/${offerId}`),
    api.get<Review[]>(`${APIRoute.Comments}/${offerId}`),
    api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`),
  ]);

  return {
    offer: offer.data,
    reviews: reviews.data,
    nearbyOffers: nearbyOffers.data,
  };
});
