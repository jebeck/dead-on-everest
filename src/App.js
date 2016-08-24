import _ from 'lodash';
import data from 'everest-data';
import React, { Component } from 'react';

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
      data: _.sortBy(data, (d) => { return d.Date; }),
      started: false,
      stories: [{
        container: null,
        component: Overview,
        path: '/',
      }, {
        container: SVGContainer,
        component: BarChartByYear,
        path: '/by-year'
      }],
      storyIndex: 0,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentWillMount() {
    this.unlisten = history.listen((location) => {
      const currentStory = _.findIndex(this.state.stories, (story) => {
        return story.path === location.pathname;
      });
      this.setState({
        storyIndex: currentStory,
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleNext() {
    history.push({
      pathname: this.state.stories[this.state.storyIndex + 1].path,
    });
    this.setState({
      storyIndex: this.state.storyIndex + 1,
    });
  }

  handleStart() {
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

  render() {
    const { started } = this.state;
    if (started) {
      const { data, stories, storyIndex } = this.state;
      return (
        <section className="App">
          <DataContainer data={data} toRender={stories[storyIndex]} />
          <button className="Next" onClick={this.handleNext}>Next</button>
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
