"use strict";

import React from 'react';
import ApplicationActions from "../../actions/application"
export default class Navbar extends React.Component{
  openSidebar(){
    ApplicationActions.openSidebar()
  }
  getStyles(){
    return {
      navbar: {
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "100%",
        padding: "20px",
        backgroundColor: "steelblue",
        textAlign: "center",
        color: "white",
        fontSize: "150%"
      },
      icon: {
        float: "left",
        marginLeft: this.props.sidebarOpen ? "250px" : "0px",
        transition: "all .5s ease",
        cursor: "pointer"
      },
      selectedTab: {
        fontSize: "80%",
        float: "left",
        marginLeft: "5px"
      },
      title: {
        float: "right"
      }
    }
  }
  render(){
    var name = "";
    if(this.props.tabName=="stories") name = "Are we meeting our development goal?";
    if(this.props.tabName=="members") name = "How are our devs performing?";
    if(this.props.tabName=="suggestions") name = "What should we do now?";
    var styles = this.getStyles();
    return (
      <div style={styles.navbar}>
        <i onClick={e=>this.openSidebar()}style={styles.icon} className="glyphicon glyphicon-menu-hamburger"></i>
        <span style={styles.selectedTab}>{name}</span>
        <span style={styles.title}>Pivotal Tracker Guidance System</span>
      </div>
    )
  }
};