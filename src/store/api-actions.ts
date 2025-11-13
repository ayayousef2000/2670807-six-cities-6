import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { AxiosInstance } from 'axios';

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('data/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
  return data;
});

export const fetchOfferDataAction = createAsyncThunk<
  { offer: Offer; reviews: Review[]; nearbyOffers: Offer[] },
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>('data/fetchOfferData', async (offerId, { extra: api }) => {
  const [
    { data: offer },
    { data: reviews },
    { data: nearbyOffers },
  ] = await Promise.all([
    api.get<Offer>(`/offers/${offerId}`),
    api.get<Review[]>(`/comments/${offerId}`),
    api.get<Offer[]>(`/offers/${offerId}/nearby`),
  ]);

  return { offer, reviews, nearbyOffers };
});
