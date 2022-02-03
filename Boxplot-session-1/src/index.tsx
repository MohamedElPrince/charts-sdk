import React from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react'; 

const BoxplotSession1 =  ({ response: data }: ComponentProps) => {
  console.log("The Engine response data: \n" + data.data);
  
  const resData : number[][] = data.data.map((col: any) => {
    let [dim, measure] = col;
    return [
      dim= dim.formatted,
      measure= +measure.value
    ];
  });

  //This part is just a workaround until we have the dynamic query implemented to manipulate the query sent to the engine
  //Should be replaced by a query that aggregates the result with different aggregations for the extra columns in the array
  resData.forEach(element => {
    let x : number[]=[element[1]*2, element[1]*3, element[1]*4, element[1]*5]; 
    element.push(...x);
    
  });

  const option: echarts.EChartsOption = {
    dataset: [
      {
        id: 'income_aggregate',
        source: resData
      }
    ],
    title: {
      text: data.measureHeaders[0].label + ' stats per dimension group' + '\n'
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    xAxis: {
      name: data.measureHeaders[0].label,
      nameLocation: 'middle',
      nameGap: 30,
      scale: true
    },
    yAxis: {
      type: 'category'
    },
    grid: {
      bottom: 50
    },
    legend: {
      selected: { detail: false }
    },
    dataZoom: [
      {
        type: 'inside'
      },
      {
        type: 'slider',
        height: 20
      }
    ],
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        datasetId: 'income_aggregate',
        itemStyle: {
          color: '#b8c5f2'
        },
        encode: {
          x: ['min', 'Q1', 'median', 'Q3', 'max'],
          y: 'Country',
          itemName: ['Country'],
          tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
        }
      }
    ]
  };

  return <ReactECharts option={option} />;
};

export default BoxplotSession1;
