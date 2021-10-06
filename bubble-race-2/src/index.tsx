// @ts-nocheck

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import { Bubble } from 'react-chartjs-2';
import _uniq from 'lodash/uniq';

const BubbleRace = (props: ComponentProps) => {
  console.log({ props });

  let colorPalette = props.insight.context.app.color_palette;
  let { context, data: incortaData } = props.insight;
  let {
    name: nameBinding,
    color: colorBinding,
    time: timeBinding,
    value: valuesBinding
  } = context.insight.bindings ?? {};
  let [xBinding, yBinding, rBinding] = valuesBinding;

  let { duration } = context.insight.settings;

  let chartData = useMemo(() => {
    return incortaData.data.map(args => {
      let name, colorCol, date, values;
      if (colorBinding?.length > 0) {
        [name, colorCol, date, ...values] = args;
      } else {
        [name, date, ...values] = args;
      }
      return {
        date: date.formatted,
        name: {
          name: nameBinding[0].name,
          value: name.value
        },
        colorBy: colorCol
          ? {
              name: colorBinding[0].name,
              value: colorCol.value
            }
          : undefined,
        values: values.map((value, i) => ({
          name: valuesBinding[i].name,
          value: +value.value,
          formatted: value.formatted
        }))
      };
    });
  }, [incortaData, colorBinding, nameBinding]);

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

  let maxRadius = Math.max(...chartData.map(d => +d.values[2].value));

  let colorByString = useMemo(() => {
    let colorsHash = {};
    let i = 0;
    return function colorByString(str: type) {
      if (str in colorsHash) {
        return colorsHash[str];
      }
      colorsHash[str] = colorPalette[i];
      i = (i + 1) % colorPalette.length;
      return colorsHash[str];
    };
  }, []);

  function radiusFn(context) {
    var size = context.chart.width;
    var base = Math.abs(context.raw.v) / maxRadius;
    return 5 + (size / 12) * base;
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
    elements: {
      point: {
        backgroundColor: function (context) {
          let color = colorByString(context.raw.c ?? context.raw.name);
          return `${color}80`;
        },
        radius: radiusFn,
        hoverRadius: radiusFn
      }
    },
    plugins: {
      plugins: {
        legend: {
          position: 'right'
        }
      },
      tooltip: {
        callbacks: {
          title: function ([context]) {
            return context.raw.date;
          },

          label: function (context) {
            return context.raw.name;
          },
          beforeBody: function ([context]) {
            return context.raw.cName ? `${context.raw.cName}: ${context.raw.c}` : null;
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
    <BubbleRaceChart
      datesData={datesData}
      datesRange={datesRange}
      options={options}
      duration={duration}
    />
  );
};

function BubbleRaceChart({ datesData, datesRange, options, duration }) {
  let hasColorCol = !!Object.values(datesData)[0];

  let [date, setDate] = useState(datesRange[0]);

  let data = datesData[date].map(item => {
    let c = item.colorBy;
    let [x, y, r] = item.values;
    return {
      x: x.value,
      y: y.value,
      v: r.value,
      c: c?.value,
      // Additional Data
      xName: x.name,
      yName: y.name,
      vName: r.name,
      cName: c?.name,
      xFormatted: x.formatted,
      yFormatted: y.formatted,
      vFormatted: r.formatted,
      date: item.date,
      name: item.name.value
    };
  });

  let datasets = [];
  if (hasColorCol) {
    let datasetsObject = data.reduce((acc, item) => {
      acc[item.c] = acc[item.c] ? [...acc[item.c], item] : [item];
      return acc;
    }, {});
    for (let [label, data] of Object.entries(datasetsObject)) {
      datasets.push({
        label,
        data,
        borderColor: 'black'
      });
    }
  } else {
    datasets = [
      {
        label: '2011', // Name the series
        data: data, // Specify the data values array
        borderColor: 'black' // Add custom color border
      }
    ];
  }

  useEffect(() => {
    setDate(datesRange[1]);
  }, [datesData, datesRange]);

  useEffect(() => {
    let i = 1;
    let id = setInterval(() => {
      if (i >= datesRange.length) {
        clearInterval(id);
        return;
      }
      setDate(datesRange[i]);
      i++;
    }, duration);
    return () => {
      clearInterval(id);
    };
  }, [duration, datesData, datesRange]);

  return <Bubble data={{ datasets }} options={options} />;
}

export default BubbleRace;
