import Taro, {Component, Config} from '@tarojs/taro';
import {View, Text, Image, Swiper, SwiperItem, ScrollView} from '@tarojs/components'
import {observer, inject} from '@tarojs/mobx';
import {
  getPollutionDetail,
  inspectsByPollutantCount,
  delPollutionDetail,
  pollutionSourceAssociatedPersons,
} from '../../service/pollutionType';
import {rootSourceBaseUrl} from '@common/utils/requests'
import FpiConfirm from '@common/components/FpiConfirm';
import get from 'lodash/get';
import cn from 'classnames'
import './detail.scss'
import isEmpty from 'lodash/isEmpty';
import {getUserInfo} from "@common/service/user";
import moment from "moment";


const Img404 = `${rootSourceBaseUrl}/assets/common/404-picture.png`
const greenConstruction = `${rootSourceBaseUrl}/assets/pollution-manage/green_construction.png`


interface DetailProps {
  userStore: any;
}

interface DetailState {
  id: number | string,
  picIndex: number,
  detailData: any,
  inspectCount: number,
  showPopup: boolean,
  otherPeopleArr: any,
  departmentData: any,
}

@inject('userStore')
@observer
class PatrolPage extends Component<DetailProps, DetailState> {
  config: Config = {
    navigationBarTitleText: '污染源详情'
  }

  static externalClasses = ['com-class']

  constructor(props) {
    super(props);
    const {id} = this.$router.params
    this.state = {
      id,
      picIndex: 0,
      detailData: {},
      inspectCount: 0,
      showPopup: false,
      otherPeopleArr:[],
      departmentData:{}
    }
  }

  componentDidShow() {
    this.fetchData()
    this.fetchOtherPeople()
    this.getInspectCount()
  }
  /**
   * 获取其他责任人
   */
  fetchOtherPeople = () =>{
    const {id}=this.state
    pollutionSourceAssociatedPersons(id).then((res:any)=>{
      if(res && res.data){
        this.setState({
          otherPeopleArr:res.data;
        })
      }
    })
  }
  fetchData = async () => {
    try {
      const {id} = this.state;
      const res = await getPollutionDetail(id)
      const detail = get(res, 'data', {});
      if(detail.supervisorId){
        // 获取监管部门负责人电话
        const supervisor = await  getUserInfo(detail.supervisorId);
        detail.supervisorPhoneNumber = supervisor.data.phone;
      }
      if(detail.inspectorId){
        // 获取属地负责人电话
        const inspector = await  getUserInfo(detail.inspectorId);
        detail.inspectorPhoneNumber = inspector.data.phone;
      }
      this.setState({
        detailData:detail
      });
    } catch (e) {

    }
  }

  getInspectCount = async () => {
    try {
      const {id} = this.state;
      const res = await inspectsByPollutantCount(id)
      this.setState({
        inspectCount: get(res, 'data.count', 0)
      })
    } catch (e) {

    }
  }

  onChange = () => {

  }

  onCancel = () => {
    this.setState({
      showPopup: false
    })
  }

