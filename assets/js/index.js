import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';

const _ = require('lodash');

window.onload = function() { if (screen.width < 1000) document.getElementById('vp').setAttribute('content','user-scalable=no,width=1000'); };

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);