//// @ts-nocheck

import React from 'react';
import { ComponentProps, Setting } from '@incorta-org/component-sdk';
import './styles.less';
import { Tile } from './Tile';

const SimpleKPI = ({ insight: { data, context } }: ComponentProps) => {
  const insightData = data.data;
  const [aggregationData] = insightData;
  var maxTiles = Number(context.insight.settings?.maxTiles) || 4;
  let tiles = 0;

  const formattedMeasures = data.data.map((col, index) => {
    let [dim, measure1, measure2] = col;
    console.log('MAX TILES: ', { tiles }, { maxTiles });

    tiles++;
    return {
      row: dim.value,
      value: String(measure1.formatted),
      value2: String(measure2.formatted),
      iconURL:
        context.insight.settings?.iconURL ||
        'https://www.pngkey.com/png/full/675-6751777_general-info-icon.png'
    };
  });

  //FIXME: condition either show all or nothing
  if (tiles <= maxTiles) {
    return (
      <div className="SimpleKPI__wrapper">
        {formattedMeasures.map(response => {
          return (
            <Tile
              dim={response.row}
              measure1={response.value}
              measure2={response.value2}
              iconURL={response.iconURL}
            />
          );
        })}
      </div>
    );
  } else return null;
};

export default SimpleKPI;
