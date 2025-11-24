import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CITIES, NameSpace } from '../../const';
import { Offer } from '../../types/offer';
import { fetchOffersAction } from './offers-thunks';

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
  name: NameSpace.Offers,
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
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.isOffersDataLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.isOffersDataLoading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { setCity } = offersSlice.actions;
