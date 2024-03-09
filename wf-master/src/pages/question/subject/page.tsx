
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Tree, Select, Radio, Table,Modal ,message ,Checkbox  } from 'antd';
import request from '@/utils/umi-request';
import 'braft-editor/dist/index.css'

import './style.less';

export default () => {



  return (
    <div className='confirmUpload'>
      <header className='header'>预览（导入xxx道题，成功xx道，错误xx道）</header>
      <div className='content'>
        <li>
          <span className='lable'>类型：</span>
          <span className='con'>选择题</span>
        </li>
        <li>
          <span className='lable'>题干：</span>
          <span className='con'>空间布局是体系化视觉设计的起点，和传统的平面设计的不同之处在于，UI 界面的布局空间要基于「动态、体系化」的角度出发展开。我们受到建筑界大师柯布西耶的模度思想的启发 <br />
            <br />
            A: 理论联系实际<br />
            B: 在实践中验证整理
          </span>
        </li>
        <li>
          <span className='lable'>正确答案：</span>
          <span className='con'>A</span>
        </li>
        <li>
          <span className='lable'>题目解析：</span>
          <span className='con'>空间布局是体系化视觉设计的起点，和传统的平面设计的不同之处在于，UI 界面的布局空间要基于「动态、体系化」的角度出发展开。我们受到建筑界大师柯布西耶的模度思想的启发</span>
        </li>
      </div>
      <footer className='footerBox'>
        <Button>确认导入</Button>
        <Button>取消</Button>
      </footer>
    </div>
  )
}
