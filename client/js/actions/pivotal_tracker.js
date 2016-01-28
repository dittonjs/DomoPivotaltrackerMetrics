"use strict";

import Constants   from   "../constants";
import Dispatcher  from   "../dispatcher";
import ptApi         from   "./ptApi";

export default {

  ptAction(url, method, returnPromise, token, action, paginate){
    var originalUrl = url;
    if(paginate) url = url + "?offset=0&limit=500&envelope=true";
    var promise = ptApi(url, method, token);
    if(!promise) return {then: ()=>{}}; // this will fail quietly but thats ok.
    if(returnPromise) return promise;
    promise.then((res)=>{
      if(paginate){
        var total = res.body.pagination.total;
        var data = [];
        data = data.concat(res.body.data);
        if(data.length == total){
          Dispatcher.dispatch({action, res});
        } else {
          var received = res.body.pagination.returned;
          while(received < total){
            var pagPromise = ptApi(originalUrl+"?offset="+received+"&limit=500&envelope=true", method, token);
            pagPromise.then((res)=>{
              data = data.concat(res.body.data);
              if(data.length == total){
                res.body.data = data;
                Dispatcher.dispatch({action, res});
              }
            }, (err)=>{
              Dispatcher.dispatch({action, err});
            });
            received += 500;
          }
        }
        return;
      }
      Dispatcher.dispatch({action, res});
    }, (err)=>{
      Dispatcher.dispatch({action, err});
    });
  },
  changeSelectedProject(id){
    Dispatcher.dispatch({action: Constants.CHANGE_SELECTED_PROJECT, id});
  }

};