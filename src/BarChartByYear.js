import _ from 'lodash';
import * as d3 from 'd3';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import './BarChartByYear.css';

class BarChartByYear extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const { data, width, height } = this.props;
    const yearAccessor = (d) => {
      return parseInt(moment(d.Date, 'YYYY-MM-DD').format('YYYY'), 10);
    }
    const grouped = _.groupBy(data, yearAccessor);
    const totalsByYear = _.map(
      Object.keys(grouped),
      (year) => ({ year: parseInt(year, 10), total: grouped[year].length })
    );
    this.setState({
      totalsByYear,
      xScale: d3.scaleLinear()
        .domain([0, d3.extent(totalsByYear, (d) => { return d.total; })[1]])
        .range([0, width]),
      yScale: d3.scaleLinear()
        .domain(d3.extent(data, yearAccessor))
        .range([height, 0]),
    });
  }

  render() {
    const { totalsByYear, xScale, yScale } = this.state;
    const xAxisH = yScale.range()[1] - 16;
    const yAxisX = xScale.range()[0] - 16;
    return (
      <g id="BarChartByYear">
        <g id="XAxis">
          <line
            className="Axis-line"
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            y1={xAxisH}
            y2={xAxisH}
          />
          <text
            className="XAxis-label"
            x={xScale.range()[0]}
            y={xAxisH - 12}
          >0</text>
          <text
            className="XAxis-label"
            x={(xScale.range()[1] - xScale.range()[0]) / 2}
            y={xAxisH - 12}
          >Total Deaths</text>
          <text
            className="XAxis-label"
            x={xScale.range()[1]}
            y={xAxisH - 12}
          >{d3.extent(totalsByYear, (d) => (d.total))[1]}</text>
        </g>
        <g id="YAxis">
          <line
            className="Axis-line"
            x1={yAxisX}
            x2={yAxisX}
            y1={yScale.range()[0]}
            y2={yScale.range()[1]}
          />
          <text
            className="YAxis-label"
            x={-(yScale.range()[0]) + 8}
            y={xScale.range()[0] - 32}
            transform="rotate(-90)"
          >{totalsByYear[0].year}</text>
          <text
            className="YAxis-label"
            x={-(yScale.range()[0] - yScale.range()[1]) / 2}
            y={xScale.range()[0] - 32}
            transform="rotate(-90)"
          >Year</text>
          <text
            className="YAxis-label"
            x={-(yScale.range()[1]) - 8}
            y={xScale.range()[0] - 32}
            transform="rotate(-90)"
          >{totalsByYear[totalsByYear.length - 1].year}</text>
        </g>
        <g id="Bars">
          {_.map(totalsByYear, (d) => {
            return (
              <line
                className="Bar"
                id={`Bar-${d.year}`}
                key={d.year}
                x1="0"
                x2={xScale(d.total)}
                y1={yScale(d.year)}
                y2={yScale(d.year)}
              />
            );
          })}
        </g>
      </g>
    );
  }
}

export default BarChartByYear;
