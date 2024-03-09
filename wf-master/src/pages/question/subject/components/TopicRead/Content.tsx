
import React, { useRef, useState } from 'react';
import { Radio } from 'antd';

import '../style.less'

export default ()=>{
 // 题型选择
 const [topicType,setTopicType] = useState(1)
 const topicTypeChange = (e: RadioChangeEvent) => {
   // console.log('radio checked', e.target.value);
   setTopicType(e.target.value);
 };

  return (
    <div className='topicRead'>
      <header className='header'>
        <div className='checkedBoxItem'>
              <span className='title'>题型选择</span>
              <Radio.Group onChange={topicTypeChange} value={topicType}>
                <Radio value={1}>选择题</Radio>
                <Radio value={4}>填空题</Radio>
                <Radio value={5}>简答题</Radio>
              </Radio.Group>
          </div>
      </header>
    </div>
  )
}
