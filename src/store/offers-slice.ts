import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CITIES } from '../const';
import { offers } from '../mocks/offers';
import { Offer } from '../types/offer';

interface OffersState {
  city: string;
  offers: Offer[];
}

const initialState: OffersState = {
  city: CITIES[0],
  offers: offers,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    loadOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
  },
});

export const { setCity, loadOffers } = offersSlice.actions;

export default offersSlice.reducer;
