import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Map, TileLayer } from 'leaflet';
import { City } from '../types/offer';
import { TILE_LAYER_ATTRIBUTION, TILE_LAYER_URL_PATTERN } from '../const';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  city: City
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        zoom: city.location.zoom,
      });

      const layer = new TileLayer(
        TILE_LAYER_URL_PATTERN,
        {
          attribution: TILE_LAYER_ATTRIBUTION,
        }
      );

      instance.addLayer(layer);

      if (isMounted) {
        setMap(instance);
        isRenderedRef.current = true;
      }
    }

    return () => {
      isMounted = false;
    };
  }, [mapRef, city]);

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
