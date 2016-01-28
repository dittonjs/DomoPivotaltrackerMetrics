"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import QueryString    from '../utils/query_string';
import _              from 'lodash';
var _settings = {};


function loadSettings(defaultSettings){

  defaultSettings = defaultSettings || {};

  var bestValue = function(settings_prop, params_prop, default_prop){
    return defaultSettings[settings_prop] || QueryString.params()[params_prop] || default_prop;
  };
  var queryParams = getQueryParams(defaultSettings.iframeLocation)

  _settings = {
    firebaseUrl      : defaultSettings.firebaseUrl,
    iframeLocation   : defaultSettings.iframeLocation,
    queryParams
  };

}

function getQueryParams(url){
  var queryParams = {};
  var params = url.split("?")[1];
  console.log(params);
  var params = params.split("&");
  _.each(params, (params)=>{
    var temp = params.split("=")
    queryParams[temp[0]] = temp[1];
  });
  return queryParams; 
}
// Extend Message Store with EventEmitter to add eventing capabilities
var SettingsStore = {...StoreCommon, ...{

  // Return current messages
  current(){
    return _settings;
  }

}};

// Register callback with Dispatcher
Dispatcher.register(function(payload) {

  switch(payload.action){

    case Constants.SETTINGS_LOAD:
      loadSettings(payload.data);
      break;
    case Constants.SET_API_TOKEN:
      _settings.apiToken = payload.token;
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  SettingsStore.emitChange();

  return true;

});

export default SettingsStore;

