import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';

import HomePage from './routes/HomePage';

import ScrollToTop from './common/ScrollToTop';

import './common/MathPlugin';



function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <ScrollToTop>
        <Switch>
          <Route path="/" exact render={() => (<Redirect to="/index"/>)} />
          <Route path="/index" component={HomePage}/>
        </Switch>
      </ScrollToTop>
    </Router>
  );
}

export default RouterConfig;
