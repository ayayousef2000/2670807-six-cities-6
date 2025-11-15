import { useRef, useEffect } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../types/offer';
import useMap from '../../hooks/use-map';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '../../const';

type MapProps = {
  city: Offer['city'];
  points: Offer[];
  selectedPoint?: Offer;
  className: string;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

function Map({ city, points, selectedPoint, className }: MapProps): JSX.Element {
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  const markersRef = useRef<Record<number, Marker>>({});

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude
        });

        marker.setIcon(defaultCustomIcon);

        marker.addTo(markerLayer);
        markersRef.current[point.id] = marker;
      });

      return () => {
        map.removeLayer(markerLayer);
        markersRef.current = {};
      };
    }
  }, [map, points]);

  useEffect(() => {
    if (map && Object.keys(markersRef.current).length > 0) {
      Object.values(markersRef.current).forEach((marker) => {
        marker.setIcon(defaultCustomIcon);
      });

      if (selectedPoint) {
        const selectedMarker = markersRef.current[selectedPoint.id];
        if (selectedMarker) {
          selectedMarker.setIcon(currentCustomIcon);
        }
      }
    }
  }, [map, selectedPoint]);

  return <div className={className} ref={mapRef}></div>;
}

export default Map;
