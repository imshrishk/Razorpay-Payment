import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Uncomment the following line to register the service worker
// serviceWorker.register();

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();