import React from 'react';
import { ComponentProps } from '@incorta-org/component-sdk';
import './styles.less';

const NewComponent = (props: ComponentProps) => {
  console.log(props.insight.data.data[0][0]);
  return (
    <div className="test">
      <h1>
        {props.insight.data.data[0][0].value}
        </h1>
    </div>
  );
};

export default NewComponent;
