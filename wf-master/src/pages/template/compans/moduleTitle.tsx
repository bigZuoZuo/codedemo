import React from 'react';
import type { FC } from 'react';
import './moduleTitle.less';

interface props {
  moduleTitle: any;
  
};
const ModuleTitle: FC<props> = (props: props ) => {
  return (
    <div className="moduleTitle">{props.moduleTitle}</div>
  );
}

export default ModuleTitle;
