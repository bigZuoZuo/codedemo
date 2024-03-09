import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Block, Button } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import isEmpty from 'lodash/isEmpty'
import FilterTabs, { FilterTabsType } from '@common/components/FilterTabs'
import ListView from '@common/components/ListView'
import EmptyHolder from '@common/components/EmptyHolder'
import DeviceItem from '../../components/DeviceItem'
import { getSiteTypeByMonitorType,getVideoBySiteType } from '../../service/video'
import './index.scss'

interface SentryProps {
  userStore: any
}

interface SentryState {
  /**
   * tab选项id
   */
  tabId: number;
  siteTypes: any[];
  siteVideoList: any[];
  offset: number;
  limit: number;
  /**
   * 列表是否可以加载更多（优化）
   */
  hasMore: boolean;
  /**
   * 是否正在加载数据
   */
  isLoading: boolean;
}

@inject('userStore')
@observer
export default class Sentry extends Component<SentryProps, SentryState> {

  config: Config = {
    navigationBarTitleText: '视频监控',
  }

  constructor(props) {
    super(props)
    this.state = {
      tabId: 0,
      siteTypes: [],
      siteVideoList: [],
      offset: 0,
      limit: 20,
      hasMore: true,
      isLoading: true,
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    getSiteTypeByMonitorType("video").then(resp=>{
      this.setState({
        siteTypes: resp.data,
      },()=>{
          this.getNewVideos();
      });
    }).catch(error => {
      Taro.showToast({
          title: "数据加载失败，请重试！",
          icon: 'none'
      })
    });
  }


  // 加载更多
  onScrollToLower = (callback) => {
    this.getMoreVideos(callback);
  }

  //下拉刷新
  onScrollToUpper = () => {
      this.getNewVideos();
  }

  getNewVideos(){
    const {limit, siteTypes, tabId } = this.state;
    let offset = 0;
    if(siteTypes.length == 0){
      return;
    }
    const selectSiteTypeCode = siteTypes[tabId].code;

    getVideoBySiteType({
      siteTypeCode: selectSiteTypeCode,
      offset,
      limit
    }).then(resp=>{
      const { data: { entries } } = resp;
      this.setState({
        siteVideoList: entries,
        hasMore: limit == entries.length,
        offset,
        isLoading: false,
      });
    }).catch(error => {
      Taro.showToast({
          title: "数据加载失败，请重试！",
          icon: 'none'
      })
    });
  }


  getMoreVideos = (callback) => {
    const { offset, limit, hasMore, siteTypes, tabId, siteVideoList } = this.state;
    if (!hasMore) { return; }
    
    let newOffset = offset + limit;
    const selectSiteTypeCode = siteTypes[tabId].code;

    getVideoBySiteType({
      siteTypeCode: selectSiteTypeCode,
      offset: newOffset,
      limit
    }).then(resp => {
        const { data: { entries } } = resp;
        this.setState({
            siteVideoList: siteVideoList.concat(entries),
            offset: newOffset,
            hasMore: limit == entries.length,
            isLoading: false,
        }, () => {
            if (callback) {
                callback();
            }
        });
    }).catch(res => {
        if (callback) {
            callback();
        }
    });
  }

  tabChoose(item: FilterTabsType) {
    this.setState({
        tabId: Number(item.id),
        siteVideoList: [],
        isLoading: true
    }, () => {
        if (item.id != 0) {
            Taro.setStorageSync('work-search-filter', {})
        }
        this.getNewVideos();
    });
  }  


  render() {
    const { siteVideoList, hasMore, isLoading,tabId,siteTypes } = this.state;
    const showEmpty = (<View className='empty'><EmptyHolder text='暂无视频' /></View>)
    let isEmptyData = !siteVideoList || siteVideoList.length == 0;

    const showVideoList = siteVideoList.map((siteVideo, index) => {
      return (
        <DeviceItem key={siteVideo.siteCode} data={siteVideo} />
      );
    });

    const tabsData: any[] = siteTypes.map((st,index) =>({
      id: index, 
      name: st.name,
    }));

    return (
        <View className='content'>
          <View className='topTabView'>
              <View className='tabs'>
                  <FilterTabs isMore={false}
                    data={tabsData}
                    tabId={tabId}
                    onMore={() => { }}
                    rowNum={4}
                    showFilter={false}
                    onTab={this.tabChoose.bind(this)} 
                  />
              </View>
          </View>

          <ListView
            com-class='workListView'
            hasMore={hasMore}
            hasData={!isEmpty(siteVideoList)}
            onEndReached={this.onScrollToLower}
            onRefresh={this.onScrollToUpper}
            showLoading={isLoading}
          >
            {isEmptyData ? showEmpty : showVideoList}
          </ListView>
        </View>
    )
  }
}
