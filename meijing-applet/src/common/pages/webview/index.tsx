import Taro, { Component, Config } from '@tarojs/taro';
import qs from 'query-string'
import { observer, inject } from '@tarojs/mobx';
import { WebView } from '@tarojs/components';
import { webSite, baseUrl, carUrl, eventReviewUrl, carWebSite, generateStamp, caituUrl, contructionUrl } from '@common/utils/requests'
import { filterToken, filterStamp } from '@common/utils/common'
import { UserStore } from '@common/store/user'
import moment from 'moment';

//web view 嵌入页面后缀
let webViewUrlSuffix = '';

interface WebViewProps {
  userStore: UserStore;
}

@inject('userStore')
@observer
class WebViewPage extends Component<WebViewProps> {
  config: Config = {
    navigationBarTitleText: ''
  }

  static externalClasses = ['com-class']
  constructor(props) {
    super(props);

    const url = this.$router.params.url || '';
    if (url.indexOf('?') > -1 && (url.indexOf('meijing-spcar-user-web') == -1 || url.indexOf('meijing-ai-examine-web') == -1)) {
      let navBarTitle: any = '';
      const { title = navBarTitle } = qs.parse(this.$router.params.url.split('?')[1])
      navBarTitle = title
      Taro.setNavigationBarTitle({
        title: navBarTitle
      })
    }

    this.state = {

    }
  }

  componentDidShow() {
    const url = this.$router.params.url || '';
    if (url.indexOf('meijing-spcar-user-web') != -1) {
      Taro.setNavigationBarTitle({
        title: '美境专车'
      })
    } else if (url.indexOf('meijing-ai-examine-web') != -1) {
      Taro.setNavigationBarTitle({
        title: '事件审核'
      })
    }
  }

  componentWillUnmount() {
    webViewUrlSuffix = '';
  }

  onShareAppMessage(e) {
    let url = e.webViewUrl;
    let { title = '' } = qs.parse(url.split('/#/')[1]);
    if (url.indexOf('meijing-spcar-user-web') > -1) {
      title = '美境专车';
    } else if (url.indexOf('meijing-ai-examine-web') > -1) {
      title = '事件审核';
    }
    let path;
    if (webViewUrlSuffix && webViewUrlSuffix.length > 0) {
      path = webViewUrlSuffix;
      webViewUrlSuffix = '';
    } else {
      path = url.split('/#/')[1];
    }
    path = filterToken(path)
    path = filterStamp(path)

    console.log('分享的地址为:', `/pages/webview/index?url=${encodeURIComponent(path)}`);

    return {
      title: `${title}`,
      path: `/common/pages/webview/index?url=${encodeURIComponent(path)}`
    }
  }

  bindmessage(data: any) {
    if (data && data.detail && data.detail.data) {
      if (data.detail.data[0].type) {
        Taro.navigateTo({
          url: `/common/pages/webview/horizontal_view?url=${encodeURIComponent(data.detail.data[0].url)}&from=${data.detail.data[0].from}`
        })
      }
      else {
        const dataArray: any[] = data.detail.data;
        if (dataArray.length > 0) {
          webViewUrlSuffix = dataArray[dataArray.length - 1].url;
        }
      }
    }
  }

  filterUrl = (url: string) => {
    const { userStore: { token } } = this.props;
    console.log('token=>', token)
    if (url.split('http').length > 2) {
      const lastIndex = url.lastIndexOf('http')
      url = url.substr(lastIndex)
    }
    else {
      url = filterToken(url)
      url = filterStamp(url)
      const arrUrl = url.split('?')
      url = `${arrUrl[0]}?token=${token}&timeStamp=${moment().valueOf()}&${arrUrl[1]}`
    }
    return url
  }

  render() {
    let url = decodeURIComponent(this.$router.params.url || '')
    if (!url) {
      return ''
    }
    if (url.indexOf(carUrl) != -1 || url.indexOf(eventReviewUrl) != -1 || url.indexOf(caituUrl) != -1 || url.indexOf(contructionUrl) != -1) {
      url = `${carWebSite}${url}`;
    }
    else if (url.indexOf(baseUrl) == -1) {
      url = `${webSite.replace(/\d{13}/, moment().valueOf().toString())}${url}`;
    }
    url = this.filterUrl(url)
    console.log(url);
    return (
      <WebView src={url} onMessage={this.bindmessage} />
    );
  }
}

export default WebViewPage;