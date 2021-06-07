import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';

const activeItem = location.pathname;

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);