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
        backgroundColor: "rgb(67,67,72)",
        color: "white",
        fontSize: "150%",
        zIndex: "10000",
        transition: "all .5s ease"
      },
      menuItem: {
        padding: "20px",
        borderBottom: "1px solid gray",
        fontSize: "70%",
        cursor: "pointer"
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
        <div style={{...styles.menuItem,...{fontSize:"100%", cursor: ""}}}>Menu</div>
        <div onClick={(e)=>{this.setPane("stories")}}    style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-th-large"></i>Are we meeting our goals?</div>
        <div onClick={(e)=>{this.setPane("members")}}    style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-user"></i>How are our devs performing?</div>
        <div onClick={(e)=>{this.setPane("suggestions")}} style={styles.menuItem}><i style={styles.icon} className="glyphicon glyphicon-usd"></i>What should we do now?</div>
      </div>
    )
  }
};