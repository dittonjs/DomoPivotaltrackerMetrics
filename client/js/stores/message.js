"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import QueryString    from '../utils/query_string';
import _              from 'lodash';

var messages = {}
var MessageStore = {...StoreCommon, ...{
  getMessages(){
    return messages;
  }
}};

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  switch(payload.action){
    case Constants.ADD_MESSAGE:
      var temp = messages[payload.projectId];
      var temp = temp || {};
      temp[payload.message.id] = payload.message;
      messages[payload.projectId] = temp;
      break;
    default:
      return true;
  }

  // If action was responded to, emit change event
  MessageStore.emitChange();

  return true;

});

export default MessageStore;