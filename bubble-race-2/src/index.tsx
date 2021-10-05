// @ts-nocheck

import React, { useEffect, useMemo, useRef } from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import { Bubble } from 'react-chartjs-2';

const BubbleRace = (props: ComponentProps) => {
  console.log({ props });

  let colorPalette = props.insight.context.app.color_palette;
  let { context, data: incortaData } = props.insight;
  let {
    name: nameBinding,
    period: periodBinding,
    value: valuesBinding
  } = context.insight.bindings ?? {};
  let [xBinding, yBinding, rBinding] = valuesBinding;

  let { duration } = context.insight.settings;

  let chartData = useMemo(() => {
    return incortaData.data.map(([name, date, ...values]) => {
      return {
        date: date.formatted,
        name: {
          name: nameBinding[0].name,
          value: name.value
        },
        values: values.map((value, i) => ({
          name: valuesBinding[i].name,
          value: +value.value,
          formatted: value.formatted
        }))
      };
    });
  }, [incortaData]);

  let [datesData, datesRange] = useMemo(() => {
    let datesData = {};
    let datesRange = [];

    chartData.forEach(row => {
      if (!(row.date in datesData)) {
        datesRange.push(row.date);
      }
      datesData[row.date] = datesData[row.date] ? [...datesData[row.date], row] : [row];
    });

    return [datesData, datesRange];
  }, [chartData]);

  console.log({ chartData, datesData, datesRange });

  let data = datesData['2011'].map(item => {
    let [x, y, r] = item.values;
    return {
      x: x.value,
      y: y.value,
      v: r.value,
      // Additional Data
      xName: x.name,
      yName: y.name,
      vName: r.name,
      xFormatted: x.formatted,
      yFormatted: y.formatted,
      vFormatted: r.formatted,
      date: item.date,
      name: item.name.value
    };
  });

  let maxRadius = Math.max(...data.map(d => d.v));

  function radiusFn(context) {
    var size = context.chart.width;
    var base = Math.abs(context.raw.v) / maxRadius;
    return (size / 12) * base;
  }

  let options = {
    responsive: true, // Instruct chart js to respond nicely.
    maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    scales: {
      x: {
        title: {
          display: true,
          text: xBinding.name
        }
      },
      y: {
        title: {
          display: true,
          text: yBinding.name
        }
      }
    },
    // plugins: {
    //   legend: false
    // },
    elements: {
      point: {
        backgroundColor: function (context) {
          let color = colorPalette[context.dataIndex % colorPalette.length];
          return `${color}80`;
        },
        radius: radiusFn,
        hoverRadius: radiusFn
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function ([context]) {
            return context.raw.date;
          },
          label: function (context) {
            return context.raw.name;
          },
          afterBody: function ([context]) {
            return [
              `${context.raw.xName}: ${context.raw.xFormatted}`,
              `${context.raw.yName}: ${context.raw.yFormatted}`,
              `${context.raw.vName}: ${context.raw.vFormatted}`
            ];
          }
        }
      }
    }
  };

  return (
    <Bubble
      data={{
        datasets: [
          {
            // label: 'Population', // Name the series
            data: data, // Specify the data values array
            borderColor: 'black' // Add custom color border
          }
        ]
      }}
      options={options}
    />
  );
};

export default BubbleRace;
