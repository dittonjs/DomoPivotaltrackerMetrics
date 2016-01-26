"use strict";

import React from 'react';
import ReactHighchart from "react-highcharts/dist/bundle/highcharts"
export default class Highchart extends React.Component{
  componentDidMount(){

  }
  render(){
    var config = {
      title: {
        text: "Stories"
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: "Monthly Interactions"
        }
      },
      series: [{
        name: "Stories Created",
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }, {
        name: "Bugs Added",
        data: [ 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,29.9, 71.5, 106.4, 129.2, 144.0]
      },
      {
        name: "Stories Rejected",
        data: [ 216.4, 194.1, 95.6, 54.4,29.9,176.0, 135.6, 148.5, 71.5, 106.4, 129.2, 144.0]
      }],
    };
    return <ReactHighchart ref="chart" config={config} />;
  }
};