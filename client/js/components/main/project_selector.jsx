"use strict";

import React                        from 'react';
import {DropdownButton,  MenuItem}  from "react-bootstrap";
import _                            from "lodash";
import PTActions                    from "../../actions/pivotal_tracker";

export default class ProjectSelector extends React.Component{
  
  changeSelectedProject(data, key){
    PTActions.changeSelectedProject(key);
  }

  getMenuItems(){
    return _.map(this.props.projects, (project, key)=>{
      return <MenuItem key={key} active={this.props.selectedProject.id == key} eventKey={key} onSelect={(data, key)=>this.changeSelectedProject(data, key)}>{project.name}</MenuItem>
    });
  }

  render(){
    return (
      <DropdownButton bsStyle="default" title={this.props.selectedProject.name} id={"project_dropdown"}>
        {this.getMenuItems()}
      </DropdownButton>
    );
  }
};