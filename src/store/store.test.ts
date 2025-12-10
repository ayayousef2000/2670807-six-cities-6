import { describe, it, expect } from 'vitest';
import { store, api } from './index';
import { NameSpace } from '../const';

describe('Store Configuration', () => {
  it('should be initialized with the root reducer', () => {
    const state = store.getState();

    expect(state).toBeDefined();

    expect(state).toHaveProperty(NameSpace.User);
    expect(state).toHaveProperty(NameSpace.Offers);
    expect(state).toHaveProperty(NameSpace.Offer);
    expect(state).toHaveProperty(NameSpace.Favorites);
    expect(state).toHaveProperty(NameSpace.Reviews);
    expect(state).toHaveProperty(NameSpace.NearPlaces);
  });

  it('should export the axios api instance', () => {
    expect(api).toBeDefined();
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.interceptors).toBeDefined();
  });
});
