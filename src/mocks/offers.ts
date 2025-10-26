import { Offer } from '../types/offer';

export const offers: Offer[] = [
  {
    id: 1,
    images: ['img/apartment-01.jpg', 'img/room.jpg', 'img/apartment-02.jpg', 'img/apartment-03.jpg', 'img/studio-01.jpg', 'img/apartment-01.jpg'],
    isPremium: true,
    title: 'Beautiful & luxurious studio at great location',
    isFavorite: true,
    rating: 4.8,
    type: 'Apartment',
    bedrooms: 3,
    maxAdults: 4,
    price: 120,
    goods: ['Wi-Fi', 'Washing machine', 'Towels', 'Heating', 'Coffee machine', 'Baby seat', 'Kitchen', 'Dishwasher', 'Cabel TV', 'Fridge'],
    host: {
      avatarUrl: 'img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.\n\nAn independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    }
  },
  {
    id: 2,
    images: ['img/room.jpg', 'img/apartment-01.jpg'],
    isPremium: false,
    title: 'Wood and stone place',
    isFavorite: false,
    rating: 4.2,
    type: 'Room',
    bedrooms: 1,
    maxAdults: 2,
    price: 80,
    goods: ['Wi-Fi', 'Heating', 'Towels'],
    host: {
      avatarUrl: 'img/avatar-max.jpg',
      name: 'Max',
      isPro: false,
    },
    description: 'This is a unique and stylish room in the heart of the city, perfect for a solo traveler or a couple.',
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    }
  },
  {
    id: 3,
    images: ['img/apartment-02.jpg', 'img/apartment-03.jpg', 'img/studio-01.jpg'],
    isPremium: false,
    title: 'Canal View Prinsengracht',
    isFavorite: true,
    rating: 4.9,
    type: 'Apartment',
    bedrooms: 2,
    maxAdults: 3,
    price: 132,
    goods: ['Wi-Fi', 'Kitchen', 'Dishwasher', 'Cabel TV', 'Fridge'],
    host: {
      avatarUrl: 'img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    description: 'Enjoy stunning views of the famous Prinsengracht canal from this modern and spacious apartment.',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198,
      zoom: 16
    },
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    }
  },
  {
    id: 4,
    images: ['img/apartment-03.jpg', 'img/studio-01.jpg', 'img/room.jpg'],
    isPremium: true,
    title: 'Nice, cozy, warm big bed apartment',
    isFavorite: false,
    rating: 5.0,
    type: 'Apartment',
    bedrooms: 1,
    maxAdults: 2,
    price: 180,
    goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Fridge', 'Coffee machine'],
    host: {
      avatarUrl: 'img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    description: 'A luxurious stay awaits you in this premium apartment with all the amenities you could wish for.',
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198,
      zoom: 16
    },
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    }
  }
];
