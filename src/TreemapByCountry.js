import _ from 'lodash';
import cx from 'classnames';
import * as d3 from 'd3';
import React, { Component, PropTypes } from 'react';

import './TreemapByCountry.css';

const flags = {
  Nepal: '🇳🇵',
  India: '🇮🇳',
  Japan: '🇯🇵',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  China: '🇨🇳',
  'South Korea': '🇰🇷',
  Poland: '🇵🇱',
  Russia: '🇷🇺',
  Germany: '🇩🇪',
  Australia: '🇦🇺',
  Canada: '🇨🇦',
  France: '🇫🇷',
  Czechoslovakia: '🌐',
  Spain: '🇪🇸',
  Bulgaria: '🇧🇬',
  Italy: '🇮🇹',
  Hungary: '🇭🇺',
  'New Zealand': '🇳🇿',
  Taiwan: '🇹🇼',
  Switzerland: '🇨🇭',
  Austria: '🇦🇹',
  Denmark: '🇩🇰',
  Yugoslavia: '🌐',
  Ukraine: '🇺🇦',
  Belgium: '🇧🇪',
  Netherlands: '🇳🇱',
  Chile: '🇨🇱',
  Sweden: '🇸🇪',
  Brazil: '🇧🇷',
  'Czech Republic': '🇨🇿',
  Ireland: '🇮🇪',
  Cambodia: '🇰🇭',
  Bangladesh: '🇧🇩',
  Vietnam: '🇻🇳',
  Slovenia: '🇸🇮',
};

class TreemapByCountry extends Component {
  constructor(props) {
    super(props);
    this.treemap = d3.treemap()
      .size([props.width, props.height])
      .padding(1)
      .round(true);
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory20);
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
    const grouped = _.reduce(data, (res, d, i) => {
      if (d.Nationality.search(',') !== -1) {
        const countries = d.Nationality.split(',');
        _.each(countries, (country) => {
          const trimmed = country.trim();
          if (res[trimmed]) {
            res[trimmed].push(d);
          } else {
            res[trimmed] = [d];
          }
        });
      } else {
        if (res[d.Nationality]) {
          res[d.Nationality].push(d);
        } else {
          res[d.Nationality] = [d];
        }
      }
      return res;
    }, {});
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

  render() {
    const { highlight, width } = this.props;
    const { treemapData: { children: data } } = this.state;
    return (
      <g id="TreemapByCountry" ref="byCountry">
        <text
          className={'XAxis-label'}
          x={width / 2}
          y={-12}
        >
          {'Deaths by Country'}
        </text>
        {_.map(data, (d) => {
          const highlighted = `${d.data.name}` === _.get(highlight, 'id');
          const rectClasses = cx({
            TreeRect: true,
            Faded: highlight && !highlighted,
            Highlighted: highlighted,
          });
          return (
            <g key={`Group-${d.data.name}`}>
              <rect
                id={`${d.data.name}`}
                className={rectClasses}
                x={d.x0}
                y={d.y0}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                fill={this.colorScale(d.data.name)}
              />
              <text
                id={`Flag-${d.data.name}`}
                className={d.value > 3 ? 'TreeMoji' : 'TreeMojiCenter'}
                x={(d.value > 3) ? (d.x1 - 5) : (d.x0 + ((d.x1 - d.x0) / 2))}
                y={(d.value > 3) ? (d.y1 - 5) : (d.y0 + ((d.y1 - d.y0) / 2))}
              >
                {highlighted ? null : flags[d.data.name]}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
}

export default TreemapByCountry;
