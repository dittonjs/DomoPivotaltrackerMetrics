"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import QueryString    from '../utils/query_string';
import _              from 'lodash';

var _projects = {};
var _stories = {};
var _selectedProject = {};
var _projectMembers = {};
var _costData = [];
var DomoDataStore = {...StoreCommon, ...{
  costData(){
    return _costData;
  }
}};

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  switch(payload.action){
    case Constants.GET_COST_DATA:
      _costData = payload.data;
    break;
    default:
      return true;
  }

  // If action was responded to, emit change event
  DomoDataStore.emitChange();

  return true;

});

export default DomoDataStore;