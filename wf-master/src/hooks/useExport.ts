import React from 'react';
import axios from 'axios';
import {Button} from 'antd';
type exportConfig={
  url:string,
  params:object,
  name?:string,
  type?:string
}
const useExport = (config:exportConfig) => {
  const handleExport = () => {
    debugger
    axios({
      url: config.url,
      method: 'post',
      responseType: 'arraybuffer',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Authorization': 'Bearer ' + sessionStorage.getItem('headers_token'), },
      data: config.params,
    }).then((res:any) => {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel'  });
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      const time = new Date().getTime();//毫秒值
      downloadElement.download = config.name + time + '.' + config.type; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象 
    })
      .catch((error:any) => {

      });
  }
  return (
    <span onClick={handleExport}>{config.title} </span>
  )
}
export default useExport;