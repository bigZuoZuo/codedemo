import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Image, Label} from '@tarojs/components'
import {rootSourceBaseUrl} from '@common/utils/requests'
import {SimpleRichView} from "@common/components/rich-text";
import isEmpty from 'lodash/isEmpty'
import moment from "moment";
import './success.scss'
import {
  getPatrolInfo,
  getInspectItemList,
} from '../../service/patrolReport'


const formatStr = 'YYYY-MM-DD HH:mm'

interface successProps {

}

interface successState {
  patrolId: string,
  patrolInfo: any,
  inspectItemList: any,
}

export default class Success extends Component<successProps, successState> {

  config: Config = {
    navigationBarTitleText: '工地巡查',
    navigationBarBackgroundColor: '#107EFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#107EFF',
  }

  constructor(props) {
    super(props)
    const params = this.$router.params;
    let patrolId = '0';
    if (params && params.patrolId) {
      patrolId = params.patrolId;
    }
    this.state = {
      patrolId,
      patrolInfo: {},
      inspectItemList: [],
    }
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const {patrolId} = this.state;
    getPatrolInfo(patrolId).then(res => {
      if (res && res.data) {
        this.setState({
          patrolInfo: res.data
        })
      }
    })
    getInspectItemList(patrolId).then(res => {
      if (res && res.data) {
        this.setState({
          inspectItemList: res.data
        })
      }
    })
  }

  toDetail(inspectId) {
    Taro.navigateTo({
      url: `/pages/works/detail?inspectId=${inspectId}`
    })
  }

  render() {
    const {patrolInfo, inspectItemList} = this.state;
    return (
      <View className='content'>
        <View className='middleView'>
          <View className='imageView'>
            <Image className='successIcon' src={`${rootSourceBaseUrl}/assets/works/success.png`} />
          </View>
          <View className='textView'>
            <Text className='text'>提交成功</Text>
          </View>
        </View>
        <View className='totalList'>
          <View className='list'>
            <Label className='label'>巡查工地：</Label>
            <Text className='text'>{patrolInfo.pollutionSourceName}</Text>
          </View>
          <View className='list'>
            <Label className='label'>巡查时间：</Label>
            <Text className='text'>
              {patrolInfo.reportDataTime ? moment(patrolInfo.reportDataTime).format(formatStr) : ''}
            </Text>
          </View>
          <View className='list'>
            <View className='flex1'>
              <Label className='label'>发现问题：</Label>
              <Text className='number'>{patrolInfo.inspectCount}项</Text>
            </View>
          </View>
        </View>
        {!isEmpty(inspectItemList) &&
          <View className='header'>巡查关联事件</View>
        }


        <View className='imgList'>
          {inspectItemList.map((item, i) => {
              return (
                <View
                  className='list'
                  key={i}
                  onClick={() => {
                    this.toDetail(item.inspectId)
                  }}
                >
                  <View>
                    <Image
                      src={item.pictureOssLinks[0]}
                      className='img'
                    />
                  </View>
                  <View>
                    <View className='text'>
                      <SimpleRichView
                        class-name='SimpleRichView'
                        content={item.content}
                      />
                    </View>
                    {item.status ?
                      <View className='successColor'>
                        处置完成
                      </View>
                      :
                      <View className='errColor'>未处置</View>
                    }
                  </View>
                </View>
              )
            }
          )}
        </View>
      </View>
    )
  }
}
