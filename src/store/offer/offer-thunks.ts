import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { APIRoute } from '../../const';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';

interface CommonError {
  message: string;
}

export const fetchOfferAction = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance; rejectValue: string }
>('offer/fetchOffer', async (offerId, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${offerId}`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.status === 404) {
      return rejectWithValue('NOT_FOUND');
    }
    return rejectWithValue('Failed to fetch offer');
  }
});

export const fetchReviewsAction = createAsyncThunk<
  Review[],
  string,
  { extra: AxiosInstance }
>('offer/fetchReviews', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
  return data;
});

export const fetchNearbyAction = createAsyncThunk<
  Offer[],
  string,
  { extra: AxiosInstance }
>('offer/fetchNearby', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${offerId}/nearby`);
  return data;
});

export const postCommentAction = createAsyncThunk<
  Review,
  { offerId: string; comment: string; rating: number },
  { extra: AxiosInstance; rejectValue: string }
>('offer/postComment', async ({ offerId, comment, rating }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<Review>(`${APIRoute.Comments}/${offerId}`, { comment, rating });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<CommonError>;
    if (axiosError.response?.status === 401) {
      return rejectWithValue('UNAUTHORIZED');
    }
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to post comment');
  }
});
