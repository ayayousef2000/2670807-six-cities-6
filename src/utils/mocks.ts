import { faker } from '@faker-js/faker';
import { UserData } from '../types/user-data';
import { Offer } from '../types/offer';
import { Review } from '../types/review';

export const makeFakeUser = (): UserData => ({
  name: faker.person.fullName(),
  avatarUrl: faker.image.avatar(),
  isPro: faker.datatype.boolean(),
  email: faker.internet.email(),
  token: faker.string.alphanumeric(20),
});

export const makeFakeOffer = (isFavorite = false): Offer => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  type: faker.helpers.arrayElement(['apartment', 'room', 'house', 'hotel']),
  price: faker.number.int({ min: 100, max: 1000 }),
  previewImage: faker.image.url(),
  images: [faker.image.url(), faker.image.url(), faker.image.url()],
  city: {
    name: faker.location.city(),
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zoom: 10,
    },
  },
  location: {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    zoom: 10,
  },
  isFavorite: isFavorite,
  isPremium: faker.datatype.boolean(),
  rating: faker.number.int({ min: 1, max: 5 }),
  bedrooms: faker.number.int({ min: 1, max: 5 }),
  maxAdults: faker.number.int({ min: 1, max: 10 }),
  goods: [faker.lorem.word(), faker.lorem.word()],
  host: {
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
    isPro: faker.datatype.boolean(),
  },
  description: faker.lorem.paragraph(),
});

export const makeFakeReview = (): Review => ({
  id: faker.string.uuid(),
  date: faker.date.recent().toISOString(),
  user: makeFakeUser(),
  comment: faker.lorem.sentences(2),
  rating: faker.number.int({ min: 1, max: 5 }),
});
