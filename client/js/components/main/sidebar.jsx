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
        left: this.props.sidebarOpen ? "0px" : "-260",
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
        borderBottom: "1px solid gray"
      }
    }
  }
  render(){
    var styles = this.getStyles();
    return (
      <div style={styles.navbar}>
        <div style={styles.menuItem}>Menu</div>
      </div>
    )
  }
};