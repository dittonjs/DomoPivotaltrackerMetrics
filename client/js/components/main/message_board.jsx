"use strict";

import React from 'react';
import BaseComponent from '../base_component'
import _     from 'lodash';
import MessageStore from "../../stores/message"
export default class MessageBoard extends BaseComponent{
  constructor(props){
    super(props);
    this.stores = [MessageStore];
    this.state = this.getState();
  }
  getState(){
    return {
      messages: MessageStore.getMessages()
    }
  }
  getStyles(){
    return {
      container: {
        padding: "20px",
        backgroundColor: "white",
        width: "100%",
        height: "400px",
        whiteSpace: "normal"  
      },
      message: {
        padding: "10px",
        width: "100%",
        whiteSpace: "normal",
        borderRadius: "4px",
        boxShadow: "0px 0px 1px 1px grey",
        fontSize: "120%"
      },
      clearButton: {
        marginLeft: "3px"
      }
    }
  }
  render(){
    console.log(this.state.messages);
    var styles = this.getStyles();
    var i = 0;
    var messages = _.map(this.state.messages[this.props.selectedProject.id], (aMessage)=>{
      console.log(aMessage)
      return (
        <div key={"aMessage_"+aMessage.id + (i++ + ++i)} style={styles.message}>
          <div>{aMessage.message}</div>
          <div>
            <button className="btn btn-primary">Show me.</button>
          </div>
        </div>
      );
    });
    var col1 = [];
    var col2 = [];
    var col3 = [];
    _.each(messages, (message, index)=>{
      if(index % 3 == 0) col1.push(message);
      if(index % 3 == 1) col2.push(message);
      if(index % 3 == 2) col3.push(message);
    });
    return <div style={styles.container}>
            <div className="row">
              <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                {col1}
              </div>
              <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                {col2}
              </div>
              <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                {col3}
              </div>
            </div>
          </div>;
  }
};
