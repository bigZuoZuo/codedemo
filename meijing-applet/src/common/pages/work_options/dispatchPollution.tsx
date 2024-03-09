import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import FpiChoosePollution from '@common/components/FpiChoosePollution';
import { navBackWithData } from '@common/utils/common';


interface DispatchPollutionProps {
}

interface DispatchPollutionState {
  dataCode: string,
  chooseConfig: any
}

export default class DispatchPollution extends Component<DispatchPollutionProps, DispatchPollutionState> {
  config: Config = {
    navigationBarTitleText: '污染源选择'
  }

  constructor(props) {
    super(props);
    this.state = {
      dataCode: 'pollutionChoosedData',
      chooseConfig: []
    };
  }

  componentWillMount() {
    const { dataCode, type, radio, only } = this.$router.params;
    let chooseConfig = [];
    if (type) {
      chooseConfig.push({
        type,
        single: radio === 'true',
        only: only === 'true'
      })
    }
    this.setState({
      dataCode,
      chooseConfig
    })
  }



  onOkHandle = (allList: any) => {
    const { dataCode } = this.state;
    navBackWithData({
      [dataCode]: allList
    });
  }

  render() {
    const { chooseConfig } = this.state;
    
    return (
      <View className='content'>
        <FpiChoosePollution  onOK={this.onOkHandle} config={chooseConfig}></FpiChoosePollution>
      </View>
    )
  }
}
