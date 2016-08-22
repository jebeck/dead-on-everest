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
    toRender: PropTypes.shape({
      container: PropTypes.func,
      component: PropTypes.func.isRequired,
    }).isRequired,
  }
  render() {
    const { toRender: { container: Container, component: Component }, data } = this.props;
    if (Container !== null) {
      return (
        <div className="ChartFrame">
          <Container component={Component} data={data} />
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
