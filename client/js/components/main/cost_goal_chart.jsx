"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _ from 'lodash';

export default class CostGoalChart extends React.Component{
  setupConfig(){

    var config = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column'
      },
      title: {
          text: 'Cost of stories compared to goal.'
      },

      xAxis: {
          categories: [
              'Current Cost',
              'Goal'
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
      series: [
      {
          name: 'Stories',
          data: [83.6, 78.8]

      }]
    };
    return {config};
  }
  getAverages(features, bugs, chores){
    var averages = {
      bugPercentage: 0,
      featurePercentage: 0,
      chorePercentage: 0,
      bugAverage: 0,
      featureAverage: 0,
      choreAverage: 0,
    }
    var totalFeatureHours = 0;
    var totalBugHours = 0;
    var totalChoreHours = 0;
    var validBugs = 0;
    var validChores = 0;
    var validFeatures = 0;

    _.each(features, (feature)=>{
      if(feature.current_state != "accepted") return;
      var cDate = new Date(feature.created_at);
      var aDate = new Date(feature.accepted_at);
      var diff = Math.abs(aDate.getTime() - cDate.getTime()) / 3600000; // calculate hour difference
      validFeatures++;
      totalFeatureHours += diff;
    });
    _.each(bugs, (bug)=>{
      if(bug.current_state != "accepted") return;
      var cDate = new Date(bug.created_at);
      var aDate = new Date(bug.accepted_at);
      var diff = Math.abs(aDate.getTime() - cDate.getTime()) / 3600000; // calculate hour difference
      validBugs++;
      totalBugHours += diff;
    });
    _.each(chores, (chore)=>{
      if(chore.current_state != "accepted") return;
      var cDate = new Date(chore.created_at);
      var aDate = new Date(chore.accepted_at);
      var diff = Math.abs(aDate.getTime() - cDate.getTime()) / 3600000; // calculate hour difference
      validChores++;
      totalChoreHours += diff;
    });

    
    averages.bugAverage = parseFloat((totalBugHours / validBugs).toFixed(2));
    averages.featureAverage = parseFloat((totalFeatureHours / validFeatures).toFixed(2));
    averages.choreAverage = parseFloat((totalChoreHours / validChores).toFixed(2));
    var totalAverages = averages.bugAverage + averages.featureAverage + averages.choreAverage;
    averages.bugPercentage = parseFloat( ((averages.bugAverage / totalAverages) * 100).toFixed(2) );
    averages.chorePercentage = parseFloat( ((averages.choreAverage / totalAverages) * 100).toFixed(2) );
    averages.featurePercentage = parseFloat( ((averages.featureAverage / totalAverages) * 100).toFixed(2) )
    return averages;
  }

  getAllData(){
    //debugger;
    var features = _.filter(this.props.stories, (story)=>(story.story_type == "feature"));
    var bugs = _.filter(this.props.stories, (story)=>(story.story_type == "bug"));
    var chores = _.filter(this.props.stories, (story)=>(story.story_type == "chore"));
    var notAccepted = _.filter(this.props.stories, (story)=>(story.current_state != "accepted"));
    var data = this.getAverages(features, bugs, chores);
    var {config} = this.setupConfig();
    var featureCost = (data.featurePercentage * this.props.costData.cost) / features.length;
    var bugCost = (data.bugPercentage * this.props.costData.cost) / bugs.length;
    var choreCost = (data.chorePercentage * this.props.costData.cost) / chores.length;
    var cost = this.props.costData.cost / this.props.stories.length;
    var remainingGoal = (this.props.costData.goal - this.props.costData.cost) / notAccepted.length;
    config.series[0].data[0] = cost;
    config.series[0].data[1] = remainingGoal;
    return config;
  }
  render(){
    if(!this.props.costData){
      return <div>No cost or goal data for this project.</div>
    }
    console.log("data", this.props.costData);
    if(!this.props.stories) return <div />
    var config = this.getAllData();
    return <ReactHighchart ref="chart" config={config} />;
  }
};