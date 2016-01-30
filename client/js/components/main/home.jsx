"use strict";

import React                        from 'react';
import Firebase                     from 'firebase';
import SettingsStore                from '../../stores/settings';
import SettingsActions              from '../../actions/settings';
import PivotalTrackerActions        from '../../actions/pivotal_tracker';
import PivotalTrackerStore          from '../../stores/pivotal_tracker';
import DomoDataActions              from '../../actions/domo_data';
import DomoDataStore                from '../../stores/domo_data';
import Domo                         from '../../utils/domo';
import BaseComponent                from '../base_component';
import _                            from 'lodash';
import history                      from '../../history';
import Highchart                    from './highchart';
import PieChart                     from './pie_chart';
import Constants                    from '../../constants';
import DateRangeTabs                from './date_range_tabs';
import ProjectSelector              from './project_selector'; 

export default class Home extends BaseComponent{

  constructor(props){
    super(props);
    this.stores = [SettingsStore, PivotalTrackerStore, DomoDataStore];
    this.state = this.getState(props);
    this.ptFirebaseRef = new Firebase(`${SettingsStore.current().firebaseUrl}/${SettingsStore.current().queryParams.customer}/apiToken`);
  }

  getState(props){
    return {
      settings: SettingsStore.current(),
      selectedProject: PivotalTrackerStore.selectedProject(),
      projects: PivotalTrackerStore.projects(),
      stories: PivotalTrackerStore.stories(),
      projectMembers: PivotalTrackerStore.projectMembers(),
      costData: DomoDataStore.costData()
    }
  }

  componentWillMount(){
    Domo.get('/data/v1/cost').then((costData)=>{
      DomoDataActions.getCostData(costData);
    });
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
      PivotalTrackerActions.ptAction(`projects/${nextState.selectedProject.id}/memberships`, "get", false, nextState.settings.apiToken, Constants.GET_MEMBERS, false);
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
      selector: {
        paddingBottom: "5px"
      },
      row: {
        width: "100%"
      }
    }
  }
  render(){
    console.log(this.state);
    var styles = this.getStyles();
    return(
      <div style={styles.container} className="container">
        <div style={styles.selector}>
          <ProjectSelector 
            selectedProject={this.state.selectedProject} 
            projects={this.state.projects}/>
        </div>
        <div style={styles.row} className="row">
          <div className="col-md-6 col-lg-6 col-xl-6">
            <Highchart stories={this.state.stories[this.state.selectedProject.id]}/>
          </div>
          <div className="col-md-3 col-lg-3 col-xl-3">
            <PieChart stories={this.state.stories[this.state.selectedProject.id]}/>
          </div>
        </div>
      </div>
    );
  }
};