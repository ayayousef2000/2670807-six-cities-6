import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CITIES } from '../const';
import { Offer } from '../types/offer';
import { fetchOffersAction } from './api-actions';

interface OffersState {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  hasError: boolean;
}

const initialState: OffersState = {
  city: CITIES[0],
  offers: [],
  isOffersDataLoading: false,
  hasError: false,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersDataLoading = true;
        state.hasError = false;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.isOffersDataLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersDataLoading = false;
        state.hasError = true;
      });
  },
});

export const { setCity } = offersSlice.actions;

export default offersSlice.reducer;
