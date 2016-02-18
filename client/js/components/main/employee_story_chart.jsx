"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _ from 'lodash';

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
          text: 'Stories complete per developer.'
      },

      xAxis: {
          categories: [

          ],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Cost'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
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
    return config;
  }
  render(){
    // if(!this.props.costData){
    //   return <div>No cost or goal data for this project.</div>
    // }
    if(!this.props.stories) return <div />
    var config = this.getAllData();
    return <ReactHighchart ref="chart" config={config} />;
  }
};