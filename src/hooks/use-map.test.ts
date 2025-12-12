import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map } from 'leaflet';
import useMap from './use-map';
import { makeFakeCity } from '../utils/mocks';

vi.mock('leaflet', () => ({
  Map: vi.fn().mockImplementation(() => ({
    addLayer: vi.fn(),
    setView: vi.fn(),
    remove: vi.fn(),
  })),
  TileLayer: vi.fn(),
}));

describe('Hook: useMap', () => {
  const mockCity = makeFakeCity();
  const mockCity2 = makeFakeCity();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null if mapRef.current is null', () => {
    const emptyRef = { current: null };
    const { result } = renderHook(() => useMap(emptyRef, mockCity));

    expect(result.current).toBeNull();
  });

  it('should initialize the map instance when mapRef is valid', () => {
    const mapRef = { current: document.createElement('div') };
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
    expect(result.current?.addLayer).toHaveBeenCalled();
  });

  it('should update the map view when the city changes', () => {
    const mapRef = { current: document.createElement('div') };

    const { result, rerender } = renderHook(
      ({ city }) => useMap(mapRef, city),
      {
        initialProps: { city: mockCity },
      }
    );

    const mapInstance = result.current;

    vi.clearAllMocks();

    rerender({ city: mockCity2 });

    expect(mapInstance?.setView).toHaveBeenCalledTimes(1);
    expect(mapInstance?.setView).toHaveBeenCalledWith(
      {
        lat: mockCity2.location.latitude,
        lng: mockCity2.location.longitude,
      },
      mockCity2.location.zoom
    );
  });
});
