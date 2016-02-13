"use strict";

import React from 'react';
import ApplicationActions from "../../actions/application"
export default class Navbar extends React.Component{
  openSidebar(){
    ApplicationActions.openSidebar()
  }
  setPane(name){
    ApplicationActions.setPane(name)
  }
  getStyles(){
    return {
      navbar: {
        position: "fixed",
        top: "0px",
        left: this.props.sidebarOpen ? "0px" : "-260px",
        bottom: "0px",
        width: "250px",
        backgroundColor: "darkslategray",
        color: "white",
        fontSize: "150%",
        zIndex: "10000",
        transition: "all .5s ease"
      },
      menuItem: {
        padding: "20px",
        borderBottom: "1px solid gray",
        fontSize: "70%"
      },
      icon: {
        marginRight: "5px"
      }
    }
  }
  render(){
    var styles = this.getStyles();
    return (
      <div style={styles.navbar}>
        <div style={{...styles.menuItem,...{fontSize:"100%"}}}>Menu</div>
        <div onClick={(e)=>{this.setPane("stories")}}    style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-th-large"></i>Story Dashboard</div>
        <div onClick={(e)=>{this.setPane("members")}}    style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-user"></i>Owner Data</div>
        <div onClick={(e)=>{this.setPane("suggestion")}} style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-usd"></i>What should I do now?</div>
      </div>
    )
  }
};