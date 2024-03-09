import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { UserStore } from '@common/store/user';
import FpiCamera, { Photo } from '@common/components/FpiCamera'
import TopBar from '@common/components/TopBar'
import { SystemInfoStore } from '@common/store/systeminfo'
import './clap.scss'

interface MyProps {
  userStore: UserStore;
  systemInfoStore: SystemInfoStore;
}

interface MyState {
  photos: Photo[],
  isForbidden: boolean,
}

//状态栏高度
let statusBarHeight = 20;

@inject('userStore', 'systemInfoStore')
@observer
export default class Index extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '素材',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
    enablePullDownRefresh: true,
    navigationStyle: 'custom'
  }

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      isForbidden: false
    };
  }

  // 获取(设置)初始化偏移量
  setInitStatusHeight = () => {
    const { systemInfoStore } = this.props;
    statusBarHeight = systemInfoStore.systemInfo.statusBarHeight;
    if (systemInfoStore.systemInfo.model === "iPhone 5") {
      statusBarHeight = 22;
    }
  }

  componentWillMount() {
    this.setInitStatusHeight();
  }

  onComplete = (list: Photo[]) => {
    this.setState({
      photos: list
    }, () => {
      const url = `../inspectReport/clap?photos=${JSON.stringify(list)}`
      Taro.redirectTo({ url })
    })
  }

  onChange = (isShow) => {
    Taro.setNavigationBarColor({
      backgroundColor: isShow ? '#14171A' : '#FFFFFF',
      frontColor: isShow ? '#ffffff' : '#000000'
    })
  }

  componentDidShow() {
    let that = this;
    Taro.getSetting({
      success(res) {
        that.setState({
          isForbidden: !res.authSetting['scope.camera']
        })
      },
    })
  }

  onBackHandle = () => {
    this.onComplete(this.state.photos)
  }

  render() {
    return (
      <View className={`root_view  pd_${statusBarHeight}`}>
        <TopBar fixed title='素材' onBack={this.onBackHandle} />
        <FpiCamera isShaoXing com-class='camara' onOK={this.onComplete.bind(this)} onStatus={this.onChange} isFobidden={this.state.isForbidden} />
      </View>
    )
  }
}
