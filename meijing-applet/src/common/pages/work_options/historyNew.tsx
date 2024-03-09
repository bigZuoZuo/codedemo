import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Label, ScrollView} from '@tarojs/components'
import isEmpty from 'lodash/isEmpty';
import EmptyHolder from "@common/components/EmptyHolder";
import moment from "moment";
import './historyNew.scss'
import {getPatrolInfoList} from '../../service/patrolReport'

interface historyNewProps {

}

interface historyNewState {
  pollutionSourceId: string,
  offset: number,
  pageData: any,
  hasMore: boolean,
}

const limit = 10;
const formatStr = 'YYYY-MM-DD HH:mm'

export default class HistoryNew extends Component<historyNewProps, historyNewState> {

  config: Config = {
    navigationBarTitleText: '历史记录',
  }

  constructor(props) {
    super(props)
    const params = this.$router.params;
    let pollutionSourceId = '0';
    if (params && params.pollutionSourceId) {
      pollutionSourceId = params.pollutionSourceId;
      console.log('pollutionSourceId=>', pollutionSourceId)
    }
    this.state = {
      pollutionSourceId,
      offset: 0,
      pageData: [],
      hasMore: true,
    }
  }

  componentDidMount() {
    this.getPage();
  }

  getPage = () => {
    const {pollutionSourceId, pageData, hasMore, offset} = this.state;
    if (!hasMore) {
      return;
    }
    getPatrolInfoList({
      pollutionSourceId,
      limit,
      offset
    }).then(res => {
      if (res && res.data) {
        const {entries} = res.data;
        this.setState({
          offset: offset + limit,
          pageData: pageData.concat(entries),
          hasMore: limit <= entries.length,
        })
      }
    })
  }
  loadPage = () => {
    this.getPage();
  }
  goDetail = (patrolId)=>{
    const {pollutionSourceId} = this.state;
    Taro.navigateTo({
      url: `./detail?pollutionSourceId=${pollutionSourceId}&patrolId=${patrolId}`
    })
  }
  render() {
    const {pageData, hasMore} = this.state;
    let loadMoreTxt: string = '数据加载中···';
    if (!hasMore) {
      loadMoreTxt = '没有更多了';
    }
    return (
      <View className='history'>
        <View className='space' />
        {isEmpty(pageData) &&
        <View className='Empty'><EmptyHolder text='暂无数据' /></View>
        }
        {!isEmpty(pageData) &&
        <View>
          <ScrollView
            scrollY
            className='historyListWarp'
            onScrollToLower={() => {
              this.loadPage()
            }}
          >
            {pageData.map((item, index) => {
              return (
                <View
                  className='historyList'
                  key={item.patrolId}
                  onClick={()=>{this.goDetail(item.patrolId)}}
                >
                  <View className='title'>{item.pollutionSourceName}</View>
                  <View className='row'>
                    <Label className='label'>巡查时间：</Label>
                    <Text className='text'>{moment(item.reportDataTime).format(formatStr)}</Text>
                  </View>
                  <View className='row'>
                    <Label className='label'>巡查人员：</Label>
                    <Text className='text'>{item.reportUserName}（{item.reportDepartmentName}）</Text>
                  </View>
                  <View className='row flex'>
                    <Label className='label'>发现问题：</Label>
                    <Text className={item.inspectCount > 0 ? 'general' : 'text'}>{item.inspectCount}</Text>
                  </View>
                </View>
              )
            })
            }
            {pageData.length > 10 &&
              <View className='more'>{loadMoreTxt}</View>
            }

          </ScrollView>

        </View>
        }
      </View>
    )
  }

}
