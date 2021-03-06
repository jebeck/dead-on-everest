import _ from 'lodash';
import data from 'everest-data';
import React, { Component, PropTypes } from 'react';

import FaBackward from 'react-icons/lib/fa/backward';
import FaForward from 'react-icons/lib/fa/forward';
import FaPause from 'react-icons/lib/fa/pause';
import FaPlay from 'react-icons/lib/fa/play';

import './App.css';

import history from './history';

import DataContainer from './DataContainer';
import stories from './stories';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightIndex: null,
      highlightsStarted: false,
      started: false,
      storyIndex: 0,
    };
    this.timer = null;

    this.handleStart = this.handleStart.bind(this);
    this.handleNext = this.handleNext.bind(this);

    this.handleBack = this.handleBack.bind(this);
    this.handleForward = this.handleForward.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);

    this.startHighlights = this.startHighlights.bind(this);
  }

  static defaultProps = {
    data: _.sortBy(data, (d) => { return d.Date; }),
    highlightTimeout: 4000,
    initialHighlightTimeout: 500,
    stories,
  };

  static propTypes = {
    data: PropTypes.array.isRequired,
    highlightTimeout: PropTypes.number.isRequired,
    stories: PropTypes.array.isRequired,
  };

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
    const { initialHighlightTimeout, stories } = this.props;
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
          setTimeout(this.startHighlights.bind(null, stories[currentStoryIndex]), initialHighlightTimeout);
        }
      }
    }

    this.unlisten = history.listen((location) => {
      if (location.pathname === '/') {
        return this.setState({
          highlightIndex: null,
          storyIndex: 0,
          started: false,
        });
      }
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
        started: true,
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  startHighlights(story, restart) {
    const { highlights } = story;
    const { highlightIndex } = this.state;
    if (highlightIndex === null || restart) {
      const newIndex = (highlightIndex === null) ? 0 : (highlightIndex + 1);
      history.push({
        pathname: history.getCurrentLocation().pathname,
        query: { highlight: highlights[newIndex].id },
      });
      this.setState({
        highlightIndex: newIndex,
        highlightsStarted: true,
      });
    }
    this.timer = setInterval(() => {
      const { highlightIndex } = this.state;
      let newIndex = null;
      if (highlightIndex === null) {
        return;
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
        highlightsStarted: true,
      });
    }, this.props.highlightTimeout);
  }

  handleBack() {
    const { stories } = this.props;
    const { highlightIndex, storyIndex } = this.state;
    if (highlightIndex > 0) {
      clearInterval(this.timer);
      this.timer = null;
      const newIndex = highlightIndex - 1;
      history.push({
        pathname: history.getCurrentLocation().pathname,
        query: { highlight: stories[storyIndex].highlights[newIndex].id },
      });
      this.setState({
        highlightIndex: newIndex,
        highlightsStarted: false,
      });
    } else if (highlightIndex === 0 || highlightIndex === null) {
      const newIndex = storyIndex - 1;
      history.push({
        pathname: stories[newIndex].path,
        query: {},
      });
      this.setState({
        highlightIndex: null,
        highlightsStarted: false,
        storyIndex: newIndex,
      });
    }
  }

  handleForward() {
    const { stories } = this.props;
    const { highlightIndex, storyIndex } = this.state;
    if (highlightIndex !== null) {
      clearInterval(this.timer);
      this.timer = null;
      if (highlightIndex === stories[storyIndex].highlights.length - 1) {
        return this.handleNext();
      }
      const newIndex = highlightIndex + 1;
      history.push({
        pathname: history.getCurrentLocation().pathname,
        query: { highlight: stories[storyIndex].highlights[newIndex].id },
      });
      this.setState({
        highlightIndex: newIndex,
        highlightsStarted: false,
      });
    } else if (highlightIndex === null) {
      this.setState({
        highlightIndex: 0,
      });
    }
  }

  handlePause() {
    clearInterval(this.timer);
    this.timer = null;
    this.setState({
      highlightsStarted: false,
    });
  }

  handlePlay() {
    const { stories } = this.props;
    const { highlightIndex, storyIndex } = this.state;
    if (highlightIndex === stories[storyIndex].highlights.length - 1) {
      return this.handleNext();
    }
    this.startHighlights(stories[storyIndex], true);
  }

  handleNext() {
    const { initialHighlightTimeout, stories } = this.props;
    const { storyIndex } = this.state;
    const story = stories[storyIndex + 1];
    history.push({
      pathname: story.path,
    });
    this.setState({
      highlightIndex: null,
      highlightsStarted: false,
      storyIndex: storyIndex + 1,
    });
    if (story.highlights) {
      setTimeout(this.startHighlights.bind(null, story), initialHighlightTimeout);
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

  renderHighlight() {
    const { stories } = this.props;
    const { highlightIndex, storyIndex } = this.state;
    const highlight = _.get(stories, [storyIndex, 'highlights', highlightIndex]);
    if (!highlight) {
      return null;
    }
    const height = this.refs.app.getBoundingClientRect().height;
    const focusedEl = document.getElementById(highlight.id).getBoundingClientRect();
    let highlightTextPos = {
      left: focusedEl.left + 5,
    };
    if (focusedEl.top > (height / 2)) {
      highlightTextPos.bottom = height - focusedEl.top + 5;
    } else {
      highlightTextPos.top = focusedEl.top + 5;
    }
    if (highlight.position === 'default') {
      return (
        <div className="Highlight" style={{ top: (height / 2), left: '15%' }}>
          <p>{highlight.text}</p>
        </div>
      );
    }
    return (
      <div className="Highlight" style={highlightTextPos}>
        <p>{highlight.text}</p>
      </div>
    );
  }

  renderControls() {
    const { stories } = this.props;
    const { highlightIndex, highlightsStarted, storyIndex, started } = this.state;
    if (started && stories[storyIndex].highlights) {
      if (highlightIndex === (stories[storyIndex].highlights.length)) {
        return;
      }
      return (
        <div className="Controls">
          <FaBackward
            onClick={this.handleBack} style={{ fontSize: '16px'}}
          />
          {highlightsStarted ?
            <FaPause onClick={this.handlePause} /> :
            <FaPlay onClick={this.handlePlay} />}
          <FaForward
            onClick={this.handleForward} style={{ fontSize: '16px'}}
          />
        </div>
      );
    }
    return;
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
        <section className="App" ref="app">
          <DataContainer data={data} highlight={highlight} toRender={stories[storyIndex]} />
          {this.renderHighlight()}
          {this.renderControls()}
          {this.renderNext()}
        </section>
      );
    }
    return (
      <section className="App" ref="app">
        {this.renderTitle()}
        {this.renderStart()}
        {this.renderImageCredit()}
      </section>
    );
  }
}

export default App;
