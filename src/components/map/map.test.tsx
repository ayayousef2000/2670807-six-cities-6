import { render } from '@testing-library/react';
import { Marker, layerGroup } from 'leaflet';
import Map from './index';
import { makeFakeCity, makeFakeOffer } from '../../utils/mocks';

const mockLayerGroupInstance = {
  addTo: vi.fn().mockReturnThis(),
  clearLayers: vi.fn(),
  addLayer: vi.fn(),
};

const mockMarkerInstance = {
  setIcon: vi.fn(),
  addTo: vi.fn(),
  setZIndexOffset: vi.fn(),
};

vi.mock('leaflet', () => ({
  Icon: vi.fn(),
  Marker: vi.fn(() => mockMarkerInstance),
  layerGroup: vi.fn(() => mockLayerGroupInstance),
  TileLayer: vi.fn(),
  Map: vi.fn(),
}));

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

  it('should initialize the layer group and add markers for all points', () => {
    render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={undefined}
      />
    );

    expect(layerGroup).toHaveBeenCalled();
    expect(mockLayerGroupInstance.addTo).toHaveBeenCalled();

    expect(Marker).toHaveBeenCalledTimes(mockPoints.length);
    expect(mockMarkerInstance.addTo).toHaveBeenCalledTimes(mockPoints.length);
    expect(mockMarkerInstance.addTo).toHaveBeenCalledWith(mockLayerGroupInstance);
  });

  it('should set the special icon and z-index for the selected point', () => {
    render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={mockSelectedPoint}
      />
    );

    expect(mockMarkerInstance.setIcon).toHaveBeenCalledTimes(mockPoints.length);

    expect(mockMarkerInstance.setZIndexOffset).toHaveBeenCalledTimes(1);
    expect(mockMarkerInstance.setZIndexOffset).toHaveBeenCalledWith(1000);
  });

  it('should clear layers when re-rendering with new points', () => {
    const { rerender } = render(
      <Map
        city={mockCity}
        points={mockPoints}
        selectedPoint={undefined}
      />
    );

    expect(mockLayerGroupInstance.clearLayers).not.toHaveBeenCalled();

    const newPoints = [makeFakeOffer()];

    rerender(
      <Map
        city={mockCity}
        points={newPoints}
        selectedPoint={undefined}
      />
    );

    expect(mockLayerGroupInstance.clearLayers).toHaveBeenCalledTimes(1);
  });
});
