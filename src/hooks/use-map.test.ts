import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map } from 'leaflet';
import useMap from './use-map';
import { makeFakeCity } from '../utils/mocks';
import { City } from '../types/offer';

vi.mock('leaflet', () => {
  const mapInstance = {
    addLayer: vi.fn(),
    setView: vi.fn(),
    remove: vi.fn(),
  };
  return {
    Map: vi.fn(() => mapInstance),
    TileLayer: vi.fn(),
  };
});

describe('Hook: useMap', () => {
  const mockCity = makeFakeCity();
  const mockCity2 = makeFakeCity();
  const mapRef = {
    current: document.createElement('div'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if mapRef.current is null', () => {
    const emptyRef = { current: null };
    const { result } = renderHook(() => useMap(emptyRef, mockCity));

    expect(result.current).toBeNull();
  });

  it('should initialize the map when mapRef is valid', () => {
    const { result } = renderHook(() => useMap(mapRef, mockCity));

    expect(Map).toHaveBeenCalledTimes(1);
    expect(Map).toHaveBeenCalledWith(mapRef.current, {
      center: {
        lat: mockCity.location.latitude,
        lng: mockCity.location.longitude,
      },
      zoom: mockCity.location.zoom,
    });
    expect(result.current).not.toBeNull();
  });

  it('should update the view when the city changes', () => {
    const { result, rerender } = renderHook(
      ({ city }: { city: City }) => useMap(mapRef, city),
      {
        initialProps: { city: mockCity },
      }
    );

    const mapInstance = result.current;

    rerender({ city: mockCity2 });

    expect(mapInstance?.setView).toHaveBeenCalledWith(
      {
        lat: mockCity2.location.latitude,
        lng: mockCity2.location.longitude,
      },
      mockCity2.location.zoom
    );
  });
});
