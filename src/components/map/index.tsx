import { useRef, useEffect, memo } from 'react';
import { Icon, Marker, layerGroup, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../types/offer';
import useMap from '../../hooks/use-map';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '../../const';

type MapProps = {
  city: Offer['city'];
  points: Offer[];
  selectedPoint: Offer | undefined;
  className?: string;
  style?: React.CSSProperties;
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

function MapComponent({ city, points, selectedPoint, className = 'map', style }: MapProps): JSX.Element {
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  const markerLayer = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (map) {
      map.setView(
        {
          lat: city.location.latitude,
          lng: city.location.longitude
        },
        city.location.zoom
      );
    }
  }, [map, city]);

  useEffect(() => {
    if (map) {
      if (!markerLayer.current) {
        markerLayer.current = layerGroup().addTo(map);
      } else {
        markerLayer.current.clearLayers();
      }

      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude
        });

        const isSelected = selectedPoint && point.id === selectedPoint.id;

        marker.setIcon(isSelected ? currentCustomIcon : defaultCustomIcon);

        if (isSelected) {
          marker.setZIndexOffset(1000);
        }

        marker.addTo(markerLayer.current as LayerGroup);
      });
    }
  }, [map, points, selectedPoint]);

  return (
    <section
      className={className}
      ref={mapRef}
      style={style}
    />
  );
}

function mapPropsAreEqual(prev: MapProps, next: MapProps) {
  return (
    prev.city.name === next.city.name &&
    prev.selectedPoint?.id === next.selectedPoint?.id &&
    prev.points.length === next.points.length
  );
}

const Map = memo(MapComponent, mapPropsAreEqual);

export default Map;
