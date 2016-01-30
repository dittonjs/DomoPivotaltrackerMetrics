"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import Api         from   "./api";

export default {

  getCostData(data){
    Dispatcher.dispatch({action: Constants.GET_COST_DATA, data});
  }

};