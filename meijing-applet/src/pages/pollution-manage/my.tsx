import Taro, {Component, Config} from '@tarojs/taro';
import {View, Text} from '@tarojs/components'
import {observer, inject} from '@tarojs/mobx';
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import SearchBox from '@common/components/SearchBox'
import ListView from '@common/components/ListView'
import EmptyHolder from '@common/components/EmptyHolder'
import FpiConfirm from '@common/components/FpiConfirm';
import PollutionItem from '@common/components/FbiItems/PollutionItem'

import {
  personListById,
  delPollutionDetail,
  getPollutionSourceTypeList
} from '../../service/pollutionType'
import './index.scss'
import {getLocation} from "../../service/userDivision";


interface PollutionProps {
  userStore: any;
}

interface PollutionState {
  pollutionList: any[]
  paramQuery: {
    queryContent: string,
    offset: number,
    limit: number
  },
  /**
   * 是否初始化加载数据
   */
  isInit: boolean,
  /**
   * 是否存在更多
   */
  hasMore: boolean,
  /**
   * 是否loading中
   */
  isLoading: boolean,
  /**
   * 污染源类别切换控制字段
   */
  pollutionTypeList: any,
  /**
   * 当前选中的污染源类别id
   */
  pollutionActiveId: string,
  showPopup: boolean,
  currentItem: any,
}

const limit = 20;

@inject('userStore')
@observer
class MyPollution extends Component<PollutionProps, PollutionState> {
  config: Config = {
    navigationBarTitleText: '我的污染源'
  }

  static externalClasses = ['com-class']

  constructor(props) {
    super(props);

    this.state = {
      pollutionList: [],
      paramQuery: {
        currentLatitude: 0,
        currentLongitude: 0,
        queryContent: '',
        offset: 0,
        limit: limit
      },
      isInit: true,
      hasMore: true,
      isLoading: true,
      pollutionTypeList: [{
        id: 0,
        name: '全部'
      }],
      showPopup: false,
      currentItem: {}
    }
  }

  componentDidShow() {
    this.onRefresh()
  }

  componentDidMount() {
    this.getPollutionType();
  }

  // 获取污染源列表
  fetchList = () => {
    const {paramQuery, pollutionList} = this.state;
    personListById(paramQuery).then(res => {
      const {data: {entries = [], total}} = res;
      if (total > pollutionList.length) {
        console.log(total, pollutionList.length)
        let newPollutionList = entries;
        newPollutionList = pollutionList.concat(newPollutionList);
        this.setState({
          pollutionList: newPollutionList,
          isLoading: false,
          hasMore: true,
          paramQuery: {
            ...paramQuery,
            offset: paramQuery.offset + limit
          }
        })
      }
    })
  }

  /**
   * 刷新操作
   */
  onRefresh = () => {
    const {paramQuery} = this.state;
    getLocation().then(position => {
      this.setState({
        isLoading: true,
      })
      personListById({
        currentLatitude: position.latitude,
        currentLongitude: position.longitude,
        queryContent: '',
        offset: 0,
        limit
      }).then(res => {
        const {data: {entries = [], total}} = res;
        console.log(total > entries.length)
        this.setState({
          pollutionList: entries,
          isLoading: false,
          hasMore: total > entries.length,
          paramQuery: {
            ...paramQuery,
            offset: limit
          }
        })
      })
    })
  }


  onAdd = () => {
    Taro.navigateTo({
      url: `/pages/mark/index`
    })
  }

  onEdit = (item: any) => {
    Taro.navigateTo({
      url: `./edit?type=edit&id=${item.id}`
    })
  }

  onDetail = (item: any) => {
    Taro.navigateTo({
      url: `./detail?id=${item.id}`
    })
  }

  onDel = async (item: any) => {
    this.setState({
      showPopup: true,
      currentItem: item
    })
  }

  // 获取污染源类型
  getPollutionType = async () => {
    try {
      const resPollutionType = await getPollutionSourceTypeList();
      const {statusCode, data} = resPollutionType;
      if (statusCode == 200) {
        const {pollutionTypeList} = this.state;
        this.setState({pollutionTypeList: pollutionTypeList.concat(data)});
      }
    } catch (error) {
    }
  }


  onConfirm = async () => {
    const {pollutionList, currentItem} = this.state
    const currentIndex = pollutionList.findIndex(plt => plt.id == currentItem.id)

    try {
      const res = await delPollutionDetail(currentItem.id)
      if (get(res, 'data.success')) {
        if (currentIndex > -1) {
          pollutionList.splice(currentIndex, 1)
          this.setState({
            pollutionList,
            showPopup: false
          })
        }
      } else {
        Taro.showToast({
          title: '删除失败',
          mask: true,
          icon: 'none',
          duration: 2000
        });
      }
    } catch (e) {

    }
  }

  onCancel = () => {
    this.setState({
      showPopup: false,
      currentItem: {}
    })
  }
  onInputChange = (val) => {
    const {paramQuery} = this.state;
    this.setState({
      pollutionList: [],
      paramQuery: {
        ...paramQuery,
        queryContent: val,
        offset: 0
      },
      hasMore: true,
      isLoading: true
    }, this.fetchList)
  }

  onEndReached = (callback) => {
    if(callback){
      callback();
    }
  }

  render() {
    const {
      paramQuery,
      hasMore,
      pollutionList,
      isLoading,
      showPopup
    } = this.state;
    let isEmptyData = !pollutionList || pollutionList.length == 0;

    const showEmpty = (<View className='empty'><EmptyHolder text='暂无数据'/></View>)
    const showList = pollutionList.map(item => (
      <PollutionItem key={item.id} data={item} onEdit={this.onEdit.bind(this)} onDetail={this.onDetail.bind(this)}
                     onDel={this.onDel.bind(this)}
      />
    ));

    return (
      <View className='warp'>
        <View className='pollution-page'>
          <View className='space'></View>
          <SearchBox
            value={paramQuery.queryContent}
            placeholder='搜索污染源'
            onInput={this.onInputChange.bind(this)}
          />
          {/* 列表展示部分 */}
          <ListView
            com-class='content-container'
            hasMore={hasMore}
            hasData={!isEmpty(pollutionList)}
            showLoading={isLoading}
            onRefresh={this.fetchList}
            onEndReached={this.onEndReached}
          >
            {isEmptyData ? showEmpty : showList}
          </ListView>

          <View className='add' onClick={this.onAdd}>
            <Text className='add_txt'>+ 新增污染源</Text>
          </View>

          <FpiConfirm
            title='提示'
            content='确定删除该条数据吗？'
            isOpened={showPopup}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
          />
        </View>
      </View>

    );
  }
}

export default MyPollution;
