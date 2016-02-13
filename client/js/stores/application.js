"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import QueryString    from '../utils/query_string';
import _              from 'lodash';

var sidebarOpen = false;
var pane = "stories"
var ApplicationStore = {...StoreCommon, ...{
  sidebarOpen(){
    return sidebarOpen;
  },
  pane(){
    return pane;
  }
}};

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  switch(payload.action){
    case Constants.OPEN_SIDEBAR:
      sidebarOpen = !sidebarOpen;
    break;
    case Constants.SET_PANE:
      pane = payload.name;
    break;
    default:
      return true;
  }

  // If action was responded to, emit change event
  ApplicationStore.emitChange();

  return true;

});

export default ApplicationStore;