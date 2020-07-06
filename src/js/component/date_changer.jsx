import * as React from 'react';
import PropTypes from 'prop-types';

export class DateChanger extends React.Component {
  constructor(props) {
    super(props);
    this.iterate = this.iterate.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(this.iterate, this.props.time);
  }

  componentDidUpdate() {
    clearTimeout(this.timeout);
    // this.timeout = setTimeout(this.iterate, this.props.time);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  iterate() {
    const date = new Date(this.props.currentDate);
    date.setDate(date.getDate() + 1);
    if (date > this.props.maxDate) return;
    this.props.onDateChange(date.getTime());
  }

  onSliderChange(event) {
    const dateValue = parseInt(event.target.value, 10);
    const date = new Date(dateValue);
    date.setUTCHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.props.onDateChange(date.getTime());
  }

  render() {
    return (
      <div>
        <input
          type="range"
          min={this.props.minDate}
          max={this.props.maxDate}
          onChange={this.onSliderChange}
          value={this.props.currentDate}
        />
      </div>
    );
  }
}

DateChanger.propTypes = {
  currentDate: PropTypes.number.isRequired,
  onDateChange: PropTypes.func.isRequired,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  time: PropTypes.number,
};
