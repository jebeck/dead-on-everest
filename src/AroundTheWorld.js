import _ from 'lodash';
import React, { Component, PropTypes } from 'react';

import './AroundTheWorld.css';

class AroundTheWorld extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  render() {
    const { data } = this.props;
    const countries = _.uniq(_.map(data, (d) => (d.Nationality)));
    return (
      <div className="MediumText">
        <p>
          While the British pioneered the conquering of the world's tallest mountain, many countries in the world are represented among the <span className="AroundTheWorld-summit">thousands</span> who have reached the summit of Everest.
        </p>
        <p>
          Likewise, among those whose lives Everest has taken, a great variety of countries—<span className="AroundTheWorld-total">{countries.length}</span>, to be exact—is represented.
        </p>
      </div>
    );
  }
}

export default AroundTheWorld;
