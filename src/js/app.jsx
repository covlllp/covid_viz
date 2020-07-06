import * as React from 'react';

import { CovidPlot } from 'js/component/covid_plot';
import { DateChanger } from 'js/component/date_changer';

import * as Api from 'js/api';
import * as constants from 'js/constants';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      geojson: null,
      date: new Date(constants.DATE_START).getTime(),
    };
    this.updateDate = this.updateDate.bind(this);
  }
  componentDidMount() {
    Api.getCaseDensities(this.state.date).then(res => {
      this.setState({
        data: res,
      });
    });

    Api.getGeoJson().then(res => {
      this.setState({
        geojson: res,
      });
    });
  }

  updateDate(date) {
    console.log(date);
    this.setState({ date });
  }

  render() {
    const { geojson } = this.state;
    if (!geojson) return null;
    return (
      <div>
        <div>{new Date(this.state.date).toString()}</div>
        <CovidPlot geojson={geojson} date={this.state.date} />
        <DateChanger
          currentDate={this.state.date}
          time={constants.TIME_INTERVAL}
          onDateChange={this.updateDate}
          maxDate={new Date(constants.DATE_END).getTime()}
          minDate={new Date(constants.DATE_START).getTime()}
        />
      </div>
    );
  }
}
