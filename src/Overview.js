import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import './Overview.css';

class Overview extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  render() {
    const { data } = this.props;
    const firstYear = moment(data[0].Date, 'YYYY-MM-DD').format('YYYY');
    return (
      <div className="Text">
        <p>
          Since the beginning of kept records in <span className="Overview-firstYear">{firstYear}</span>,
          <br/>
          <br/>
          <span className="Overview-total">{data.length}</span> individuals have died climbing Mount Everest.
        </p>
      </div>
    );
  }
}

export default Overview;
