"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _ from 'lodash';

export default class PieChart extends React.Component{
  setupConfig(){

    var config = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
          text: 'Average lifespan of stories: from creation date to acceptance date.'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.days:.1f} Days</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true
          }
      },
      series: [{
          name: 'Average lifespan',
          colorByPoint: true,
          data: [{
              name: 'Features',
              days: 0,
              y: 56.33
          }, {
              name: 'Bugs',
              days: 0,
              y: 24.03,
              sliced: true,
              selected: true,
          }, {
              name: 'Chores',
              days: 0,
              y: 10.38
          }]
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
    var data = this.getAverages(features, bugs, chores);
    var {config} = this.setupConfig();
    config.series[0].data[0].days = data.featureAverage / 24;
    config.series[0].data[1].days = data.bugAverage / 24;
    config.series[0].data[2].days = data.choreAverage / 24;
    config.series[0].data[0].y = data.featurePercentage;
    config.series[0].data[1].y = data.bugPercentage;
    config.series[0].data[2].y = data.chorePercentage;
    return config;
  }
  render(){
    if(!this.props.stories) return <div />
    var config = this.getAllData();
    return <ReactHighchart ref="chart" config={config} />;
  }
};