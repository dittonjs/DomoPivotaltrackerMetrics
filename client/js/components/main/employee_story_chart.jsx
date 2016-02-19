"use strict";

import React          from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _              from 'lodash';
import MessageActions from '../../actions/message';

export default class EmployeeStoryChart extends React.Component{
  shouldComponentUpdate(nextProps){
    if(nextProps.sidebarOpen != this.props.sidebarOpen && nextProps.tabName == this.props.tabName) return false;
    return true;
  }
  setupConfig(){
    var foundData = {};
    var config = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column'
      },
      title: {
          text: 'Stories completed per developer.'
      },

      xAxis: {
          categories: [

          ],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Stories Completed'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: [{
        name: 'Features',
        data: []
      }, {
        name: "Bugs",
        data: []
      }]
    };
    _.each(this.props.projectMembers, (member, index)=>{
      config.xAxis.categories[index] = member.person.name;
      foundData[member.person.id] = index;
    });
    return {config, foundData};
  }

  getAverage(data){
    var validStories = 0;
    var totalHours = 0;

    _.each(data, (story)=>{
      if(story.current_state != "accepted") return;
      var cDate = new Date(story.created_at);
      var aDate = new Date(story.accepted_at);
      var diff = Math.abs(aDate.getTime() - cDate.getTime()) / 3600000; // calculate hour difference
      validStories++;
      totalHours += diff;
    });

    
    var average = parseFloat((totalHours / validStories).toFixed(2));
    return average;
  }

  getMessages(config){
    var mostBugsFixed = {dev: "", bugs: 0};
    var mostStoriesFinished = {dev: "", accepted: 0};
    _.each(config.xAxis.categories, (dev,index)=>{
      if(config.series[1].data[index] > mostBugsFixed.bugs){
        mostBugsFixed.bugs = config.series[1].data[index];
        mostBugsFixed.dev = dev;
      }
      if(config.series[0].data[index] > mostStoriesFinished.accepted){
        mostStoriesFinished.accepted = config.series[0].data[index];
        mostStoriesFinished.dev = dev;
      }
    });
    if(mostBugsFixed.dev == "") return;
    if(mostStoriesFinished == "") return;
    var message = {
      id: "devs_0",
      message: "It looks like " + mostBugsFixed.dev + " has fixed " + mostBugsFixed.bugs + " bugs on this project! Which is more than any other developer. Maybe have " + mostBugsFixed.dev + " do some training on this project for the less exprienced developers.",
      sourceTab: "members"
    }
    MessageActions.addMessage(this.props.selectedProject.id, message);
    var message2 = {
      id: "devs_1",
      message: "" + mostStoriesFinished.dev + " is responsible for completing  " + mostStoriesFinished.accepted + " new features! Which is more than any other developer. Have " + mostStoriesFinished.dev + " pair with the less experiences developers to help them gain familiarity with this project.",
      sourceTab: "members"
    }
    MessageActions.addMessage(this.props.selectedProject.id, message2);
  }

  getAllData(){
    console.log(this.props);    
    var {config, foundData} = this.setupConfig();
    _.each(this.props.projectMembers, (owner, index)=>{
      var myFeatures = _.filter(this.props.stories, story=>(story.story_type == "feature" && _.includes(story.owner_ids,owner.person.id) && story.current_state == "accepted"));
      var myBugs = _.filter(this.props.stories, story=>(story.story_type == "bug" && _.includes(story.owner_ids,owner.person.id) && story.current_state == "accepted"));
      var dataIndex = foundData[owner.person.id]
      config.series[0].data[dataIndex] = myFeatures.length;
      config.series[1].data[dataIndex] = myBugs.length;
    });
    this.getMessages(config);
    return config;
  }
  render(){
    // if(!this.props.costData){
    //   return <div>No cost or goal data for this project.</div>
    // }
    if(!this.props.stories) return <div />
    var config = this.getAllData();
        var styles = {
      blocker: {
        position: "absolute",
        bottom: "0px",
        right: "1px",
        backgroundColor: "white",
        color: "white",
        cursor: "default"
      }
    }
    return (
      <div style={{position: "relative"}}>
        <ReactHighchart ref="chart" config={config} />
        <div style={styles.blocker}>Highcharts.com</div>
      </div>
    );
  }
};