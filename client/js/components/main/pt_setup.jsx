"use strict";

import React                  from 'react';
import SettingsStore          from "../../stores/settings";
import Firebase               from "firebase";
import PivotalTrackerActions  from "../../actions/pivotal_tracker";
import history                from "../../history";

export default class PtSetup extends React.Component{
  constructor(){
    super();
    this.ptFirebaseRef = new Firebase(`${SettingsStore.current().firebaseUrl}/${SettingsStore.current().queryParams.customer}/apiToken`);
    this.state = {};
    this.state.error = false;
  }
  getStyles(){
    return {
      jumbotron: {
        padding: "40px",
        fontSize: "150%",
        textAlign: "center"
      },
      container: {
        backgroundColor: "steelblue",
        color: "white",
        borderRadius: "4px",
        padding: "20px"
      },
      input: {
        width: "50%",
        margin: "10px auto"
      },
      button: {
        backgroundColor: "chocolate"
      },
      error: {
        borderRadius: "4px",
        fontSize: "75%"
      }
    }
  }

  saveApiToken(){
    this.setState({error: false});
    var token = this.refs.apiToken.value;
    PivotalTrackerActions.ptAction("me", "get", true, token).then((res)=>{
      this.ptFirebaseRef.set(token, (error)=>{
        if(!error) history.pushState(null, "/");
      });
    }, (error)=>{
      this.setState({error: true})
    });
  }

  render(){
    var styles = this.getStyles()
    var error = <div />;
    if(this.state.error){
      error = <div style={styles.error} className="alert alert-danger">Uh-oh, we could not validate your API token, please check your credentials and try again.</div>
    }
    return (
      <div style={styles.jumbotron} className="jumbotron">
        <div style={styles.container}className="container">
          <h1>Get Started</h1>
          <div>Paste your Pivotal Tracker API token here.</div>
          {error}
          <form>
            <div className="form-group">
              <input style={styles.input} ref="apiToken" type="email" className="form-control" placeholder="API token..." />
            </div>
          </form>
          <div>{"Don't worry, your secret is safe with us."}</div>
          <button style={styles.button} type="button" className="btn" onClick={e=>this.saveApiToken()}>Submit</button>
        </div>
      </div>
    );
  }
};