"use strict";

import React                        from 'react';
import Firebase                     from 'firebase';
import SettingsStore                from '../../stores/settings';
import SettingsActions              from '../../actions/settings';
import PivotalTrackerActions        from '../../actions/pivotal_tracker';
import PivotalTrackerStore          from '../../stores/pivotal_tracker';
import Domo                         from '../../utils/domo';
import BaseComponent                from '../base_component';
import _                            from 'lodash';
import history                      from '../../history';
import Highchart                    from './highchart';
import Constants                    from '../../constants';
import DateRangeTabs                from './date_range_tabs';
import ProjectSelector              from './project_selector'; 

export default class Home extends BaseComponent{

  constructor(props){
    super(props);
    this.stores = [SettingsStore, PivotalTrackerStore];
    this.state = this.getState(props);
    this.ptFirebaseRef = new Firebase(`${SettingsStore.current().firebaseUrl}/${SettingsStore.current().queryParams.customer}/apiToken`);
  }

  getState(props){
    return {
      settings: SettingsStore.current(),
      selectedProject: PivotalTrackerStore.selectedProject(),
      projects: PivotalTrackerStore.projects(),
      stories: PivotalTrackerStore.stories()
    }
  }

  componentWillMount(){
    this.ptFirebaseRef.on("value", (data)=>{
      console.log(data.val());
      if(!data.val()){
        history.pushState(null, "setup_pt");
      } else {
        SettingsActions.setApiToken(data.val());
        PivotalTrackerActions.ptAction("projects", "get", false, data.val(), Constants.GET_PROJECTS);
      } 
    });
  }

  componentWillUpdate(nextProps, nextState){
    if(nextState.selectedProject.id != this.state.selectedProject.id && !nextState.stories[nextState.selectedProject.id]){
      PivotalTrackerActions.ptAction(`projects/${nextState.selectedProject.id}/stories`, "get", false, nextState.settings.apiToken, Constants.GET_STORIES, true);
    }
  }

  getStyles(){
    return {
      container: {
        width: "100%",
        height: "100vh",
        backgroundColor: "whitesmoke",
        padding: "20px",
      },
      chart: {
        width: "50%"
      }
    }
  }
  render(){
    var styles = this.getStyles();
    return(
      <div style={styles.container}>
        <div style={styles.chart}>
          <ProjectSelector 
            selectedProject={this.state.selectedProject} 
            projects={this.state.projects}/>
          <Highchart stories={this.state.stories[this.state.selectedProject.id]}/>
        </div>
      </div>
    );
  }
};