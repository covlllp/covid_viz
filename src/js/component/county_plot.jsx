import * as React from 'react';
import PropTypes from 'prop-types';

import createPlotlyComponent from 'react-plotly.js/factory';

import * as constants from 'js/constants';

// eslint-disable-next-line
const Plot = createPlotlyComponent(Plotly);

export const CountyPlot = props => {
  const { locations, z, geojson } = props;
  const data = [
    {
      type: 'choroplethmapbox',
      name: 'Covid New Cases per 1M',
      locations,
      z,
      geojson,
      zmax: constants.SCALE_MAX,
      zmin: 0,
      marker: {
        line: { width: 0 },
      },
      colorscale: 'Viridis',
      // colorscale: [[0, constants.COLOR_MIN], [1, constants.COLOR_MAX]],
    },
  ];
  const layout = {
    width: 1200,
    height: 800,
    mapbox: {
      style: 'white-bg',
      center: { lon: -95, lat: 40 },
      zoom: 3.5,
    },
  };
  return <Plot data={data} layout={layout} />;
};

CountyPlot.propTypes = {
  locations: PropTypes.array.isRequired,
  z: PropTypes.array.isRequired,
  geojson: PropTypes.object.isRequired,
};
