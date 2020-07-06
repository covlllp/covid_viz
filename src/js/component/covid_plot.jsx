import * as React from 'react';
import PropTypes from 'prop-types';

import { CountyPlot } from 'js/component/county_plot';
import * as Api from 'js/api';

export class CovidPlot extends React.Component {
  constructor(props) {
    super(props);
    this.getCovidInfo = this.getCovidInfo.bind(this);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getCovidInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.getCovidInfo();
    }
  }

  getCovidInfo() {
    Api.getCaseDensities(this.props.date).then(res => {
      this.setState({
        data: res,
      });
    });
  }

  render() {
    const { geojson } = this.props;
    const { data } = this.state;
    if (!data) return null;
    const fips = [];
    const densityMap = {};
    const densities = [];
    data.forEach(point => {
      densityMap[point.fips] = point.densityWeekDelta;
    });
    geojson.features.forEach(point => {
      const { id } = point;
      fips.push(id);
      densities.push(densityMap[id] || 0);
    });
    return <CountyPlot geojson={geojson} locations={fips} z={densities} />;
  }
}

CovidPlot.propTypes = {
  geojson: PropTypes.object.isRequired,
  date: PropTypes.number.isRequired,
};
