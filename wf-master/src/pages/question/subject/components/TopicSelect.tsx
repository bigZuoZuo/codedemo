import React, { useEffect, useRef, useState } from 'react';
import { Button,Checkbox  } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

import './style.less';

const BraftEditorControls = ['font-size','line-height','underline','media']

export default ()=>{
  const [topicList,setTopicList] = useState([
    {
      index:65,
      isTrue:false,
      handleType:'add'
    },{
      index:66,
      isTrue:false,
      handleType:'minus'
    },{
      index:67,
      isTrue:false,
      handleType:'minus'
    }
  ])
  // 操作方法
  const handle =(type: string,index?: number)=>{
    let tempList = JSON.parse(JSON.stringify(topicList))

    if(type === 'add'){
      tempList.push({
        isTrue:false,
        handleType:'minus'
      })
    }

    if(type === 'minus'){
      tempList = tempList.filter((item,key)=>{
        if(key === index){
          return false
        }
        return true
      })
    }

    // 重新排序
    for(let i=0;i<tempList.length;i++){
      tempList[i].index = 65 + i
    }

    setTopicList(tempList)
  }


  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };

  // 大题题干
  const [bigTopicTitle ,setBigTopicTitle] = useState("");
  const bigTopicTitleChange = (editorState) => {
    setBigTopicTitle({ editorState })
  }
  const bigTopicTitleSave=()=>{
    console.log(editorState)
  }

  return (
    <div className='topicCompTypeCommon topicSelect'>
      <table>
        <thead>
        <tr>
          <td width={500}>选项文字</td>
          <td width={100}>正确答案</td>
          <td width={100}>操作</td>
        </tr>
        </thead>
        <tbody>
        {topicList.map((item,key: number)=>{
          return (
            <tr key={key}>
              <td className='selectedTd'>
                <span className='liNum'>选项{String.fromCharCode(item.index)}</span>
                <BraftEditor
                  value={bigTopicTitle}
                  onChange={bigTopicTitleChange}
                  onSave={bigTopicTitleSave}
                  controls={BraftEditorControls}
                  className='braftEditor'
                />
              </td>
              <td>
              <Checkbox onChange={onChange} />
              </td>
              <td>
                <Button onClick={()=>handle(item.handleType,key)} type="link">{item.handleType === "add" ? '新增' : '删除'}</Button>
              </td>
            </tr>
          )
        })}
        </tbody>


      </table>
    </div>
  )
}
