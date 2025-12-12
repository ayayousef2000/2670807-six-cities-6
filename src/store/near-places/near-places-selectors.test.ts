import { describe, it, expect } from 'vitest';
import { NameSpace, RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import {
  selectNearPlaces,
  selectNearPlacesStatus,
  selectNearPlacesToRender
} from './near-places-selectors';
import { State } from '../../types/state';

describe('NearPlaces Selectors', () => {
  const mockOffer1 = { ...makeFakeOffer(), id: '1' };
  const mockOffer2 = { ...makeFakeOffer(), id: '2' };
  const mockOffer3 = { ...makeFakeOffer(), id: '3' };
  const mockOffer4 = { ...makeFakeOffer(), id: '4' };

  const state = {
    [NameSpace.NearPlaces]: {
      nearPlaces: [mockOffer1, mockOffer2, mockOffer3, mockOffer4],
      nearPlacesStatus: RequestStatus.Success,
    },
  } as unknown as State;

  it('should return all near places from state', () => {
    const result = selectNearPlaces(state);
    expect(result).toHaveLength(4);
    expect(result).toEqual([mockOffer1, mockOffer2, mockOffer3, mockOffer4]);
  });

  it('should return the request status', () => {
    const result = selectNearPlacesStatus(state);
    expect(result).toBe(RequestStatus.Success);
  });

  describe('selectNearPlacesToRender', () => {
    it('should return only the first 3 near places', () => {
      const result = selectNearPlacesToRender(state);

      expect(result).toHaveLength(3);
      expect(result).toEqual([mockOffer1, mockOffer2, mockOffer3]);
      expect(result).not.toContain(mockOffer4);
    });

    it('should return all offers if there are fewer than 3', () => {
      const smallState = {
        [NameSpace.NearPlaces]: {
          nearPlaces: [mockOffer1, mockOffer2],
          nearPlacesStatus: RequestStatus.Success,
        },
      } as unknown as State;

      const result = selectNearPlacesToRender(smallState);

      expect(result).toHaveLength(2);
      expect(result).toEqual([mockOffer1, mockOffer2]);
    });
  });
});
