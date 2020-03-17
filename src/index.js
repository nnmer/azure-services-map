import 'core-js/stable/object/assign'
import 'core-js/stable/promise'
import 'core-js/features'
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from "react-router-dom";
import history from "src/helpers/history";
import App from 'src/App';
import 'src/styles/index.scss';
import { routesUI } from './helpers/routing';

ReactDOM.render(
  <Router history={history}>
    <Route title="App" path={routesUI.home} component={App} />
  </Router>,
  document.getElementById('app')
);
