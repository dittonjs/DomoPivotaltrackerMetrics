"use strict";

import React                        from 'react';
import Firebase                     from 'firebase';
import SettingsStore                from '../../stores/settings';
import SettingsActions              from '../../actions/settings';
import PivotalTrackerActions        from '../../actions/pivotal_tracker';
import PivotalTrackerStore          from '../../stores/pivotal_tracker';
import DomoDataActions              from '../../actions/domo_data';
import DomoDataStore                from '../../stores/domo_data';
import ApplicationStore             from '../../stores/application';
import Domo                         from '../../utils/domo';
import BaseComponent                from '../base_component';
import _                            from 'lodash';
import history                      from '../../history';
import Highchart                    from './highchart';
import PieChart                     from './pie_chart';
import CostGoalChart                from './cost_goal_chart';
import Constants                    from '../../constants';
import DateRangeTabs                from './date_range_tabs';
import EmployeeStoryChart           from './employee_story_chart';
import ProjectSelector              from './project_selector';
import Navbar                       from './navbar';
import Sidebar                      from './sidebar';
import MessageBoard                 from './message_board'; 

export default class Home extends BaseComponent{

  constructor(props){
    super(props);
    this.stores = [ApplicationStore, SettingsStore, PivotalTrackerStore, DomoDataStore];
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
      costData: DomoDataStore.costData(),
      sidebarOpen: ApplicationStore.sidebarOpen(),
      tabName: ApplicationStore.pane(),
    }
  }

  componentWillMount(){
    Domo.get('/data/v1/cost').then((costData)=>{
      DomoDataActions.getCostData(costData);
    });
    this.ptFirebaseRef.on("value", (data)=>{
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
    var marginLeft = "-15px";
    if(this.state.tabName == "stories") marginLeft = "-15px";
    if(this.state.tabName == "members") marginLeft = "-1170px";
    if(this.state.tabName == "suggestions") marginLeft = "-2325px";
    return {
      container: {
        whiteSpace: "nowrap",
        width: "100%",
        height: "100vh",
        backgroundColor: "whitesmoke",
        padding: "20px",
        overflow: "hidden"
      },
      selector: {
        paddingBottom: "5px",
        marginTop: "60px",
      },
      row: {
        width: "100%",
        display: "inline-block"
      },
      firstRow: {
        marginLeft: marginLeft,
        transition: "all 1s ease"
      },
      secondRow: {
        marginLeft: "30px"
      }    
    }
  }
  render(){
    console.log(this.state);
    var styles = this.getStyles();
    return(
      <div style={styles.container} className="container">
        <Navbar sidebarOpen={this.state.sidebarOpen} tabName={this.state.tabName}/>
        <Sidebar sidebarOpen={this.state.sidebarOpen} />
        <div style={styles.selector}>
          <ProjectSelector 
            selectedProject={this.state.selectedProject} 
            projects={this.state.projects}/>
        </div>
        <div style={{...styles.row,...styles.firstRow}}>
          <div style={styles.highchart} className="col-md-6 col-lg-6 col-xl-6">
            <Highchart
              selectedProject={this.state.selectedProject}  
              stories={this.state.stories[this.state.selectedProject.id]}
              sidebarOpen={this.state.sidebarOpen}
              tabName={this.state.tabName}
            />
          </div>
          <div className="col-md-3 col-lg-3 col-xl-3">
            <PieChart
              selectedProject={this.state.selectedProject}  
              stories={this.state.stories[this.state.selectedProject.id]}
              sidebarOpen={this.state.sidebarOpen}
              tabName={this.state.tabName}
            />
          </div>
          <div className="col-md-3 col-lg-3 col-xl-3">
            <CostGoalChart
              selectedProject={this.state.selectedProject}  
              costData={this.state.costData[this.state.selectedProject.id]} 
              stories={this.state.stories[this.state.selectedProject.id]}
              sidebarOpen={this.state.sidebarOpen}
              tabName={this.state.tabName}
            />
          </div>
        </div>
        <div style={{...styles.row,...styles.secondRow}}>
          <div style={styles.highchart} className="col-md-12 col-lg-12 col-xl-12">
            <EmployeeStoryChart 
              selectedProject={this.state.selectedProject} 
              stories={this.state.stories[this.state.selectedProject.id]}
              sidebarOpen={this.state.sidebarOpen}
              tabName={this.state.tabName}
              projectMembers={this.state.projectMembers[this.state.selectedProject.id]}
            />
          </div>
        </div>
        <div style={{...styles.row,...styles.secondRow}}>
          <div style={styles.highchart} className="col-md-12 col-lg-12 col-xl-12">
            <MessageBoard selectedProject={this.state.selectedProject}/>
          </div>
        </div>
      </div>
    );
  }
};