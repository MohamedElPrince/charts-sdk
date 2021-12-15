import React, { useState, useEffect } from 'react';
import './styles.less';

interface TileProps {
  dim: string;
  measure1: string;
  measure2: string;
  iconURL: string
}

export const Tile: React.FC<TileProps> = ({ dim: coinId, measure1: price, measure2: priceChange, iconURL: iconURL}) => {

  // TODO: Make the overall tile narrower and or responsive
  const renderCoinData = () => {
    // TODO: Need to allow for different currencies and locales
    const iso_4217_code = 'USD';
    return Response ? (
      <>
        <div className="coinName">{coinId}</div>
        {/* <img className="icon" src={iconURL} /> */}
        <div className="price">
          {price}
          {/* <span className="currency">{iso_4217_code}</span> */}
        </div>
        <div className="separator"></div>
        {/* <div className="arrow"> &#x25B2; </div> */}
        {!priceChange.startsWith('-') ? (
          <div className="arrowUp"> &#x25B2; </div>
        ) : (
          <div className="arrowDown"> &#x25BC; </div>
        )}


        {!priceChange.startsWith('-') ? (
        <div className="priceChangeUp">
          {!priceChange.startsWith('-') ? priceChange : priceChange.substr(1)}
        </div>
        ) : (
          <div className="priceChangeDown">
            {!priceChange.startsWith('-') ? priceChange : priceChange.substr(1)}
          </div>
        )}


      </>
    ) : (
      ''
    );
  };

  return <div className="boundingBox">{renderCoinData()}</div>;
};
