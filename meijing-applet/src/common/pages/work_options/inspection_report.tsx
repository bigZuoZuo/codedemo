import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { isRelease, rootConstructionSourceBaseUrl } from '@common/utils/requests'
import { AtModal, AtModalContent, AtModalAction, AtIcon } from 'taro-ui'
import EmptyHolder from '@common/components/EmptyHolder/index'
import { getCurrentPage, isOldVersion } from '@common/utils/common'
import TopBar from '@common/components/TopBar'
import FpiSourceItem,{ formatStandardEmun, getEmunLabel } from '@common/components/FpiSourceItem'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import get from 'lodash/get'
import './inspection_report.scss'
import { getLocation, getConfig } from '../../../service/userDivision'
import { Location } from '../../model'

import {
  inspectReportNew,
  inspectSubmitNew,
  getSiteId,
  getPollutionById,
  delPatrolItem,
  insertLog,
  currentLevel,
  updateAttribute,
  QuestionImg
} from '../../service/patrolReport'


const history = `${rootConstructionSourceBaseUrl}/assets/pages/work/history.png`
const arrow = `${rootConstructionSourceBaseUrl}/assets/pages/work/arrow_right.png`
const updated = `${rootConstructionSourceBaseUrl}/assets/pages/work/updated.png`
const no_update = `${rootConstructionSourceBaseUrl}/assets/pages/work/no_update.png`

interface MyProps {

}

interface MyState {
  update: InfoType[];
  update_n: InfoType[];
  inspectReportData: any;
  isOpen: boolean;
  isSubmitFlag: boolean;
  siteName: string,
  // 工地状态
  progressStatus: string,
  // 当前工作状态
  currentWorkStatus: string,
  progressStatusList: any,
  currentWorkStatusList: any,
  pollutionSourceId: number
  // 请求参数
  constructionSiteProgress: string,
  pollutionSourceStatusId: number,
  isSubmit: boolean,
  isChangeSite: boolean,
  isDefaultAll: boolean,
  isAuthSetting: boolean,
  submitButtonLoading: boolean,
  delId: number,
  otherProblem: any,
  distance: number,
  location: Location,
  otherData: any,
  resquestParamNew: any,
  pollutionDetail: any,
  inventoryType: string,
}

interface InfoType {
  id?: number;
  checkItemContent: string;
  currentLevel: string;
}

@inject('userStore')
@observer
class Index extends Component<MyProps, MyState> {
  constructor(props) {
    super(props)
    const { inventoryType } = this.$router.params
    console.log(this.$router.params,'111')
    this.state = {
      update: [],
      update_n: [],
      // 请求到的数据
      inspectReportData: [],
      // 控制弹框开关
      isOpen: false,
      isSubmitFlag: false,
      // 工地名称
      siteName: '',
      // 工地进度状态
      progressStatus: '',
      progressStatusList: [{ label: '地基处理、土方开挖', value: 'GROUND_TREATMENT' }, {
        label: '基础/地下施工',
        value: 'FOUNDATION_CONSTRUCTION'
      }, { label: '主体施工', value: 'MAIN_CONSTRUCTION' }, { label: '毛坯施工', value: 'BLANK_CONSTRUCTION' }, {
        label: '室内装修',
        value: 'INTERIOR_TRIM'
      }, { label: '完工', value: 'COMPLETE' }],
      // 当前工作状态
      currentWorkStatus: '',
      currentWorkStatusList: [{ label: '在建', value: 1 }, { label: '停工', value: 2 }, { label: '完工', value: 3 }],
      pollutionSourceId: 0,
      constructionSiteProgress: '',
      pollutionSourceStatusId: 0,
      // 是否已经提交
      isSubmit: false,
      // 切换工地
      isChangeSite: false,
      isDefaultAll: false,
      isAuthSetting: false,
      submitButtonLoading: false,
      delId: -1,
      otherProblem: [],
      distance: 0,
      location: { latitude: 0, longitude: 0 },
      otherData: {
        // constructionSiteProgress: "",
        // hasLicense: false,
        // nonRoadGreenNumber: undefined,
        // nonRoadNumber: undefined,
      },

      resquestParamNew: {},
      pollutionDetail: {},
      inventoryType
    }
  }

