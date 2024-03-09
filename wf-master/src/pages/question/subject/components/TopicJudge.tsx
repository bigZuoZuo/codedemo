import React, { useEffect, useRef, useState } from 'react';
import { Radio  } from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';

import './style.less';

export default ()=>{

  const [isTrue,setIsTrue] = useState('')

  const handleRadio=(value)=>{
    setIsTrue(value)
  }

  return (
    <div className='topicCompTypeCommon topicJudge'>
      <table>
        <thead>
        <tr>
          <td width={500}>选项文字</td>
          <td width={100}>正确答案</td>
          <td width={100}>操作</td>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td className='selectedWord'>正确</td>
            <td><CheckCircleOutlined className={['radio',isTrue && 'selected']} onClick={()=>{handleRadio(1)}} /></td>
          </tr>
          <tr>
            <td className='selectedWord'>错误</td>
            <td><CheckCircleOutlined className={['radio',!isTrue && 'selected']} onClick={()=>{handleRadio(0)}} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
