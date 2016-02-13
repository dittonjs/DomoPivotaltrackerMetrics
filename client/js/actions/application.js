"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";

export default class ApplicationActions {
  static openSidebar(){
    Dispatcher.dispatch({action: Constants.OPEN_SIDEBAR});
  }
  static setPane(name){
    Dispatcher.dispatch({action: Constants.SET_PANE, name});
  }
}