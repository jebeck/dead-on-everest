import React, { Component, PropTypes } from 'react';

class DataContainer extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Date: PropTypes.string.isRequired,
      Age: PropTypes.number,
      Expedition: PropTypes.string,
      Nationality: PropTypes.string.isRequired,
      'Cause of death': PropTypes.string,
      'General location': PropTypes.string,
      'Specific location': PropTypes.string,
      Elevation: PropTypes.number,
      'Cause of death details': PropTypes.string
    })).isRequired,
    highlight: PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    toRender: PropTypes.shape({
      component: PropTypes.func.isRequired,
      container: PropTypes.func,
    }).isRequired,
  }
  render() {
    const { data, highlight, toRender: { component: Component, container: Container } } = this.props;
    if (Container !== null) {
      return (
        <div className="ChartFrame">
          <Container component={Component} data={data} highlight={highlight} />
        </div>
      );
    }
    return (
      <div className="HTMLFrame">
        <Component data={data} />
      </div>
    );
  }
}

export default DataContainer;
