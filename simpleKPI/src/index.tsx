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

    let [dim,hamada] = col;
    return {
      row: dim.value,
      value: +hamada.value
    };
  });
console.log("formatted measure", formattedMeasures);

  return (
    <div className="SimpleKPI__wrapper">
      {formattedMeasures.map(response => {
        return (
          <div> <strong>{response.row}:</strong> {response.value}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleKPI;
