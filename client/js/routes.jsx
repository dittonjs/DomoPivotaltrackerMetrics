"use strict";

import React                  from 'react';
import { Route, IndexRoute }  from 'react-router';
import Index                  from './components/index';
import Home                   from './components/main/home';
import NotFound               from './components/not_found';
import PtSetup                from './components/main/pt_setup';
export default (
  <Route path="/" component={Index}> 
    <IndexRoute component={Home}/>
    <Route path="setup_pt" component={PtSetup}/>
    <Route path="*" component={NotFound}/>
  </Route>
);