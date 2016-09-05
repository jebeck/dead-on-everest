import _ from 'lodash';
import data from 'everest-data';
import React, { Component, PropTypes } from 'react';

import './App.css';

import history from './history';

import BarChartByYear from './BarChartByYear';
import DataContainer from './DataContainer';
import SVGContainer from './SVGContainer';
import Overview from './Overview';
import TreemapByCountry from './TreemapByCountry';

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
    highlightTimeout: 3000,
    stories: [{
      component: Overview,
      container: null,
      path: '/intro',
    }, {
      component: BarChartByYear,
      container: SVGContainer,
      highlights: [{
        id: 'year1922',
        text: 'Records of deaths in attempts to climb Mount Everest start in 1922 with the deaths of seven of the hired Tibetan and Nepalese porters on a Britsh expedition, the first recorded expedition with the aim of reaching the summit of the mountain.',
      }, {
        id: 'year1924',
        text: 'In 1924, the British expedition returned; George Mallory and Andrew Irvine died in a summit attempt. Mallory\'s body was later found on the N.E. ridge, a position that is theoretically compatible with death from a fall after summiting the mountain.',
      }, {
        id: 'year1934',
        text: 'British eccentric Maurice Wilson died on Everest in 1934 after sneaking into Tibet to make his attempt. He was an inexperienced climber who made no attempt to learn the necessary skills or even obtain required equipment, such as crampons for walking on glacier ice.',
      }, {
        id: 'year1953',
        text: 'In 1953, Edmund Hillary and Tenzing Norgay became the first climbers to reach the summit of Mount Everest and return alive.',
      }, {
        id: 'year1996',
        text: 'The disastrous 1996 climbing season on Mount Everest was recorded most famously in Jon Krakauer\'s book Into Thin Air.',
      }, {
        id: 'year2006',
        text: '2006 saw both the controversial death of solo British climber David Sharp, passed by many other climbers ascending to and descending from the summit as he slowly died in the Green Boots cave, and the heroic rescue of Lincoln Hall, who against all odds survived a bivouac in the Death Zone and was discovered the next day by a four-person team led by Daniel Mazur of the U.S.; the team abandoned their own summit attempt and organized a rescue team of about a dozen Sherpas to help Hall descend.',
      }, {
        id: 'year2015',
        text: 'The earthquake in Nepal in April 2015 caused an avalanche at Everest Base Camp, making 2015 the deadliest year to date on the mountain.',
      }],
      path: '/by-year',
    }, {
      component: TreemapByCountry,
      container: SVGContainer,
      highlights: [{
        id: 'Nepal',
        text: '🇳🇵 The nation suffering the largest number of deaths on Everest is Nepal, with a total of 111 dead, the majority of them Sherpa hired as porters in service of other expeditions.',
      }, {
        id: 'India',
        position: 'default',
        text: '🇮🇳 India ranks 2nd in deaths on Everest, including three climbers who died in the 1996 disaster after becoming the first Indians to reach the summit.',
      }, {
        id: 'Japan',
        position: 'default',
        text: '🇯🇵 Japan ranks 3rd in deaths on Everest, with a total of 19 dead, spanning the years 1970 to 2015.',
      }, {
        id: 'United Kingdom',
        position: 'default',
        text: '🇬🇧 Unsurprisingly given its long history with Everest, the United Kingdom ranks high in the ranks of death totals on the moutain, with 18 deaths spanning 1922 to 2010.',
      }, {
        id: 'United States',
        position: 'default',
        text: '🇺🇸 The United States comes in fifth in total deaths on Everest and accounts for 5 of the nearly 20 dead in the 2015 Base Camp avalanche.',
      }],
      margins: {
        top: 40,
        right: 5,
        bottom: 5,
        left: 5,
      },
      path: '/by-country',
    }],
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
    }, this.props.highlightTimeout);
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
