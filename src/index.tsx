import React from 'react';
import { ComponentsProps } from '@incorta-org/visual-sdk';
import './styles.less';

const LiquidFillGauge = (props: ComponentsProps) => {
  console.log(props);
  return (
    <div className="test">
      <h1>Hello Incorta Visual</h1>
    </div>
  );
};

export default LiquidFillGauge;
