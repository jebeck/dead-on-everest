import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

require('viewport-units-buggyfill').init();

import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
