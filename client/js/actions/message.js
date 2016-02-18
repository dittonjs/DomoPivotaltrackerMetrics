"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";

export default class MessageActions {
  static addMessage(projectId, message){
    setTimeout(()=>Dispatcher.dispatch({action: Constants.ADD_MESSAGE, projectId, message}),0);
  }
  static clearMessage(id){

  }
}