import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { StatusCodes } from 'http-status-codes';
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
    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
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
    if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
      return rejectWithValue('UNAUTHORIZED');
    }
    return rejectWithValue(axiosError.response?.data?.message || 'Failed to post comment');
  }
});

export const changeFavoriteStatusAction = createAsyncThunk<
  Offer,
  { offerId: string; status: number },
  { extra: AxiosInstance; rejectValue: string }
>('offer/changeFavoriteStatus', async ({ offerId, status }, { extra: api, rejectWithValue }) => {
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
});
