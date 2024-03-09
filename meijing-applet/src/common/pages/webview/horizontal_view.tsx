import Taro, { Component, Config } from '@tarojs/taro';
import { WebView } from '@tarojs/components';
import { webSite, baseUrl } from '@common/utils/requests'

class WebViewPage extends Component {
  config: Config = {
    navigationBarTitleText: '',
    pageOrientation: 'landscape',
    navigationStyle: "custom"
  }

  static externalClasses = ['com-class']
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentWillUnmount() {
    const from = this.$router.params.from
    let path = ''
    switch (from) {
      case 'construction':
        path = `work/construction?title=${encodeURIComponent('工地巡查统计')}`
        break;
      case 'industry':
        path = `work/industry?title=${encodeURIComponent('行业部门统计')}`
        break;
      case 'patrol':
        path = `work/patrol?title=${encodeURIComponent('专项巡查统计')}`
        break;
      case 'patrol/department':
        path = `work/patrol/department?title=${encodeURIComponent('专项巡查统计')}`
        break;
      case 'patrol/source':
        path = `work/patrol/source?title=${encodeURIComponent('专项巡查统计')}`
        break;
      default:
        path = `work/construction?title=${encodeURIComponent('工地巡查统计')}`
        break;
    }
    Taro.navigateTo({
      url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
    })
  }

  render() {
    let url = decodeURIComponent(this.$router.params.url || '')
    if (!url) {
      return ''
    }
    if (url.indexOf(baseUrl) == -1) {
      url = `${webSite}${url}`;
    }

    console.log(url);
    return (
      <WebView src={url} />
    );
  }
}

export default WebViewPage;
