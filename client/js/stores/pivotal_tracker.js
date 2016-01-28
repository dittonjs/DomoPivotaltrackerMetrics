"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import QueryString    from '../utils/query_string';
import _              from 'lodash';

var _projects = {};
var _stories = {};
var _selectedProject = {};

var PivotalTrackerStore = {...StoreCommon, ...{
  project(id){
    return _projects[id];
  },
  projects(){
    return _projects;
  },
  selectedProject(){
    return _selectedProject;
  },
  stories(){
    return _stories;
  }
}};

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
  switch(payload.action){

    case Constants.GET_PROJECTS:
      _.each(payload.res.body, (project)=>{
        _projects[project.id] = project;
        _selectedProject = project; // this will set the last one to the project that loads when the app is first loaded
      });
      break;
    case Constants.GET_STORIES:
      _.each(payload.res.body.data, (story)=>{
        if(!_stories[story.project_id]) _stories[story.project_id] = [];
        _stories[story.project_id].push(story);
      });
    break;
    case Constants.CHANGE_SELECTED_PROJECT:
      _selectedProject = _projects[payload.id];
    break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  PivotalTrackerStore.emitChange();

  return true;

});

export default PivotalTrackerStore;