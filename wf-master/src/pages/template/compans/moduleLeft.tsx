import React from 'react';
import type { FC } from 'react';
import './moduleLeft.less';
import ModuleTitle from './moduleTitle';

interface props {
  leftModules: any;
  getLeftItemCallBack: any;
};
const ModuleLeft: FC<props> = ( props: props ) => {


  // 拖拽结束
  const mouseUpHadele: any = (index: any,sindex: any,ssindex: any,event: any) => {
    console.log(index,sindex,ssindex,event);
    const event_new: any = event || window.event;
    const {clientX} = event_new;
    // const {clientY} = event_new;
    // if ((clientX > 780 && clientX < 1030)) {
      console.log(clientX)
    const scaleNum=document.getElementsByClassName('ant-layout-content')[0].clientWidth/1712;
    // console.log(scaleNum);
    if (clientX > 240+540*scaleNum) {
      const {getLeftItemCallBack} = props;
      const item = props.leftModules[index].moduleGroupTypeList[sindex].lrmModuleGroupList[ssindex];
      item.moduleGroupTypeCode = props.leftModules[index].moduleGroupTypeCode;
      item.moduleGroupTypeName = props.leftModules[index].moduleGroupTypeName;
      item.lrmModuleGroupCode = props.leftModules[index].moduleGroupTypeList[sindex].lrmModuleGroupCode;
      item.lrmModuleGroupName = props.leftModules[index].moduleGroupTypeList[sindex].lrmModuleGroupName;
      console.log(item);
      getLeftItemCallBack(item);
    }
  }
  return (
    <div className="moduleLeft">
      {
        props.leftModules.map((item: any, index: any) => (
          <div key={index} className={index === 0 ? 'top' : 'bottom'}>
            <ModuleTitle moduleTitle={item.moduleGroupTypeName} />
            {
              item.moduleGroupTypeList.map((sitem: any, sindex: any) => (
                <div key={sindex} className="moduleItem">
                  <div className="title">{sitem.lrmModuleGroupName}</div>
                  {
                    sitem.lrmModuleGroupList.map((ssitem: any, ssindex: any) => (
                      <div 
                        onDragEnd={()=>{mouseUpHadele(index,sindex,ssindex)}} 
                        className="item"
                        draggable="true"
                        key={ssindex}
                        data-code={ssitem.lrmModuleTypeCode}
                      >{ssitem.lrmModuleTypeName}
                      </div>
                    ))
                  }
                </div> 
              ))
            }

          </div>
        ))
      }
    </div>
  );
}

export default ModuleLeft;
