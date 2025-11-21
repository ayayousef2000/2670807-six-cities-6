import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CITIES } from '../const';
import { Offer } from '../types/offer';
import { fetchOffersAction } from './api-actions';

interface OffersState {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  city: CITIES[0],
  offers: [],
  isOffersDataLoading: false,
  error: null,
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
        state.error = null;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.isOffersDataLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state, action) => {
        if (action.error.message === 'Aborted') {
          return;
        }
        state.isOffersDataLoading = false;
        state.error = action.payload || action.error.message || 'Unknown error occurred';
      });
  },
});

export const { setCity } = offersSlice.actions;

export default offersSlice.reducer;
