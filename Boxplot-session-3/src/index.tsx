import React from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import ReactECharts from 'echarts-for-react'; 

const BoxplotSession3 = ({ response: data }: ComponentProps) => {
  console.log(data.data);

  let _rawData = data.data.map((col: any) => {
    let [dim, min, q1, median, q3, max] = col;
    return[
      dim = dim.formatted,
      min = +min.value,
      q1 = +q1.value,
      median= +median.value,
      q3= +q3.value,
      max= +max.value
    ];
  });

  const option: echarts.EChartsOption =  {
    dataset: [
      {
        id: 'income_aggregate',
        source: _rawData
      }
    ],
    title: {
      text: 'Income since 1950'
    },
    tooltip: {
      trigger: 'axis',
      confine: true
    },
    xAxis: {
      name: 'Income',
      nameLocation: 'middle',
      nameGap: 30,
      scale: true
    },
    yAxis: {
      type: 'category'
    },
    grid: {
      bottom: 100
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
      },
      {
        name: 'detail',
        type: 'scatter',
        datasetId: 'since_year',
        symbolSize: 6,
        tooltip: {
          trigger: 'item'
        },
        label: {
          show: true,
          position: 'top',
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
          fontSize: 12
        },
        itemStyle: {
          color: '#d00000'
        },
        encode: {
          x: 'Income',
          y: 'Country',
          label: 'Year',
          itemName: 'Year',
          tooltip: ['Country', 'Year', 'Income']
        }
      }
    ]
  };

  return <ReactECharts option = {option}/>;
};

export default BoxplotSession3;
