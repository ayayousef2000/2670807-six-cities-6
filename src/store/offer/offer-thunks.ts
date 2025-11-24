import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { APIRoute } from '../../const';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
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

export const fetchReviewsAction = createAsyncThunk<
  Review[],
  string,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('offer/fetchReviews', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
  return data;
});

export const fetchNearbyAction = createAsyncThunk<
  Offer[],
  string,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('offer/fetchNearby', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`);
  return data;
});

export const postCommentAction = createAsyncThunk<
  Review,
  { offerId: string; comment: string; rating: number },
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>('offer/postComment', async ({ offerId, comment, rating }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<Review>(`${APIRoute.Comments}/${offerId}`, { comment, rating });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
      return rejectWithValue('UNAUTHORIZED');
    }
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to post comment');
  }
});
