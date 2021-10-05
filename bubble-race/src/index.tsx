// @ts-nocheck

import React, { useEffect, useMemo, useRef } from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import * as d3 from 'd3';

const BubbleRace = (props: ComponentProps) => {
  console.log({ props });

  let { width, height } = props.dimensions;
  let { context, data: incortaData } = props.insight;
  let { name: nameBinding, period: periodBinding, value: valuesBinding } = context.insight.bindings;

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
          value: +value.value
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

  let ref = useRef(null);

  useEffect(() => {
    // clear
    ref.current.innerHTML = '';

    let margin = { top: 20, right: 20, bottom: 35, left: 40 };

    let grid = g =>
      g
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.1)
        .call(g =>
          g
            .append('g')
            .selectAll('line')
            .data(x.ticks())
            .join('line')
            .attr('x1', d => 0.5 + x(d))
            .attr('x2', d => 0.5 + x(d))
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
        )
        .call(g =>
          g
            .append('g')
            .selectAll('line')
            .data(y.ticks())
            .join('line')
            .attr('y1', d => 0.5 + y(d))
            .attr('y2', d => 0.5 + y(d))
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
        );

    let yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text(`↑ ${valuesBinding[1].name}`)
        );
    let xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80, ','))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .append('text')
            .attr('x', width)
            .attr('y', margin.bottom - 4)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'end')
            .text(`${valuesBinding[0].name} →`)
        );

    let color = d3
      .scaleOrdinal(
        chartData.map(d => d.name.value),
        d3.schemeCategory10
      )
      .unknown('black');

    let x = d3.scaleLinear(
      [0, d3.max(chartData.map(row => row.values[0].value))],
      [margin.left, width - margin.right]
    );
    let y = d3.scaleLinear(
      [0, d3.max(chartData.map(row => row.values[1].value))],
      [height - margin.bottom, margin.top]
    );
    let radius = d3.scaleSqrt(
      [0, d3.max(chartData.map(row => row.values[2].value))],
      [0, width / 12]
    );

    let chart = getChart();

    ref.current.appendChild(chart);

    function getChart() {
      const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);

      svg.append('g').call(grid);

      const circle = svg
        .append('g')
        .attr('stroke', 'black')
        .selectAll('circle')
        .data(datesData[datesRange[0]], d => d.name.value)
        .join('circle')
        .sort((a, b) => d3.descending(a.values[2].value, b.values[2].value))
        .attr('cx', d => x(d.values[0].value))
        .attr('cy', d => y(d.values[1].value))
        .attr('r', d => radius(d.values[2].value))
        .attr('fill', d => color(d.name.value))
        .call(circle => circle.append('title').text(d => [d.name.name, d.name.value].join('\n')));

      return Object.assign(svg.node(), {
        update(data) {
          circle
            .data(data, d => d.name.value)
            .sort((a, b) => d3.descending(a.values[2].value, b.values[2].value))
            .attr('cx', d => x(d.values[0].value))
            .attr('cy', d => y(d.values[1].value))
            .attr('r', d => radius(d.values[2].value));
        }
      });
    }

    // looping
    let i = 1;
    let id = setInterval(() => {
      if (i >= datesRange.length) {
        clearInterval(id);
        return;
      }
      chart.update(datesData[datesRange[i]]);
      i++;
    }, 500);

    return () => {
      clearInterval(id);
    };
  }, [width, height, chartData, datesData, datesRange]);

  return <div ref={ref}></div>;
};

export default BubbleRace;
