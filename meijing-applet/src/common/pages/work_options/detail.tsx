import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, Label} from '@tarojs/components'
import {rootConstructionSourceBaseUrl} from '@common/utils/requests'
import {SimpleRichView} from "@common/components/rich-text";
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import './detail.scss'
import {
  currentLevel,
  getPatrolInfo,
  getPollutionById,
  getPatrolItemList,
  getInspectItemList,
} from '../../service/patrolReport'
import EmptyHolder from "@common/components/EmptyHolder";
import { get, chunk } from 'lodash';


const topBgUrl = `${rootConstructionSourceBaseUrl}/assets/pages/work/brg.png`
const formatStr = 'YYYY-MM-DD HH:mm'

interface DetailProps {

}

interface DetailState {
  patrolId: string           // 记录id
  pollutionSourceId: string  // 污染源id
  current: number            // 当前选中标签
  baseData: any              // 基础信息
  progressStatusList: any
  inspectCount: number      // 发现的问题数量
  patrolItemList: any       // 巡查检查项列表
  inspectItemList: any      // 其他问题
}

class Detail extends Component<DetailProps, DetailState> {

  constructor(props) {
    super(props)
    const params = this.$router.params;
    let patrolId = '0';
    let pollutionSourceId = '0';
    if (params && params.pollutionSourceId) {
      pollutionSourceId = params.pollutionSourceId;
    }
    if (params && params.patrolId) {
      patrolId = params.patrolId;
    }
    this.state = {
      patrolId,
      pollutionSourceId,
      baseData: {},
      current: 0,
      progressStatusList: [
        {label: '地基处理、土方开挖', value: 'GROUND_TREATMENT'},
        {label: '基础/地下施工', value: 'FOUNDATION_CONSTRUCTION'},
        {label: '主体施工', value: 'MAIN_CONSTRUCTION'},
        {label: '毛坯施工', value: 'BLANK_CONSTRUCTION'},
        {label: '室内装修', value: 'INTERIOR_TRIM'},
        {label: '完工', value: 'COMPLETE'}
      ],
      inspectCount: 0,
      patrolItemList: [],
      inspectItemList: [],
    }
  }

  config = {
    navigationBarTitleText: '巡查记录'
  };

  componentDidMount() {
    this.getInitData()
  }

