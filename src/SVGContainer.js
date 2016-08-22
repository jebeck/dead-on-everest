import Dimensions from 'react-dimensions';
import React, { Component, PropTypes } from 'react';

class SVGContainer extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    margin: PropTypes.object.isRequired,
  };

  static defaultProps = {
    margin: {
      top: 60,
      right: 20,
      bottom: 20,
      left: 60,
    },
  }

  render() {
    const { component: Component, data, margin: { top, right, bottom, left } } = this.props;
    const { containerWidth: w, containerHeight: h } = this.props;
    return (
      <svg width={w} height={h}>
        <g transform={`translate(${left},${top})`}>
          <Component data={data} height={h - top - bottom} width={w - left - right} />
        </g>
      </svg>
    );
  }
}

// eslint-disable-next-line new-cap
export default Dimensions()(SVGContainer);
