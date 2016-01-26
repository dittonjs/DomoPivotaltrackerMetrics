"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import ptApi         from   "./ptApi";

export default {

  ptAction(url, method, returnPromise, token, action){
    var promise = ptApi(url, method, token);
    if(!promise) return {then: ()=>{}}; // this will fail quietly but thats ok.
    if(returnPromise) return promise;
    promise.then((res)=>{
      Dispatcher.dispatch({action, res});
    }, (err)=>{
      Dispatcher.dispatch({action, err});
    });
  }

};