  // 判断是否存在缓存，存在，则用缓存的id请求数据，不存在则后去最近自动获取污染源id
  componentDidMount() {
    this.isHaveCache()
    getConfig().then(res => {
      if (res && res.data) {
        const { settings = {} } = res.data;
        const { setDistance = false, distance = 0 } = settings;
        if (setDistance) {
          this.setState({
            distance
          })
        }
      }
    })
  }

  createNum = (end) => {
    const temp: any = [];
    for (let i = 0; i < end;) {
      temp.push({ value: i });
      i++;
    }
    return temp;
  }

  config: Config = {
    navigationBarTitleText: '工地巡查',
    navigationBarBackgroundColor: '#107EFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#107EFF',
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
  }

  componentWillUnmount() {
    Taro.setStorageSync('update-content', false)
  }

  componentDidShow() {
    const currentPage = getCurrentPage().data.SiteData;
    // 查看是否调用位置权限
    let that = this;
    Taro.getSetting({
      success(res) {
        //这里判断是否有地位权限
        if (!res.authSetting['scope.userLocation']) {
          that.setState({
            isAuthSetting: true
          })
          return
        } else {
          //如果有定位权限
          that.setState({
            isAuthSetting: false
          })
          if (currentPage && currentPage.id) {
            that.getData(currentPage.id);
            that.getPollutionData(currentPage.id);
            // 清除选择项
            let pages = Taro.getCurrentPages();
            let nowPage = pages[pages.length - 1];
            nowPage.setData({ SiteData: {} });
          } else {
            // that.isHaveCache()
            const pollutionSourceId = that.state.pollutionSourceId
            pollutionSourceId && that.getData(pollutionSourceId, true)
          }
        }
      }
    })
  }

  // 判断是否有缓存的污染源id,没有通过地理位置获取
  isHaveCache() {
    if (Taro.getStorageSync('appKey') === 'green-construct') {
      //@ts-ignore
      const currentPollutionSourceId = get(this.props.userStore, 'userDetails.pollutionSourceInfo.pollutionSourceId')
      this.setState({
        pollutionSourceId: currentPollutionSourceId,
      })
      this.getData(currentPollutionSourceId);
      this.getPollutionData(currentPollutionSourceId);
    }
    else {
      let cache = this.getCache();
      // 缓存的时间小于今天时间的开始值，则判断已经到了第二天，清楚缓存
      if (cache.time < moment(new Date()).startOf('day')) {
        Taro.setStorageSync('inspection_report_cache', {})
      }
      if (cache.pollutionSourceId) {
        this.setState({
          pollutionSourceId: cache.pollutionSourceId,
        })
        this.getData(cache.pollutionSourceId);
        this.getPollutionData(cache.pollutionSourceId);
        //如果有缓存，只取检查项
        // this.getData(cache.pollutionSourceId);
      } else {
        this.getInitPollutionSourceId().then(pollutionSourceId => {
          if (pollutionSourceId) {
            this.getData(pollutionSourceId);
            this.getPollutionData(pollutionSourceId);
          }
        })
      }
    }
  }

