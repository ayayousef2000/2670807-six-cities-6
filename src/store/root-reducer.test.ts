import { rootReducer } from './root-reducer';
import { NameSpace } from '../const';

describe('Root Reducer', () => {
  it('should return the initial state for all slices when passed undefined state and unknown action', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toHaveProperty(NameSpace.User);
    expect(result).toHaveProperty(NameSpace.Offers);
    expect(result).toHaveProperty(NameSpace.Offer);
    expect(result).toHaveProperty(NameSpace.Favorites);
    expect(result).toHaveProperty(NameSpace.Reviews);
    expect(result).toHaveProperty(NameSpace.NearPlaces);
  });
});
