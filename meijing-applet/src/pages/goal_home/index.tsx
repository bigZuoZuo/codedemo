import Taro, { Component, Config } from '@tarojs/taro';
import { observer, inject } from '@tarojs/mobx';
import { WebView } from '@tarojs/components';
import { UserStore } from '@common/store/user'
import { webSite } from '@common/utils/requests'
import moment from 'moment';

interface WebViewProps {
  userStore: UserStore;
}

interface WebViewState {
  url: string
}

@inject('userStore')
@observer
class WebViewPage extends Component<WebViewProps, WebViewState> {
  config: Config = {
    navigationBarTitleText: "目标",
    disableScroll: true,
    enablePullDownRefresh: false,
    disableSwipeBack: true
  };

  static externalClasses = ['com-class']
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    }
  }

  componentWillMount() {
    this.setState({ url: this.filterUrl() })
  }

  componentDidShow() {
    if (Taro.getStorageSync('areaChange')) {
      console.log('change')
      this.setState({ url: this.filterUrl(true) })
      Taro.removeStorageSync('areaChange')
    }
  }

  filterUrl = (isRefresh: boolean = false) => {
    const { userStore: { token } } = this.props;
    console.log('token=>', token)
    const url = `http://127.0.0.1:8000/meijing-research-web/${moment().valueOf()}/#/target?${isRefresh ? `time=${moment().valueOf()}&` : ''}token=${token}&timeStamp=${moment().valueOf()}&title=${encodeURIComponent('目标')}`
    return url
  }

  render() {
    const { url } = this.state
    return (
      <WebView src={'https://www.baidu.com/'} />
    );
  }
}

export default WebViewPage;