  getPollutionData = (pollutionSourceId) => {
    getPollutionById(pollutionSourceId).then(res => {
      const cache = this.getCache()
      if (res && res.data) {
        const { progressStatusList } = this.state;
        const { data } = res;
        let { name: siteName, statusName: currentWorkStatus, statusId: pollutionSourceStatusId, latitude, longitude } = data;
        const isCache = Taro.getStorageSync('isCache')
        let constructionSiteProgress = '';
        let progressStatus = '';
        let otherData: any = {};
        if (isCache === 'Y') {
          otherData = cache.otherData;
          currentWorkStatus = cache.currentWorkStatus;
          progressStatus = cache.progressStatus;
          pollutionSourceStatusId = cache.pollutionSourceStatusId;
          constructionSiteProgress = cache.constructionSiteProgress;
        } else {
          if (res.data.appendDatas && res.data.appendDatas.constructionSiteProgress) {
            otherData.constructionSiteProgress = res.data.appendDatas.constructionSiteProgress;
            constructionSiteProgress = otherData.constructionSiteProgress;
            progressStatusList.forEach(element => {
              if (element.value === constructionSiteProgress) {
                progressStatus = element.label
              }
            });
          }
          if (res.data.appendDatas && res.data.appendDatas.hasLicense !== undefined) {
            otherData.hasLicense = res.data.appendDatas.hasLicense;
          }
          if (res.data.appendDatas && res.data.appendDatas.nonRoadGreenNumber !== undefined) {
            otherData.nonRoadGreenNumber = res.data.appendDatas.nonRoadGreenNumber;
          }
          if (res.data.appendDatas && res.data.appendDatas.nonRoadNumber !== undefined) {
            otherData.nonRoadNumber = res.data.appendDatas.nonRoadNumber;
          }
        }

        const inspection_report_cache = {
          pollutionSourceId,
          siteName,
          otherData,
          currentWorkStatus,
          progressStatus: progressStatus,
          pollutionSourceStatusId,
          constructionSiteProgress,
          time: moment(new Date()),
          location: {
            latitude,
            longitude
          }
        }
        this.setCache(inspection_report_cache);

        this.setState({
          pollutionSourceId,
          siteName,
          otherData,
          currentWorkStatus,
          progressStatus: progressStatus,
          pollutionSourceStatusId,
          constructionSiteProgress,
          location: {
            latitude: latitude,
            longitude: longitude
          },
          pollutionDetail: data
        }, () => {
          Taro.setStorageSync('isCache', 'N');
          this.assembleRequestHandler()
        });
      }
    })
  }

