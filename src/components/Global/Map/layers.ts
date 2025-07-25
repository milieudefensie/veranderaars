import { Layer, Source } from 'mapbox-gl';

export const clusterLayer: Layer = {
  id: 'clusters',
  type: 'circle',
  source: 'pins',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#295F4E', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: Layer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'pins',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
  paint: {
    'text-color': '#ffffff',
  },
};

export const unclusteredPointLayer: Layer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'pins',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};
