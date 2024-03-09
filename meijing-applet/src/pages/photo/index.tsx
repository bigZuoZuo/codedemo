import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { UserStore } from '@common/store/user';
import FpiCamera, { Photo } from '@common/components/FpiCamera'

interface MyProps {
  userStore: UserStore;
}

interface MyState {
  photos: Photo[],
  isForbidden: boolean,
}

@inject('userStore')
@observer
export default class Index extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '素材',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
    disableScroll: true
  }

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      isForbidden: false
    };
  }

  onComplete = (list: Photo[]) => {
    this.setState({
      photos: list
    }, () => {
      const { from = 'report' } = this.$router.params
      let url = ''
      if (from === 'clap') {
        // 随手拍
        url = `../inspectReport/clap?type=INCIDENT&photos=${JSON.stringify(list)}`
      }
      else {
        const { userStore: { userDetails } } = this.props;
        //@ts-ignore
        switch (userDetails.divisionCode) {
          case '520111000000':
            // 贵阳经开区
            url = `../inspectReport/report_jk?type=INCIDENT&photos=${JSON.stringify(list)}`
            break;
          case '120116000000':
            // 天津滨海新区
            url = `../inspectReport/report_bh?type=INCIDENT&photos=${JSON.stringify(list)}`
            break;
          case '654002000000':
            // 伊犁哈萨克自治州伊宁市
            url = `../inspectReport/report_yn?type=PATROL&photos=${JSON.stringify(list)}`
            break;
          case '330600000000':
            // 绍兴
            url = `../inspectReport/report_sx?type=INCIDENT&photos=${JSON.stringify(list)}`
            break;
          default:
            url = `../inspectReport/report?type=PATROL&photos=${JSON.stringify(list)}`
        }
      }

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

  render() {
    return (
      <View className='content'>
        <FpiCamera onOK={this.onComplete.bind(this)} onStatus={this.onChange} isFobidden={this.state.isForbidden} />
      </View>
    )
  }
}