  // 开启地理位置的权限
  onOpenAuth() {
    Taro.openSetting({
      success: function (dataAu) {
        if (dataAu.authSetting['scope.userLocation'] == true) {
          //再次授权，调用wx.getLocation的API
        } else {
          Taro.showToast({
            title: '授权失败',
            icon: 'none'
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    })

    this.setState({
      isAuthSetting: false
    })
  }

  getInitPollutionSourceId = async () => {
    try {
      // 获取经纬度
      let location: Location = await getLocation();
      let pollutionSourceId: any = '';
      if(isOldVersion()) {
        const ResponseId = await getSiteId(location)
        pollutionSourceId = get(ResponseId, 'data.entries[0].id');
      }
      else {
        pollutionSourceId = get(this.props, 'userStore.userDetails.pollutionSourceInfo.pollutionSourceId');
      }
      return pollutionSourceId;
    } catch (e) {
      console.error(e)
    }
  }

  getData = async (pollutionSourceId, isShow = false) => {
    try {
      const resp = await inspectReportNew(pollutionSourceId, this.state.inventoryType);

      let update: InfoType[] = []
      let update_n: InfoType[] = []
      let otherProblem: any = [];
      resp.data.specialPatrolItems.forEach((item) => {
        if (item.other) {
          otherProblem.push(item)
        } else {
          if (item.patroled) {
            update.push(item)
          } else {
            update_n.push(item)
          }
        }
      });
      let { isOpen } = this.state
      // 是否有
      if (isEmpty(Taro.getStorageSync('isShow'))) {
        isOpen = resp.data.hasLatestTimeoutPatrol
        Taro.setStorageSync('isShow', false)
      }
      this.setState({
        inspectReportData: resp.data,
        isOpen,
        update,
        otherProblem,
        update_n
      }, () => {
        !isShow && this.assembleRequestHandler()
      })
    } catch (e) {
      // 不存在污染源，清楚缓存
      if (e.data.code === 400 && e.data.message === '该污染源不存在') {
        // if(e.data.code === 400){
        Taro.setStorageSync('inspection_report_cache', {});
        //重新获取数据
        this.isHaveCache();
      }
    }

  }

  assembleRequestHandler = () => {
    const { pollutionDetail, inspectReportData } = this.state
    if (pollutionDetail && inspectReportData) {
      const pollutionSourceItemList = get(inspectReportData, 'pollutionSourceItems', []).map(item => {
        let targetCode = item.sourceItemTargetCode,
          targetName = item.sourceItemName,
          isExtendData = targetCode.includes('.append_datas.'),
          lastCode = targetCode.substr(targetCode.lastIndexOf('.') + 1),
          value = get(pollutionDetail, `${isExtendData ? 'appendDatas.' : ''}${lastCode}`, '');
        let valueName = value
        try {
          valueName = getEmunLabel(formatStandardEmun(item.sourceItemDataSource), value) || value
        }
        catch (err) { }
        return { targetCode, value: value.toString(), targetName, valueName }
      })
      this.setState({
        resquestParamNew: {
          id: pollutionDetail.id,
          pollutionSourceItemList
        }
      })
    }
  }

  getCache = () => {
    const data = Taro.getStorageSync('inspection_report_cache');
    if (isRelease && data.pro) {
      return data.pro;
    } else if (data.dev) {
      return data.dev;
    }
    return {};
  }
  setCache = (inspection_report_cache) => {
    if (isRelease) {
      Taro.setStorageSync('inspection_report_cache', { pro: inspection_report_cache });
    } else {
      Taro.setStorageSync('inspection_report_cache', { dev: inspection_report_cache });
    }
  }
  loading = (loading: boolean) => {
    this.setState({
      submitButtonLoading: loading
    })
  }
  checkSourceItem = () => {
    const { resquestParamNew, inspectReportData } = this.state
    const findEmptyItem = get(resquestParamNew, 'pollutionSourceItemList', []).find(item => !item.value)
    if (findEmptyItem) {
      const findItem = get(inspectReportData, 'pollutionSourceItems', []).find(item => item.sourceItemTargetCode === findEmptyItem.targetCode)
      Taro.showToast({
        title: `请填写${findItem.sourceItemName}`,
        mask: true,
        icon: 'none',
        duration: 2000
      });
      return false
    }
    return true
  }
  preSubmit = async () => {
    try {
      if (!this.checkSourceItem()) {
        return
      }
      this.loading(true)
      const { update_n, distance, location, pollutionSourceId } = this.state;
      if (distance > 0) {
        let nowLocation: any = null
        try {
          //获取当前位置
          nowLocation = await getLocation();
        }
        catch (err) {
          setTimeout(() => this.loading(false), 300)
          Taro.showToast({
            title: '获取定位失败，请稍后再试',
            mask: true,
            icon: 'none',
            duration: 2000
          });
          return;
        }

        let nowDistance = 0;
        let pollutionLocation = {};
        let cacheLocation = {};
        // 没有获取位置从新获取
        if (!location) {
          const res = await getPollutionById(pollutionSourceId);
          pollutionLocation = res
          if (res && res.data) {
            const { latitude, longitude } = res.data;
            const cache = this.getCache();
            this.setCache({
              ...cache,
              location: {
                latitude: latitude,
                longitude: longitude
              }
            })
            this.setState({
              location: {
                latitude: latitude,
                longitude: longitude
              }
            })
            nowDistance = this.getDistance(nowLocation.latitude, nowLocation.longitude, latitude, longitude);
          }
        } else {
          nowDistance = this.getDistance(nowLocation.latitude, nowLocation.longitude, location.latitude, location.longitude);
          cacheLocation = location
        }
        if (nowDistance > distance) {
          const msg = `当前用户位置:${JSON.stringify(nowLocation)},工地位置：${JSON.stringify(pollutionLocation)},缓存位置:${JSON.stringify(cacheLocation)}`
          insertLog(msg)
          Taro.showToast({
            title: `用户当前位置不在工地周边${distance}m范围内，请移动后重新提交！`,
            mask: true,
            icon: 'none',
            duration: 2000
          });
          this.loading(false)
          return;
        }
      }

      if (update_n.length > 0) {
        this.setState({
          isDefaultAll: true,
          submitButtonLoading: false
        })
      } else {
        this.onSubmit();
      }
    }
    catch (err) {
      insertLog(JSON.stringify(err))
      this.loading(false)
    }
  }
  onSubmit = async () => {
    try {
      this.setState({
        isDefaultAll: false
      })
      const { pollutionSourceStatusId, pollutionSourceId, constructionSiteProgress, currentWorkStatus, resquestParamNew } = this.state;
      this.setState({
        submitButtonLoading: true
      }, async () => {
        let resquestParam: any = {
          pollutionSourceId,
        }
        const { otherData = {} } = this.state;

        if (otherData.hasLicense !== undefined) {
          resquestParam.hasLicense = otherData.hasLicense === true;
        }
        if (otherData.nonRoadGreenNumber !== undefined) {
          resquestParam.nonRoadGreenNumber = otherData.nonRoadGreenNumber;
        }
        if (otherData.nonRoadNumber !== undefined) {
          resquestParam.nonRoadNumber = otherData.nonRoadNumber;
        }

        inspectSubmitNew({
          ...resquestParam,
          inventoryType: this.state.inventoryType,
          appendData: this.state.resquestParamNew.pollutionSourceItemList
        }).then((resp) => {
          updateAttribute(this.state.resquestParamNew)
          // 提交成功之后，但会到首页的工作台，提交的之后进行缓存并且第二次进入进行回显
          if (resp && !isEmpty(resp.data)) {
            const {
              siteName,
              progressStatus,
            } = this.state
            // 退出的时候，如果没有进行内容提交，则进行缓存
            let inspection_report_cache = {
              pollutionSourceId,
              constructionSiteProgress,
              pollutionSourceStatusId,
              siteName,
              otherData,
              progressStatus,
              currentWorkStatus,
              time: moment(new Date())
            }

            this.setCache(inspection_report_cache);
            this.setState({
              isSubmit: true,
              submitButtonLoading: false
            })
            Taro.redirectTo({
              url: `./success?patrolId=${resp.data.id}`
            })
          } else {
            this.setState({
              submitButtonLoading: false
            })
            Taro.showToast({
              title: resp.data.message,
              mask: true,
              icon: 'none',
              duration: 1000
            });
          }
        }).finally(() => {
          this.loading(false)
        })
      })
    } catch (err) {
      this.setState({
        submitButtonLoading: false
      })
      if (err.code === 500) {
        insertLog({
          err
        })
      }
      console.error('err=>', err)
    }
  }

  onNaviToHistory() {
    const { pollutionSourceId } = this.state;
    Taro.navigateTo({
      url: `./historyNew?pollutionSourceId=${pollutionSourceId}`
    });
  }

  onNaviToDetails(item: any) {
    const { inspectReportData, siteName, pollutionDetail } = this.state
    this.$preload('pollutionSourceId', inspectReportData.pollutionSourceId)
    this.$preload('labelDetails', item)
    this.$preload('siteName', siteName)
    this.$preload('pollutionDetail', pollutionDetail)
    Taro.setStorageSync('isCache', 'Y');

    Taro.navigateTo({
      url: './contentUpdate'
    });
  }

  onNaviSelectSite = () => {
    if (isOldVersion()) {
      Taro.navigateTo({
        url: './selectSite'
      });
    }
  }

  // 返回上一级的页面，自定义
  onBackHandle = () => {
    const { isSubmit, update } = this.state
    if (!isEmpty(update) && !isSubmit) {
      this.setState({
        isSubmitFlag: true
      })
    } else {
      this.onConfirmExit()
    }
  }

  // 提示为提交已上报内容，并确认退出,进行状态缓存
  onConfirmExit = () => {
    const {
      pollutionSourceId,
      constructionSiteProgress,
      pollutionSourceStatusId,
      siteName,
      progressStatus,
      currentWorkStatus
    } = this.state
    // 退出的时候，如果没有进行内容提交，则进行缓存
    let inspection_report_cache = {
      pollutionSourceId,
      constructionSiteProgress,
      pollutionSourceStatusId,
      siteName,
      progressStatus,
      currentWorkStatus,
      time: moment(new Date())
    }
    this.setCache(inspection_report_cache);
    Taro.navigateBack()
  }
  // 确认切换工地，并清楚缓存
  onConfirmChange = () => {
    Taro.setStorageSync('inspection_report_cache', {})
    this.setState({
      isChangeSite: false
    })
    Taro.navigateTo({
      url: './selectSite'
    });
  }

  // 跳转到已检查的详细页面
  onNaviToUpdatedDetails(item) {
    const { inspectReportData, siteName, pollutionDetail } = this.state
    Taro.setStorageSync('isCache', 'Y');
    this.$preload('pollutionSourceId', inspectReportData.pollutionSourceId)
    this.$preload('labelDetails', item)
    this.$preload('siteName', siteName)
    this.$preload('update', true)
    this.$preload('pollutionDetail', pollutionDetail)

    Taro.navigateTo({
      url: './contentUpdate'
    });
  }

  changeMachineNum = (e) => {
    const { otherData } = this.state;
    const value = e.detail.value;
    if (otherData.nonRoadGreenNumber !== undefined && value < otherData.nonRoadGreenNumber) {
      Taro.showToast({
        title: '工地非道路移动机械数量必须大于等于工地非道绿色化数',
        icon: 'none',
        duration: 1500
      })
    } else {
      const data = this.getCache();
      this.setCache({
        ...data,
        otherData: {
          ...otherData,
          nonRoadNumber: value
        },
      })
      this.setState({
        otherData: {
          ...otherData,
          nonRoadNumber: value
        }
      })
    }

  }

  changeGreenNum = (e) => {
    const { otherData } = this.state;
    const value = e.detail.value;
    if (otherData.nonRoadNumber !== undefined && value > otherData.nonRoadNumber) {
      Taro.showToast({
        title: '工地非道路移动机械数量必须大于等于工地非道绿色化数',
        icon: 'none',
        duration: 1500
      })
    } else {
      const data = this.getCache();
      this.setCache({
        ...data,
        otherData: {
          ...otherData,
          nonRoadGreenNumber: value
        },
      })
      this.setState({
        otherData: {
          ...otherData,
          nonRoadGreenNumber: value
        }
      })
    }
  }

  onLongPress = (delId) => {
    this.setState({
      delId
    })
  }

  hideMenu = (item) => {
    this.setState({
      delId: -1
    })
    const { inspectReportData, siteName, pollutionDetail } = this.state

    this.$preload('pollutionSourceId', inspectReportData.pollutionSourceId)
    this.$preload('labelDetails', item)
    this.$preload('siteName', siteName)
    this.$preload('update', true)
    this.$preload('pollutionDetail', pollutionDetail)
    Taro.navigateTo({
      url: './contentUpdate?type=addOther'
    });
  }

  delOther = (item) => {
    this.setState({
      delId: -1
    })
    delPatrolItem(item.specialPatrolItemId).then(res => {
      if (res) {
        this.isHaveCache();
        Taro.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
    })
  }

  addOther = (item) => {
    const { inspectReportData, siteName, pollutionDetail } = this.state
    this.$preload('pollutionSourceId', inspectReportData.pollutionSourceId)
    this.$preload('labelDetails', item)
    this.$preload('siteName', siteName)
    this.$preload('pollutionDetail', pollutionDetail)
    Taro.setStorageSync('isCache', 'Y');
    Taro.navigateTo({
      url: './contentUpdate?type=addOther'
    });
  }

  getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6378137,
      d2r = Math.PI / 180, //经纬度转弧度
      dLat = (lat1 - lat2) * d2r,
      dLon = (lng1 - lng2) * d2r;
    const latN1 = lat1 * d2r;
    const latN2 = lat2 * d2r;
    const sin1 = Math.sin(dLat / 2);
    const sin2 = Math.sin(dLon / 2);
    const a = sin1 * sin1 + sin2 * sin2 * Math.cos(latN1) * Math.cos(latN2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  onSourceItemChange = (newData) => {
    const resquestParamNew = this.state.resquestParamNew
    const findItem = resquestParamNew.pollutionSourceItemList.find(item => item.targetCode == newData.targetCode)
    if (findItem) {
      findItem.value = newData.value
      findItem.valueName = newData.valueName
      this.setState({ resquestParamNew })
      console.log(resquestParamNew)
    }
  }

  render() {
    const {
      submitButtonLoading,
      isAuthSetting,
      isOpen,
      update_n,
      update,
      inspectReportData,
      siteName,
      isSubmitFlag,
      isChangeSite,
      isDefaultAll,
      delId,
      otherProblem,
      resquestParamNew
    } = this.state


    return (
      <View className='report'>

        <TopBar fixed={false} title='工地巡查' onBack={this.onBackHandle} background='#107EFF' color='#fff' />

        <View className='input_header'>
          <View className='input_box'>
            <View className='flex_row select' onClick={this.onNaviSelectSite}>
              <Text className='txt2'>工地名称</Text>
              <View className='flex_row'>
                <Text className='txt3'>{siteName ? siteName : '请选择工地名称'}</Text>
                <Image src={arrow} className='img2'></Image>
              </View>
            </View>

            {get(inspectReportData, 'pollutionSourceItems', []).filter(item => item.itemLayout === 'TOP').map(item => (
              <FpiSourceItem
                smallStyle={false}
                config={item}
                data={get(resquestParamNew, 'pollutionSourceItemList', []).find(sourceItem => sourceItem.targetCode === item.sourceItemTargetCode)}
                onChange={this.onSourceItemChange}
              />
            ))}
          </View>
        </View>
        {
          !isEmpty(inspectReportData) ?
            <View className='content' style={{ display: (update_n.length + update.length) === 0 ? 'none' : 'block' }}>
              {
                update_n.length != 0 &&
                <View className='flex_row update_title'>
                  <Image className='img3' src={no_update}></Image>
                  <Text className='txt4'>未检查</Text>
                </View>
              }

              <View>
                {
                  update_n.map((item, index) => {
                    return (
                      <View
                        className='flex_row update_info'
                        key={index}
                        onClick={this.onNaviToDetails.bind(this, item)}
                      >

                        <View className='update_content'>
                          <Text className='txt6'>{item.checkItemContent}</Text>
                        </View>
                        <Image src={arrow} className='img2'></Image>

                      </View>)
                  })
                }

              </View>
              {update.length != 0 &&
                <View className='flex_row update_title'>
                  <Image className='img3' src={updated}></Image>
                  <Text className='txt5'>已检查</Text>
                </View>
              }
              <View>
                {
                  update.map((item, index) => {
                    //@ts-ignore
                    const currentItem = get(item, 'options', []).find(it => it.optionCode === item.currentLevel)
                    return (
                      <View
                        className='flex_row update_info'
                        key={index}
                        onClick={this.onNaviToUpdatedDetails.bind(this, item)}
                      >
                        <Image className='imgNew' src={QuestionImg[currentItem.icon] || currentItem.customIcon}></Image>
                        <View className='update_content'>
                          <Text className='txt6'>{item.checkItemContent}</Text>
                        </View>
                        <Image src={arrow} className='img2'></Image>

                      </View>)
                  })
                }

              </View>
            </View>
            :
            <View className='isEmpty'>
              <EmptyHolder text='暂无数据' />
            </View>
        }

        <View className='content'>
          <View className='flex_row '>
            <Text className='otherTitle'>其他问题</Text>
          </View>
          <View>
            {get(inspectReportData, 'pollutionSourceItems', []).filter(item => item.itemLayout === 'BOTTOM').map(item => (
              <FpiSourceItem
                smallStyle
                config={item}
                data={get(resquestParamNew, 'pollutionSourceItemList', []).find(sourceItem => sourceItem.targetCode === item.sourceItemTargetCode)}
                onChange={this.onSourceItemChange}
              />
            ))}

            <View className='other'>
              {otherProblem && otherProblem.map((item, index) => {
                //@ts-ignore
                const currentItem = get(item, 'options', []).find(it => it.optionCode === item.currentLevel)
                return (
                  item.checkItemContent ?
                    <View
                      key={index + item.id}
                      className={delId === index ? 'onPress gray' : 'onPress'}
                      onLongPress={this.onLongPress.bind(this, index)}
                    >
                      <View
                        className='flex_row update_info'
                        onClick={this.hideMenu.bind(this, item)}
                      >
                        <Image className='imgNew' src={QuestionImg[currentItem.icon] || currentItem.customIcon}></Image>
                        <View className='update_content'>
                          <Text className='txt6'>{item.checkItemContent}</Text>
                        </View>
                        <Image src={arrow} className='img2'></Image>
                      </View>
                      <View className={delId === index ? 'list-float show' : 'list-float '}>
                        <Text className='txt txt-red' onClick={this.delOther.bind(this, item)}
                        >删除</Text>
                      </View>
                    </View>
                    :
                    <View></View>
                )
              })
              }
            </View>
          </View>
          {otherProblem[0] && isEmpty(otherProblem[0].checkItemContent) &&
            <View>
              <Button className='addButton' onClick={this.addOther.bind(this, otherProblem[0])}
              >
                <AtIcon value='add' className='addIcon' size={18} color='#38a4f4' />
                添加其他问题
              </Button>
            </View>
          }
        </View>

        <View className='notice'>
          <Text>*当日上传的内容若不提交将会在次日失效</Text>
        </View>

        <View className='commit_bottom'>
          <View className='history' onClick={this.onNaviToHistory}>
            <Image className='img1' src={history}></Image>
            <Text className='txt1'>历史记录</Text>
          </View>
          <Button
            className='submit_button'
            onClick={this.preSubmit}
            disabled={submitButtonLoading}
            loading={submitButtonLoading}
          >
            确认提交
          </Button>
        </View>
        {/* 没有开启地理位置的权限 */}
        <AtModal isOpened={isAuthSetting}>
          <AtModalContent>
            检测到您的位置权限没有打开
            是否前往开启
          </AtModalContent>
          <AtModalAction> <Button onClick={() => {
            this.setState({ isAuthSetting: false });
            Taro.navigateBack()
          }}
          >取消</Button> <Button onClick={this.onOpenAuth.bind(this)}>前往开启</Button> </AtModalAction>
        </AtModal>

        <AtModal isOpened={isOpen}>
          <AtModalContent>
            您有上传记录因超时未提交，现已失效，
            请在每次巡查上报完成之后及时【确认提交】
          </AtModalContent>
          <AtModalAction><Button onClick={() => {
            this.setState({ isOpen: false })
          }}
          >我知道了</Button> </AtModalAction>
        </AtModal>

        <AtModal isOpened={isSubmitFlag}>
          <AtModalContent>
            您上报的信息还未提交，
            确定退出吗？
          </AtModalContent>
          <AtModalAction> <Button onClick={() => {
            this.setState({ isSubmitFlag: false })
          }}
          >取消</Button> <Button onClick={this.onConfirmExit.bind(this)}>确定</Button> </AtModalAction>
        </AtModal>

        <AtModal isOpened={isChangeSite}>
          <AtModalContent>
            当前工地上报记录还未提交，切换工地将丢失本次表单中的内容，是否确认切换
          </AtModalContent>
          <AtModalAction> <Button onClick={() => {
            this.setState({ isChangeSite: false })
          }}
          >取消</Button> <Button onClick={this.onConfirmChange.bind(this)}>确定</Button> </AtModalAction>
        </AtModal>

        <AtModal isOpened={isDefaultAll}>
          <AtModalContent>
            您上报的信息存在没有检查的项目，如果直接提交，这些检查项将会默认为全部做到？
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                this.setState({ isDefaultAll: false })
              }}
            >
              取消
            </Button>
            <Button onClick={this.onSubmit.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}

export default Index
