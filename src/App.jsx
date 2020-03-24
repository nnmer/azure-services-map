import { hot } from 'react-hot-loader/root';
import React from 'react'
import { Switch, Route } from "react-router-dom";
import NoMatch from 'src/helpers/NoMatch';
import { routesUI } from 'src/helpers/routing';
import LandingScene from 'src/scenes/LandingScene';
import LandingLayout from 'src/layout/LandingLayout';
import DefaultLayout from 'src/layout/DefaultLayout';
import SimpleBar from 'simplebar'
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import TelemetryService from 'src/services/TelemetryService'
import ServiceDetailsContainer from 'src/scenes/ServiceDetailsContainer';

TelemetryService.initialize()

const App = (props) => {
  return (
    <Switch>
      <Route path={routesUI.services.serviceHome} render={ props => <DefaultLayout component={ServiceDetailsContainer} {...props} />}/>
      <Route path={routesUI.home} render={ props => <LandingLayout component={LandingScene} {...props} />}/>
      <Route component={NoMatch}/>
    </Switch>
  )
}

export default withAITracking(TelemetryService.reactPlugin, hot(App))