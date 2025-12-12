import { describe, it, expect } from 'vitest';
import { NameSpace, RequestStatus } from '../../const';
import { makeFakeOffer } from '../../utils/mocks';
import {
  selectOffer,
  selectOfferStatus,
  selectOfferPageMapPoints
} from './offer-selectors';
import { State } from '../../types/state';

describe('Offer Selectors', () => {
  const currentOffer = { ...makeFakeOffer(), id: 'current', title: 'Main Offer' };
  const nearbyOffer1 = { ...makeFakeOffer(), id: 'nearby1' };
  const nearbyOffer2 = { ...makeFakeOffer(), id: 'nearby2' };

  const state = {
    [NameSpace.Offer]: {
      offer: currentOffer,
      offerStatus: RequestStatus.Success,
    },
    [NameSpace.NearPlaces]: {
      nearPlaces: [nearbyOffer1, nearbyOffer2],
      nearPlacesStatus: RequestStatus.Success,
    },
  } as unknown as State;

  it('should return the current offer', () => {
    const result = selectOffer(state);
    expect(result).toEqual(currentOffer);
  });

  it('should return the offer status', () => {
    const result = selectOfferStatus(state);
    expect(result).toBe(RequestStatus.Success);
  });

  describe('selectOfferPageMapPoints', () => {
    it('should return nearby places + current offer combined', () => {
      const result = selectOfferPageMapPoints(state);

      expect(result).toHaveLength(3);
      expect(result).toContainEqual(currentOffer);
      expect(result).toContainEqual(nearbyOffer1);
      expect(result).toContainEqual(nearbyOffer2);
    });

    it('should not duplicate the current offer if it is already in nearby places', () => {
      const weirdState = {
        [NameSpace.Offer]: { offer: currentOffer },
        [NameSpace.NearPlaces]: { nearPlaces: [nearbyOffer1, currentOffer] }
      } as unknown as State;

      const result = selectOfferPageMapPoints(weirdState);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(currentOffer);
      expect(result).toContainEqual(nearbyOffer1);
    });

    it('should return only nearby places if current offer is null', () => {
      const emptyOfferState = {
        [NameSpace.Offer]: { offer: null },
        [NameSpace.NearPlaces]: { nearPlaces: [nearbyOffer1] }
      } as unknown as State;

      const result = selectOfferPageMapPoints(emptyOfferState);

      expect(result).toHaveLength(1);
      expect(result).toEqual([nearbyOffer1]);
    });
  });
});
