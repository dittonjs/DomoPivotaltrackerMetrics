"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts";
import _ from 'lodash';

export default class Highchart extends React.Component{
  setupConfig(firstDate){
    var today = new Date();
    var createdAtDate = new Date(firstDate);
    var i = 0;
    var foundData = {};
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var config ={
      title: {
        text: "Stories"
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        title: {
          text: "Monthly Interactions"
        }
      },
      series: [{
        name: "Stories Created",
        data: []
      }, {
        name: "Bugs Added",
        data: []
      },
      {
        name: "Stories Accepted",
        data: []
      }],
    };
    var done = false;
    var month = createdAtDate.getMonth();
    var year = createdAtDate.getFullYear();
    var endMonth = today.getMonth();
    var endYear = today.getFullYear();
    while(!done){
      foundData[months[month]+" "+year] = i++;
      config.xAxis.categories.push(months[month]+" "+year);
      config.series[0].data[foundData[months[month]+" "+year]] = 0;
      config.series[1].data[foundData[months[month]+" "+year]] = 0;
      config.series[2].data[foundData[months[month]+" "+year]] = 0;
      if(month == endMonth && year == endYear) {
        done = true;
        continue;
      }
      month++;
      if(month == 12) {
        year++;
        month = 0;
      }
    }
    return {config, foundData};
  }
  getAllData(){
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var sortedCreationData = _.sortBy(this.props.stories, story=>story.id);
    var {config, foundData} = this.setupConfig(sortedCreationData[0].created_at);
    _.each(sortedCreationData, (story)=>{
        var seriesIndex = story.story_type == "feature" || story.story_type == "chore" ? 0 : 1;
        var created = new Date(story.created_at);
        var accepted = story.current_state == "accepted" ? new Date(story.accepted_at) : null;
        var dataIndex = foundData[months[created.getMonth()]+" "+created.getFullYear()];
        config.series[seriesIndex].data[dataIndex] = config.series[seriesIndex].data[dataIndex] + 1;
        if(accepted){
          dataIndex = foundData[months[accepted.getMonth()]+" "+accepted.getFullYear()];
          config.series[2].data[dataIndex] = config.series[2].data[dataIndex] + 1;
        }
    });
    return config;
  }
  render(){
    if(!this.props.stories) return <div />
    var config = this.getAllData();
    return <ReactHighchart ref="chart" config={config} />;
  }
};