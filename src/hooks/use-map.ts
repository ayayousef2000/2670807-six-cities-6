import { useEffect, useState, MutableRefObject } from 'react';
import { Map, TileLayer } from 'leaflet';
import { City } from '../types/offer';
import { TILE_LAYER_URL_PATTERN, TILE_LAYER_ATTRIBUTION } from '../const';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City
): Map | null {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (mapRef.current !== null) {
      const instance = new Map(mapRef.current);
      const layer = new TileLayer(
        TILE_LAYER_URL_PATTERN,
        {
          attribution: TILE_LAYER_ATTRIBUTION,
        }
      );
      instance.addLayer(layer);
      setMap(instance);

      return () => {
        instance.remove();
        setMap(null);
      };
    }
  }, [mapRef]);

  useEffect(() => {
    if (map) {
      map.setView(
        {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        city.location.zoom
      );
    }
  }, [map, city]);

  return map;
}

export default useMap;