  getInitData = async () => {
    try {
      const {patrolId, pollutionSourceId, progressStatusList} = this.state;
      const patrolRes = await getPatrolInfo(patrolId);
      const baseData = patrolRes.data;
      console.log(baseData)
      // console.log(baseData)
      // return;
      // const pollutionData = await getPollutionById(pollutionSourceId);
      // const otherData = pollutionData.data.appendDatas;
      // let constructionSiteProgress = '';
      // let progressStatus = '';
      // if (otherData && otherData.constructionSiteProgress) {
      //   constructionSiteProgress = otherData.constructionSiteProgress;
      //   progressStatusList.forEach(element => {
      //     if (element.value === constructionSiteProgress) {
      //       progressStatus = element.label
      //     }
      //   });
      // }
      // const {appendData={}} = baseInfo;
      // let baseData = {
      //   ...baseInfo,
      //   progressStatus: appendData.progressStatus,// 工地进度状态
      //   currentWorkStatus: appendData.data.status,// 工作状态
      //   hasLicense: appendData.hasLicense,
      //   nonRoadGreenNumber: appendData.nonRoadGreenNumber,
      //   nonRoadNumber: appendData.nonRoadNumber
      // };

      this.setState({
        baseData,
        inspectCount: baseData.inspectCount
      })
      getPatrolItemList(patrolId).then(res => {
        if (res && res.data) {
          this.setState({
            patrolItemList: res.data,
          })
        }
      })
      if (baseData.inspectCount > 0) {
        getInspectItemList(patrolId).then(res => {
          if (res && res.data) {
            this.setState({
              inspectItemList: res.data,
            })
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }


  showBigImage(urls: string[],current:string) {
    Taro.previewImage({
      urls: urls,
      current
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }
  toDetail(inspectId) {
    Taro.navigateTo({
      url: `/pages/works/detail?inspectId=${inspectId}`
    })
  }



  render() {
    const {current, baseData, inspectCount, patrolItemList, inspectItemList,progressStatusList} = this.state;
    let progressStatus = '';
    if (baseData && baseData.appendData &&baseData.appendData.constructionSiteProgress) {
      const constructionSiteProgress = baseData.appendData.constructionSiteProgress;
      progressStatusList.forEach(element => {

        if (element.value === constructionSiteProgress) {
          progressStatus = element.label
        }
      });
    }
    const appendDataList = get(baseData, 'appendData', [])
    return (
      <View className='page'>
        <View className='title'>
          <View>
            <Image src={topBgUrl} className='topImg' />
          </View>
          <View className='txt'>
            <View className='headerWarp'>
              <Text className='header'>{baseData.pollutionSourceName}</Text>
              {/*<Text className='flag'>待审核</Text>*/}
              {/*<Text className='failure'>待审核</Text>*/}
              {/*<Text className='success'>通过</Text>*/}
            </View>
            <View className='titleList'>
              <View className='flex1'>
                <Label>巡查人：</Label>
                <Text>{baseData.reportUserName}</Text>
              </View>
              <View>
                <Label>巡查时间：</Label>
                <Text>{baseData.reportDataTime ? moment(baseData.reportDataTime).format(formatStr) : ''}</Text>
              </View>
            </View>
            {
              chunk(appendDataList, 2).map((item, index) => {
                return (
                  <View key={index} className='titleList'>
                    {item.map((childItem, childIndex) => (
                      <View key={childIndex} className='flex1'>
                        <Label>{get(childItem, 'targetName')}：</Label>
                        <Text>{get(childItem, 'valueName')}</Text>
                      </View>
                    ))}
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className='tabs'>
          <View className='item' onClick={() => {
            this.handleClick(0)
          }}
          >
            <Text className={current === 0 ? 'itemName choose' : 'itemName'}>巡查发现问题</Text>
          </View>

          <View className='item' onClick={() => {
            this.handleClick(1)
          }}
          >
            <Text className={current === 1 ? 'itemName choose' : 'itemName'}>巡查关联事件({inspectCount})</Text>
          </View>


        </View>
        <View className={current === 0 ? 'content show' : 'content'}>
          {isEmpty(patrolItemList) &&
          <View className='isEmpty'>
            <EmptyHolder text='暂无数据' />
          </View>
          }
          {!isEmpty(patrolItemList) && patrolItemList.map((item, index) => {
            return (
              <View className='listWarp' key={index+item.id}>
                <View className='header'>
                  <Image src={currentLevel[item.optionLevel].img} className='icon' />
                  <Text>
                    {item.checkItemContent}
                  </Text>
                </View>
                {!isEmpty(item.pictureOssLinks) &&
                <View className='imgList'>
                  {item.pictureOssLinks.map((img, i) => {
                    return <Image
                      key={i+img}
                      src={img}
                      className='img'
                      onClick={() => {
                        this.showBigImage(item.pictureOssLinks,img)
                      }}
                    />
                  })
                  }
                </View>
                }
                {item.content &&
                <View className='description'>
                  描述：{item.content}
                </View>
                }
              </View>
            )
          })}
        </View>
        <View className={current === 1 ? 'content show' : 'content'}>
          {isEmpty(inspectItemList) &&
            <View className='isEmpty'>
              <EmptyHolder text='没有发现问题' />
            </View>
          }
          <View className='otherWarp'>
            {!isEmpty(inspectItemList) && inspectItemList.map((item, i) => {
              return (
                <View
                  className='list'
                  key={i+item.inspectId}
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
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default Detail
