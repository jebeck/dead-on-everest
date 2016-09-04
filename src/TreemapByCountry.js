import _ from 'lodash';
import * as d3 from 'd3';
import React, { Component, PropTypes } from 'react';

import './TreemapByCountry.css';

class TreemapByCountry extends Component {
  constructor(props) {
    super(props);
    this.treemap = d3.treemap()
      .size([props.width, props.height])
      .padding(1)
      .round(true);
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    highlight: PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    width: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const { data } = this.props;
    const byCountry = { name: 'byCountry' };
    const grouped = _.groupBy(data, (d) => {
      return d.Nationality;
    });
    byCountry.children = _.map(Object.keys(grouped), (country) => {
      return {
        name: country,
        children: _.map(grouped[country], (d) => ({ name: d.Name })),
      };
    });
    const nodes = d3.hierarchy(byCountry)
      .sum((d) => (d.name ? 1 : 0))
      .sort((a, b) => { return b.value - a.value; });
    this.setState({
      treemapData: this.treemap(nodes),
    });
  }

  componentDidMount() {
    const colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    if (this.refs.byCountry) {
      d3.select('#TreemapByCountry')
        .selectAll('rect')
        .data(this.state.treemapData.children)
        .enter()
        .append('rect')
        .attr('id', (d) => (d.data.name))
        .attr('class', 'TreeRect')
        .attr('x', (d) => (d.x0))
        .attr('y', (d) => (d.y0))
        .attr('width', (d) => (d.x1 - d.x0))
        .attr('height', (d) => (d.y1 - d.y0))
        .attr('fill', (d) => (colorScale(d.data.name)));
    }
  }

  render() {
    return (
      <g id="TreemapByCountry" ref="byCountry">
      </g>
    );
  }
}

export default TreemapByCountry;
