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

interface CommonError {
  errorType: string;
  message: string;
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
    const axiosError = error as AxiosError<CommonError>;
    if (!axiosError.response) {
      return rejectWithValue('Unable to connect to the server. Please try again later.');
    }
    return rejectWithValue(axiosError.response.data?.message || 'Failed to load offers.');
  }
});

export const fetchOfferAction = createAsyncThunk<
  Offer,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('data/fetchOffer', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;

    if (axiosError.response?.status === 404) {
      return rejectWithValue('NOT_FOUND');
    }

    if (axiosError.response?.data) {
      return rejectWithValue(axiosError.response.data.message);
    }
    return rejectWithValue('Failed to fetch offer');
  }
});

export const fetchReviewsAction = createAsyncThunk<
  Review[],
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('data/fetchReviews', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.data) {
      return rejectWithValue(axiosError.response.data.message);
    }
    return rejectWithValue('Failed to fetch reviews');
  }
});

export const fetchNearbyAction = createAsyncThunk<
  Offer[],
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('data/fetchNearby', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.data) {
      return rejectWithValue(axiosError.response.data.message);
    }
    return rejectWithValue('Failed to fetch nearby offers');
  }
});

export const postCommentAction = createAsyncThunk<
  Review,
  { offerId: string; comment: string; rating: number },
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('data/postComment', async ({ offerId, comment, rating }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<Review>(`${APIRoute.Comments}/${offerId}`, { comment, rating });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ValidationError>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      if (status === 400 && data.details && data.details.length > 0) {
        const errorMessages = data.details.map((detail) => detail.messages).flat();
        return rejectWithValue(errorMessages.join('. '));
      }

      if (status === 401) {
        return rejectWithValue('You are not authorized. Please log in.');
      }

      if (status === 404) {
        return rejectWithValue('This offer does not exist anymore.');
      }

      if (data.message) {
        return rejectWithValue(data.message);
      }
    }

    return rejectWithValue('Failed to post comment. Please try again.');
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

    if (axiosError.response?.data) {
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
