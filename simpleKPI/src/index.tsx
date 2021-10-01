//// @ts-nocheck

import React from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';
import { Tile } from './Tile';

const SimpleKPI = ({insight: { data, context } }: ComponentProps) => {
  const insightData = data.data;
  const [aggregationData] = insightData;

  console.log(context.insight.settings?.iconURL);

  const formattedMeasures = data.data.map((col, index) => {

    let [dim,measure1, measure2] = col;
    return {
      row: dim.value,
      value: String(measure1.formatted),
      value2: String(measure2.formatted),
      iconURL: context.insight.settings?.iconURL
    };
  });

  return (
    <div className="SimpleKPI__wrapper">
      {formattedMeasures.map(response => {
        return (
          <Tile dim = {response.row}
          measure1 = {response.value}
          measure2 = {response.value2}
          iconURL = {response.iconURL} 
          />
        );
      })}
    </div>
  );
}

export default SimpleKPI;


// export default function Card(){
//   return (
//     <>
//       {SimpleKPI.map(SimpleKPI => (
//         <Card row = {dim.value},
//         value = {measure1.formatted},
//         value2 = {measure2.formatted} />
//       ))}
//     </>
//   )
// }
