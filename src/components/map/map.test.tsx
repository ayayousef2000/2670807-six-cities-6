import { render } from '@testing-library/react';
import { Marker, layerGroup } from 'leaflet';
import Map from './index';
import { makeFakeCity, makeFakeOffer } from '../../utils/mocks';

vi.mock('leaflet', () => {
  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(),
    addLayer: vi.fn(),
  };

  const mockMarker = {
    setIcon: vi.fn(),
    addTo: vi.fn(),
    setZIndexOffset: vi.fn(),
  };

  return {
    Icon: vi.fn(),
    Marker: vi.fn(() => mockMarker),
    layerGroup: vi.fn(() => mockLayerGroup),
    TileLayer: vi.fn(),
    Map: vi.fn(),
  };
});

vi.mock('../../hooks/use-map', () => ({
  default: vi.fn().mockReturnValue({}),
}));

describe('Component: Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCity = makeFakeCity();
  const mockPoints = [
    makeFakeOffer(),
    makeFakeOffer(),
    makeFakeOffer(),
  ];
  const mockSelectedPoint = mockPoints[1];

  it('should render correctly', () => {
    const { container } = render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={undefined}
      />
    );

    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  it('should initialize the layer group and markers', () => {
    render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={undefined}
      />
    );

    expect(layerGroup).toHaveBeenCalled();
    expect(Marker).toHaveBeenCalledTimes(mockPoints.length);
  });

  it('should set the correct icon for the selected point', () => {
    render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={mockSelectedPoint}
      />
    );

    expect(Marker).toHaveBeenCalledTimes(mockPoints.length);

    const mockMarkerInstance = new (Marker as unknown as new () => unknown)();

    // @ts-expect-error - interacting with mock properties
    expect(mockMarkerInstance.setIcon).toHaveBeenCalled();
  });

  it('should clear layers when re-rendering with new points', () => {
    const { rerender } = render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={undefined}
      />
    );

    expect(layerGroup).toHaveBeenCalledTimes(1);

    const newPoints = [makeFakeOffer()];

    rerender(
      <Map
        city={mockCity}
        points={newPoints}
        selectedPoint={undefined}
      />
    );

    const mockLayerGroupInstance = layerGroup();
    expect(mockLayerGroupInstance.clearLayers).toHaveBeenCalled();
  });
});
