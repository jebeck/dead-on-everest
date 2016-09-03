import _ from 'lodash';
import data from 'everest-data';
import React, { Component, PropTypes } from 'react';

import './App.css';

import history from './history';

import BarChartByYear from './BarChartByYear';
import DataContainer from './DataContainer';
import SVGContainer from './SVGContainer';
import Overview from './Overview';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightIndex: null,
      started: false,
      storyIndex: 0,
    };
    this.timer = null;
    this.handleNext = this.handleNext.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  static defaultProps = {
    data: _.sortBy(data, (d) => { return d.Date; }),
    stories: [{
      component: Overview,
      container: null,
      path: '/intro',
    }, {
      component: BarChartByYear,
      container: SVGContainer,
      path: '/by-year',
      highlights: [{
        id: 'year2015',
        text: '',
      }, {
        id: 'year1996',
        text: '',
      }],
    }],
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    stories: PropTypes.array.isRequired,
  }

  findHighlightIndex(location, highlights) {
    return _.findIndex(highlights, (highlight) => {
      return highlight.id === _.get(location, ['query', 'highlight']);
    });
  }

  findStoryIndex(location) {
    return _.findIndex(this.props.stories, (story) => {
      return story.path === location.pathname;
    });
  }

  componentWillMount() {
    const { stories } = this.props;
    const currentLocation = history.getCurrentLocation();
    const currentStoryIndex = this.findStoryIndex(currentLocation);
    if (currentStoryIndex >= 0) {
      this.setState({
        storyIndex: currentStoryIndex,
        started: true,
      });
      if (!_.isEmpty(currentLocation.query)) {
        const highlights = stories[currentStoryIndex].highlights || [];
        const currentHighlightIndex = this.findHighlightIndex(currentLocation, highlights);
        if (currentHighlightIndex >= 0) {
          this.setState({
            highlightIndex: currentHighlightIndex,
          });
        }
      } else {
        if (stories[currentStoryIndex].highlights) {
          this.startHighlights(stories[currentStoryIndex]);
        }
      }
    }

    this.unlisten = history.listen((location) => {
      console.log(location.query);
      const currentStory = this.findStoryIndex(location);
      const highlights = stories[currentStory].highlights;
      if (highlights) {
        const highlightIndex = this.findHighlightIndex(location, highlights);
        this.setState({
          highlightIndex: (highlightIndex >= 0) ? highlightIndex : null,
        });
      } else {
        this.setState({
          highlightIndex: null,
        });
      }
      this.setState({
        storyIndex: currentStory,
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  startHighlights(story) {
    const { highlights } = story;
    this.timer = setInterval(() => {
      const { highlightIndex } = this.state;
      let newIndex = null;
      if (highlightIndex === null) {
        newIndex = 0;
      } else {
        if (highlightIndex < highlights.length) {
          newIndex = highlightIndex + 1;
        }
      }
      if (newIndex >= 0 && newIndex < highlights.length) {
        history.push({
          pathname: history.getCurrentLocation().pathname,
          query: { highlight: highlights[newIndex].id },
        });
      }
      if (newIndex === (highlights.length)) {
        clearInterval(this.timer);
        this.timer = null;
        history.push({
          pathname: history.getCurrentLocation().pathname,
          query: {},
        });
      }
      this.setState({
        highlightIndex: newIndex,
      });
    }, 1000);
  }

  handleNext() {
    const { stories } = this.props;
    const { storyIndex } = this.state;
    const story = stories[storyIndex + 1];
    history.push({
      pathname: story.path,
    });
    this.setState({
      storyIndex: storyIndex + 1,
    });
    if (story.highlights) {
      this.startHighlights(story);
    }
  }

  handleStart() {
    history.push({
      pathname: this.props.stories[0].path,
    });
    this.setState({
      started: true,
    });
  }

  renderTitle() {
    return (
      <div className="Title">
        <h1>Dead on Everest</h1>
      </div>
    );
  }

  renderStart() {
    return (
      <div className="Start" onClick={this.handleStart}>
        <h3 className="Start-hint">Tap to Start</h3>
        <button className="Start-button" />
      </div>
    );
  }

  renderImageCredit() {
    return (
      <div className="ImageCredit">
        <p>Image by <a href="https://flic.kr/p/GTsCGy">Darren Puttock</a> under <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>.</p>
      </div>
    );
  }

  renderNext() {
    const { stories } = this.props;
    const { highlightIndex, storyIndex, started } = this.state;
    if (storyIndex === (stories.length - 1)) {
      return;
    }
    if (started && stories[storyIndex].highlights) {
      if (highlightIndex < (stories[storyIndex].highlights.length)) {
        return;
      }
    }
    return (
      <button className="Next" onClick={this.handleNext}>Next</button>
    );
  }

  render() {
    const { highlightIndex, started } = this.state;
    if (started) {
      const { data, stories } = this.props;
      const { storyIndex } = this.state;
      const highlight = (highlightIndex !== null) ? stories[storyIndex].highlights[highlightIndex] : null;
      return (
        <section className="App">
          <DataContainer data={data} highlight={highlight} toRender={stories[storyIndex]} />
          {this.renderNext()}
        </section>
      );
    }
    return (
      <section className="App">
        {this.renderTitle()}
        {this.renderStart()}
        {this.renderImageCredit()}
      </section>
    );
  }
}

export default App;
