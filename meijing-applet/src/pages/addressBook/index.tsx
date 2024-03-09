import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { UserStore } from '@common/store/user';
import FpiChoose from '@common/components/FpiChoose/person';

interface MyProps {
  userStore: UserStore;
}

interface MyState {
  dataCode: string;
  chooseConfig: any;
}

@inject('userStore')
@observer
export default class Index extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '通讯录'
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
        // @ts-ignore
        type,
        // @ts-ignore
        single: radio === 'true',
        // @ts-ignore
        only: only === 'true'
      })
    }
    this.setState({
      dataCode,
      chooseConfig
    })
  }

  clickOnePerson = (user) => {
    Taro.navigateTo({
      url: `./edit?userId=${user.id}&managerFlag=${user.managerFlag}&linkmanFlag=${user.linkmanFlag}`
    })
  }

  render() {
    const { userDetails } = this.props.userStore;
    const { chooseConfig } = this.state;
    return (
      <View className='content'>
        <FpiChoose
          isEdit={false}
          user={userDetails}
          config={chooseConfig}
          onAdd={() => {}}
          onDetail={this.clickOnePerson.bind(this)}
        />
      </View>
    )
  }
}