  onConfirm = async () => {
    const {id} = this.state;
    try {
      const res = await delPollutionDetail(id)
      if (get(res, 'data.success')) {
        Taro.setStorageSync('pollutionSource-delete-id', id)
        Taro.navigateBack({})
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

  showBigImage(urls: string[]) {
    Taro.previewImage({
      urls
    })
  }

  onMakePhone = (detailData: any) => {
    Taro.makePhoneCall({
      phoneNumber: get(detailData, 'phoneNumber')
    })
  }

  navHandle = (item: any) => {
    if (item.longitude && item.latitude) {
      Taro.openLocation({
        longitude: item.longitude,
        latitude: item.latitude
      })
    }
  }

  onInspect = () => {
    const {id} = this.state;
    Taro.navigateTo({
      url: `./patrol?id=${id}`
    })
  }

  statusChangeLogs = () => {
    const {id} = this.state;
    Taro.navigateTo({
      url: `./statusChangeLog?id=${id}`
    })
  }
  staffChangeLogs = () => {
    const {id} = this.state;
    Taro.navigateTo({
      url: `./staffChangeLog?id=${id}`
    })
  }

  onEdit = () => {
    const {id} = this.state;
    Taro.navigateTo({
      url: './edit?type=edit&id=' + id
    })
  }

  onDel = async () => {
    this.setState({
      showPopup: true
    })
  }

  onImageError = (index: number) => {
    const {detailData, detailData: {pictureLinks}} = this.state
    pictureLinks.splice(index, 1, Img404)
    this.setState({
      detailData
    })
  }

  //拨打电话
  callPhone(phone: number) {
    Taro.makePhoneCall({
      "phoneNumber": phone
    })
  }


  render() {
    const {picIndex, detailData, inspectCount, showPopup,otherPeopleArr} = this.state;
    let i = 1;
    let isAllowableDeficiencyText = '--';
    if(detailData.isAllowableDeficiency){
      isAllowableDeficiencyText = '是'
    }else if(detailData.isAllowableDeficiency===false){
      isAllowableDeficiencyText = '否'
    }
    return (
      <View className='detail-page'>
        <View className={cn('detail-page__pics', {hide: isEmpty(detailData.pictureLinks)})}>
          <Swiper className='list__container'
                  indicatorColor='#999'
                  indicatorActiveColor='#333'
                  circular
                  indicatorDots
                  onChange={this.onChange}
                  current={picIndex}
          >
            {
              get(detailData, 'pictureLinks', []).map((photo, index) => (
                <SwiperItem key={photo}>
                  <View className='list__item'>
                    <Image className='img' src={photo} mode="aspectFill"
                           onClick={this.showBigImage.bind(this, detailData.pictureLinks)}
                           onError={this.onImageError.bind(this, index)}/>
                  </View>
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>

        <View className='detail-page__body'>
          <View className='company-info'>
            <View>
              <View className='title'>
                <Text className='company'>{get(detailData, 'name', '--')}</Text>
              </View>
              <View>
                <Text
                  className='cate'>{get(detailData, 'pollutionSourceTypeName') || ''}{detailData.industryName ? `-${detailData.industryName}` : ''}</Text>
                <Text className='line'>|</Text>
                <Text className='number'>（{get(detailData, 'code', '--')}）</Text>
              </View>
            </View>
            {detailData.constructionGrade ==='GREEN_CONSTRUCTION_SITE' &&
              <View className='greenConstruction'>
                <Image className='greenIcon' src={greenConstruction} />
              </View>
            }
          </View>

          <View className='company-address' onClick={this.navHandle.bind(this, detailData)}>
            <Text className='addr'>{get(detailData, 'address') || ''}</Text>
            <View className='icon'></View>
          </View>
          <View className='company-contact' style={{border:0}} >
            <View className='contact-item'>
              <Text className='label'>在线监控设备</Text>
              <View className='content'>
                <Text className='status'>{get(detailData, 'existMonitorDevice', false) ? '开启' : '关闭'}</Text>
              </View>
            </View>
            <View className='contact-item'>
              <Text className='label'>污染源状态</Text>
              <View className='content'>
                <Text className='status'>{get(detailData, 'statusName') || '暂无'}</Text>
              </View>
            </View>
            {detailData && detailData.pollutionSourceTypeId === 2 &&
              <View className='contact-item'>
                <Text className='label'>工地类型</Text>
                <View className='content'>
                  <Text className='status'>{get(detailData, 'industryName') || '暂无'}</Text>
                </View>
              </View>
            }
            <View className='contact-item'>
              <Text className='label'>监管部门</Text>
              <View className='content'>
                <Text className='status'>{get(detailData, 'superviseDepartmentName') || '暂无'}</Text>
              </View>
            </View>

            <View className='contact-item'>
              <Text className='label'>属地</Text>
              <View className='content'>
                <Text className='status'>{get(detailData, 'divisionName') || '暂无'}</Text>
              </View>
            </View>
            {detailData.pollutionSourceTypeId === 2 &&
              <View className='contact-item'>
                <Text className='label'>是否容缺工地</Text>
                <View className='content'>
                  <Text className='status'>{isAllowableDeficiencyText}</Text>
                </View>
              </View>
            }
            <View  style={{height:'12px',background:'#fff'}}></View>
            {/*<View className='patrol-list'>*/}
            {/*  {get(detailData, 'inspectorName', false) &&*/}
            {/*  <Text className='patrol-item'>巡查员：{detailData.inspectorName}</Text>}*/}
            {/*  {get(detailData, 'supervisorName', false) &&*/}
            {/*  <Text className='patrol-item'>督查员：{detailData.supervisorName}</Text>}*/}
            {/*  {get(detailData, 'leaderName', false) && <Text className='patrol-item'>组长：{detailData.leaderName}</Text>}*/}
            {/*</View>*/}
          </View>

          {(detailData.supervisorId  ||  detailData.inspectorId || otherPeopleArr.length>0 )&&
            <View className='space'></View>
          }
          <ScrollView
            className='scroll_box'
            scrollX
            scrollWithAnimation
          >
            {
              detailData.supervisorId &&
              <View className='item_list card0'>
                <View>
                  <View className='label'>监管部门负责人</View>
                  <View className='content'>{detailData.supervisorName}</View>
                </View>
                <View className='phoneWarp'>
                  <View className='flex1'>
                    <View className='label'>电话</View>
                    <View className='content'>{detailData.supervisorPhoneNumber}</View>
                  </View>
                  <View className='icon' onClick={()=>{this.callPhone(detailData.supervisorPhoneNumber)}}></View>
                </View>

              </View>
            }
            {
              detailData.inspectorId &&
              <View className='item_list card1'>
                <View>
                  <View className='label'>属地责任人</View>
                  <View className='content'>{detailData.inspectorName}</View>
                </View>
                <View className='phoneWarp'>
                  <View className='flex1'>
                    <View className='label'>电话</View>
                    <View className='content'>{detailData.inspectorPhoneNumber}</View>
                  </View>
                  <View className='icon' onClick={ ()=>{detailData.inspectorPhoneNumber} }></View>
                </View>
              </View>
            }

            {otherPeopleArr && otherPeopleArr.map((item:any,index:number) => {
              if(detailData.supervisorId){
                i++;
              }
              if(detailData.inspectorId){
                i++;
              }
              let number =  (i+index) % 4;
              return (
                <View className={`item_list card${number}`}>
                  <View className='nameWarp'>
                    <View className='label'>{item.duty}</View>
                    <View className='content'>{item.name}</View>
                  </View>
                  <View className='phoneWarp'>
                    <View className='flex1'>
                      <View className='label'>电话</View>
                      <View className='content'>{item.phoneNumber}</View>
                    </View>
                    <View className='icon' onClick={()=>{this.callPhone(item.phoneNumber)}}></View>
                  </View>

                </View>
              )
            })
            }
          </ScrollView>
          <View className='space'></View>

          <View className='company-patrol' onClick={this.onInspect}>
            <Text className='label'>历史巡查记录</Text>
            <View className='content'>
              {
                inspectCount && <Text className='num'>{inspectCount}</Text>
              }
              <View className='icon'></View>
            </View>
          </View>
          <View className='company-patrol' onClick={this.statusChangeLogs}>
            <Text className='label'>污染源状态变更记录</Text>
            <View className='content'>
              <View className='icon'></View>
            </View>
          </View>
          <View className='company-patrol' onClick={this.staffChangeLogs}>
            <Text className='label'>巡查人员变更记录</Text>
            <View className='content'>
              <View className='icon'></View>
            </View>
          </View>
          <View className='space'></View>
          {detailData && detailData.pollutionSourceTypeId === 2 &&
          <View>
            <View className='company-patrol'>
              <View className='label'>施工许可证时间</View>
              <View className='content'>{detailData.licenceStartTime ? moment(detailData.licenceStartTime).format('YYYY-MM-DD') : '暂无'}</View>
            </View>
            <View className='company-patrol'>
              <View className='label'>投资单位类型</View>
              <View className='content'>{detailData.investmentInstitutionTypeName || '暂无'}</View>
            </View>
            <View className='company-patrol'>
              <View className='label'>投资单位名称</View>
              <View className='content'>{detailData.investmentInstitutionName || '暂无'}</View>
            </View>
          </View>
          }

          <View className='company-remark'>
            <Text className='title'>备注</Text>
            <Text className='remark'>{get(detailData, 'remark', '无') || '无'}</Text>
          </View>
          <View className='space'></View>
        </View>

        <View className='detail-page__footer'>
          <View className='btn del' onClick={this.onDel}>删除</View>
          <View className='btn edit' onClick={this.onEdit}>编辑</View>
        </View>

        <FpiConfirm
          title='提示'
          content='确定删除该条数据吗？'
          isOpened={showPopup}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
      </View>
    );
  }
}

export default PatrolPage;
