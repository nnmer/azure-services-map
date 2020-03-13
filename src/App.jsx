import { hot } from 'react-hot-loader/root';
import React from 'react'
import { Switch, Route } from "react-router-dom";
import NoMatch from 'src/helpers/NoMatch';
import { routesUI } from 'src/helpers/routing';
import LandingScene from 'src/scenes/LandingScene';
import LandingLayout from 'src/layout/LandingLayout';
import SimpleBar from 'simplebar'

const App = (props) => {
  return (
    <Switch>
      <Route path={routesUI.home} render={ props => <LandingLayout component={LandingScene} {...props} />}/>
      <Route component={NoMatch}/>
    </Switch>
  )
}

export default hot(App)