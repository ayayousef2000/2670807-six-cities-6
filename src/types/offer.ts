export type City = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

export type Offer = {
  id: number;
  images: string[];
  isPremium: boolean;
  title: string;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: {
    avatarUrl: string;
    name: string;
    isPro: boolean;
  };
  description: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  city: City;
};
