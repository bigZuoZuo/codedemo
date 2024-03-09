import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { UserStore } from '@common/store/user'
import { navBackWithData } from '@common/utils/common'
import FpiChoose from '@common/components/FpiChoose';

interface MyProps {
  userStore: UserStore;
}

interface MyState {
  dataCode: string,
  chooseConfig: any
}

@inject('userStore')
@observer
export default class Index extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '人员选择'
  }

  constructor(props) {
    super(props);
    this.state = {
      dataCode: 'personChoosedData',
      chooseConfig: []
    };
  }

  componentWillMount() {
    const { dataCode, type, radio, only } = this.$router.params;
    let chooseConfig = [];
    if (type) {
      chooseConfig.push({
        type,
        single: radio === 'true', //false
        only: only === 'true'   // true
      })
    }
    this.setState({
      dataCode,  // 传入上一页的data的key值
      chooseConfig
    })
  }

  onOkHandle = (allList: any) => { // 将本页数据传给上一页的data中
    const { dataCode } = this.state;
    navBackWithData({  // 传给上一页的data数据{key:value}
      [dataCode]: allList
    });
  }

  render() {
    const { userDetails } = this.props.userStore;  // 用户详情信息<==@common/store/user {userDetails} 
    const { chooseConfig } = this.state;  
    console.log(userDetails); // 用户详情信息

    return (
      <View className='content'>
        <FpiChoose user={userDetails} onOK={this.onOkHandle} config={chooseConfig} />
      </View>
    )
  }
}
