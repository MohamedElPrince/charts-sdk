//// @ts-nocheck

import React from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';

const SimpleKPI = ({insight: { data, context } }: ComponentProps) => {
  const insightData = data.data;
  const [aggregationData] = insightData;

  console.log(data.data);

  const formattedMeasures = data.data.map((col, index) => {
    console.log(col);

    let [dim,measure1, measure2] = col;
    return {
      row: dim.value,
      value: measure1.formatted,
      value2: measure2.formatted
    };
  });
console.log("formatted measure", formattedMeasures);

  return (
    <div className="SimpleKPI__wrapper">
      {formattedMeasures.map(response => {
        return (
          <div> <strong>{response.row}:</strong> {response.value}, {response.value2}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleKPI;
