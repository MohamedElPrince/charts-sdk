// @ts-nocheck
import { useD3 } from './hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { VisualProps } from '@incorta-org/visual-sdk';
import { bars, axis, labels, ticker, margin, n, barSize, getKeyframes } from './utils';

function BarChart({ dimension: { width, height }, insight: { data, context } }: VisualProps) {
  const duration = context.insight.settings.duration;

  data = data.data.map(row => ({
    date: row[1].value,
    name: row[0].value,
    category: row.length === 4 ? row[2].value : undefined,
    value: row.length === 3 ? +row[2].value : +row[3].value
  }));

  const ref = useD3(
    async svg => {
      svg.interrupt();
      svg.selectAll('*').remove();

      const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
      const y = d3
        .scaleBand()
        .domain(d3.range(n + 1))
        .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
        .padding(0.1);

      svg.attr('viewBox', [0, 0, width, height]);

      const keyframes = getKeyframes(data);

      const updateBars = bars(svg, x, y, data);
      const updateAxis = axis(svg, x, y, width);
      const updateLabels = labels(svg, x, y);
      const updateTicker = ticker(svg, width, keyframes);

      for (const keyframe of keyframes) {
        const nameframes = d3.groups(
          keyframes.flatMap(([, data]) => data),
          d => d.name
        );
        const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
        const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));
        const transition = svg.transition().duration(duration).ease(d3.easeLinear);

        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition, prev, next);
        updateLabels(keyframe, transition, prev, next);
        updateTicker(keyframe, transition);

        await transition.end();
      }
    },
    [data]
  );

  return <svg ref={ref} />;
}

export default BarChart;
