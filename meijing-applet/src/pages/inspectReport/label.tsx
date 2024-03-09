import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { UserStore } from '@common/store/user'
import { pollutionTypes } from '../../service/inspect'
import MjLabelChoose from '../../components/MjLabel/labelChoose'
import { get, isEmpty } from 'lodash'
import './label.scss'

interface ReportLabelProps {
  userStore: UserStore;
}

interface ReportLabelState {
  config: any;
}

@inject('userStore')
@observer
export default class Index extends Component<ReportLabelProps, ReportLabelState> {
  config: Config = {
    navigationBarTitleText: '标签选择'
  }

  constructor(props) {
    super(props);
    this.state = {
      config: {}
    };
  }

  componentDidMount() {
    try {
      pollutionTypes().then(res => {
        const configs = get(res, 'data', [])
        this.setState({
          config: get(configs.find(item => item.code === 'pollution-type'), 'config')
        })
      })
    }
    catch (err) { }
  }

  onChooseHandle = () => {

  }

  render() {
    const { config } = this.state
    return (
      <ScrollView className='report-label-page' scrollY scrollWithAnimation>
        <View className='container'>
          {
            get(config, 'labels', []).map(itemConfig => {
              const pollutionTypes = get(itemConfig, 'pollutionTypes', [])
              return (<View className='group'>
                <View className='title'>{itemConfig.typeName}</View>
                <View className='labels'>
                  {
                    pollutionTypes.map(pt => <MjLabelChoose data={pt} onChoose={this.onChooseHandle} />)
                  }
                </View>
              </View>)
            })
          }
        </View>
      </ScrollView>
    )
  }
}