"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _ from 'lodash';
import MessageActions from "../../actions/message";
import IdAdder from "../../utils/id_adder";

export default class CostGoalChart extends React.Component{
  shouldComponentUpdate(nextProps){
    if(nextProps.sidebarOpen != this.props.sidebarOpen && nextProps.tabName == this.props.tabName) return false;
    return true;
  }
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
    var cost = this.props.costData.cost / this.props.stories.length;
    var remainingGoal = (this.props.costData.goal - this.props.costData.cost) / notAccepted.length;
    config.series[0].data[0] = cost;
    config.series[0].data[1] = remainingGoal;
    this.addMessages(cost, remainingGoal);
    return config;
  }
  addMessages(cost, remainingGoal){
    if(remainingGoal / cost > 2){
      var message = {
        id: "cost_0",
        message: "We have noticed that your cost per story is well below your goal. Perhaps you could re-evaluate your goal to something that can help your team make improvements.",
        sourceTab: "stories"
      }
      MessageActions.addMessage(this.props.selectedProject.id, message);
    }
    if(remainingGoal / cost < .5){
      var message = {
        id: "cost_1",
        message: "Your cost is high above what your goal is. This tells us that your goal might have been set to low. Try some of the other suggestions and if your cost does not go down you might consider re-evaluating your goal.",
        sourceTab: "stories"
      }
      MessageActions.addMessage(this.props.selectedProject.id, message);
    }
    if(remainingGoal / cost >= .5 && remainingGoal / cost < .2){
      var message = {
        id: "cost_2",
        message: "You have alot to do to reach your goal. You have to make a $" + (cost - remainingGoal) + " cost improvement per story in order to reach your goal.",
        sourceTab: "stories"
      }
      MessageActions.addMessage(this.props.selectedProject.id, message);
    }
    if(remainingGoal / cost < 1 && remainingGoal / cost >= .2){
      var message = {
        id: "cost_3",
        message: "You are pretty close to reaching your goal! You have to make a $" + (cost - remainingGoal) + " cost improvement per story in order to reach your goal.",
        sourceTab: "stories"
      }
      MessageActions.addMessage(this.props.selectedProject.id, message);
    }
    if(remainingGoal / cost >= 1  && remainingGoal / cost <=2){
      var message = {
        id: "cost_4",
        message: "You are reaching your goal. Keep up the good work!",
        sourceTab: "stories"
      }
      MessageActions.addMessage(this.props.selectedProject.id, message);
    }
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