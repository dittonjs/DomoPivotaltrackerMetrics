"use strict";

import React         from 'react';
import Firebase      from 'firebase';
import SettingsStore from '../../stores/settings';
import Domo          from '../../utils/domo';
import BaseComponent from '../base_component';
import _             from 'lodash';
import history       from '../../history';
export default class Home extends BaseComponent{

  constructor(props){
    super(props);
    this.stores = [SettingsStore];
    this.state = this.getState(props);
    this.ptFirebaseRef = new Firebase(`${SettingsStore.current().firebaseUrl}/${SettingsStore.current().queryParams.customer}/apiToken`);
  }

  getState(props){
    return {
      settings: SettingsStore.current()
    }
  }

  componentWillMount(){
    this.ptFirebaseRef.on("value", (data)=>{
      console.log(data.val());
      if(!data.val()){
        history.pushState(null, "setup_pt");
      } 
    });
  }

  render(){
    var params = _.map(this.state.settings.queryParams, (setting, key)=>{
      console.log(setting, key)
      return <div key={key}>{key}: {setting}</div>
    }); 
    return(<div>
      {params}
    </div>);
  }
};