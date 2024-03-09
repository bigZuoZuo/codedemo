import React from 'react';
import { Button } from 'antd';
// 预览附件
class previewFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 附件预览
  previewFile(url, name) {
    //取出上传文件的扩展名
    let index = name.lastIndexOf('.');
    let ext = name.substr(index);
    let previewHtml = '';

    if (
      ext.toLowerCase() === '.doc' ||
      ext.toLowerCase() === '.docx' ||
      ext.toLowerCase() === '.pdf'
    ) {
      previewHtml = (
        <Button
          className="btn-look"
          onClick={this.previewFilesHander.bind(this, url, name)}
          type="link"
        >
          预览
        </Button>
      );
    } else if (
      ext.toLowerCase() === '.png' ||
      ext.toLowerCase() === '.jpg' ||
      ext.toLowerCase() === '.jpeg'
    ) {
      previewHtml = (
        <Button className="btn-look" onClick={this.previewImgHander.bind(this, url)} type="link">
          预览
        </Button>
      );
    }
    return previewHtml;
  }
  /**
   * 预览文件
   * @param url
   * @param name)
   */
  previewFilesHander(url, name) {
    window.open('/api/file/preview?fileName=' + name + '&fileUrl=' + url);
  }
  //预览图片
  previewImgHander(url) {
    window.open(url);
  }
  render() {
    return <span>{this.previewFile(this.props.url, this.props.name)}</span>;
  }
}
export default previewFile;
