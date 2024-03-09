import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, OfficialAccount, Block } from '@tarojs/components'
import './index.scss'
import { AtAvatar, AtList, AtListItem, AtBadge, AtIcon, AtModal } from 'taro-ui'
import { getMyEvents, Event } from '../../service/pollutantEvent';
import { observer, inject } from '@tarojs/mobx';
import { DivisionStatus } from '@common/utils/divisionUtils'
import { DispatchStore } from '../../store/dispatch'
import { UserStore, UserDetails } from '@common/store/user'
import { rootSourceBaseUrl, getUserAvatarUrl } from '@common/utils/requests'
import { isAdministrator, isSalesperson } from '@common/utils/common'
import { UserJoinRequestStatus, countByAdmin, administratorRequests, setAdministratorRequests, countBySalesperson } from '../../service/userJoinRequests';
import cn from 'classnames';
import get from 'lodash/get';

interface MyProps {
  userStore: UserStore;
  dispatchStore: DispatchStore;
}

interface MyState {
  /**
   * 是否激活
   */
  isActive: boolean;
  events: Event[],
  /**
   * 加入申请数量
   */
  joinRequestCount: number,
  /**
   * 销售人员申请数量
   */
  salespersonRequestCount: number,
  /**
   * 关注item切换状态
   */
  isFocus: boolean;
  userStatus: 'DIVISION_EXISTS_ADMIN' | 'CAN_REQUEST' | 'CONFIRMING' | 'IS_ADMIN';
  isOpened: boolean;
}

const eventList = [
  {
    "code": "patrol_total",
    "name": "巡查数"
  },
  {
    "code": "inspect_total",
    "name": "上报事件"
  }, {
    "code": "inspect_finish",
    "name": "处置事件"
  }
]

const MAP_IMG = {
  DIVISION_EXISTS_ADMIN: `${rootSourceBaseUrl}/assets/my/admin-1.png`,
  CAN_REQUEST: `${rootSourceBaseUrl}/assets/my/admin-1.png`,
  CONFIRMING: `${rootSourceBaseUrl}/assets/my/admin-2.png`,
  IS_ADMIN: `${rootSourceBaseUrl}/assets/my/admin-3.png`,
}

const MyInspectsList = [
  { key: 'PATROL', title: '我的巡查', img: `${rootSourceBaseUrl}/assets/my/wodexuncha.png` },
  { key: 'INCIDENT', title: '我的上报', img: `${rootSourceBaseUrl}/assets/my/wodeshangbao.png` },
  { key: 'INCIDENT_FINISHED', title: '我的处置', img: `${rootSourceBaseUrl}/assets/my/wodechuzhi.png` },
  // { key: 'my-share', title: '我的分享', img: `${rootSourceBaseUrl}/assets/my/wodefengxiang.png` },
  { key: 'my-assign', title: '我的指派', img: `${rootSourceBaseUrl}/assets/my/wodezhipai.png` },
  { key: 'assign-and-at-me', title: '指派/@我', img: `${rootSourceBaseUrl}/assets/my/zhipaiwo.png` },
  // { key: 'my-praise', title: '我的点赞', img: `${rootSourceBaseUrl}/assets/my/wodedianzan.png` },
  { key: 'stats', title: '统计导出', img: `${rootSourceBaseUrl}/assets/my/tongjidaochu.png` },
  { key: 'my-pollution', title: '我的污染源', img: `${rootSourceBaseUrl}/assets/discovery/my_pollution.png` },
]

/**
 * 管理员
 */
const ADMINISTRATOR = "administrator";

@inject('userStore', 'dispatchStore')
@observer
export default class Index extends Component<MyProps, MyState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的',
    navigationBarBackgroundColor: '#107EFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#107EFF',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      events: [],
      joinRequestCount: 0,
      salespersonRequestCount: 0,
      isFocus: false,
      userStatus: 'DIVISION_EXISTS_ADMIN',
      isOpened: false
    };
  }

  componentDidMount() {
    const { userStore: { userDetails } } = this.props;
    this.setState({
      isActive: this.isActive(userDetails),
    });
    this.getMyInspectNumbers();
    this.getAdministratorRequests();
  }

  componentDidShow() {
    this.getJoinRequestCount();
    this.getMyInspectNumbers();
  }

  //下拉刷新
  onPullDownRefresh() {
    const { userStore, dispatchStore } = this.props;
    userStore.getUserDetails(userDetails => {
      this.setState({ isActive: this.isActive(userDetails) });
      this.getMyInspectNumbers();
      this.getJoinRequestCount();
      this.getAdministratorRequests();
      Taro.stopPullDownRefresh();
      dispatchStore.clearData();
      userStore.appletModules()
    });
  }

  /**
   * 我的事件统计
   */
  getMyInspectNumbers() {
    getMyEvents().then(res => {
      const events: Event[] = [];

      eventList.map((eventTag) => {
        res.data.map((event) => {
          if (eventTag.code == event.code) {
            events.push({
              name: eventTag.name,
              number: event.number,
              code: eventTag.code
            })
          }
        })
      });

      this.setState({
        events: events
      });
    });
  }

  /**
   * 获取用户申请管理员状态
   */
  getAdministratorRequests = async () => {
    try {
      const currentUserStatus = this.state.userStatus
      const result = await administratorRequests()
      this.setState({
        userStatus: get(result, 'data', 'DIVISION_EXISTS_ADMIN')
      }, () => {
        const { userStore } = this.props
        const { userStatus } = this.state
        if (userStatus === 'IS_ADMIN' && currentUserStatus != 'IS_ADMIN') {
          userStore.getUserDetails()
        }
      })
    }
    catch (error) { console.log(error) }
  }

  /**
   * 查询加入申请数量
   */
  getJoinRequestCount = async () => {
    const { userStore: { userDetails } } = this.props;
    let administrator = isAdministrator(userDetails.roles);
    let salesperson = isSalesperson(userDetails.roles);
    if (salesperson) {
      try {
        //@ts-ignore
        const getSalespersonJoinRequestCountResp = await countBySalesperson(UserJoinRequestStatus.CONFIRMING, userDetails.divisionCode, userDetails.id);
        this.setState({
          salespersonRequestCount: getSalespersonJoinRequestCountResp.data || 0,
        });
      } catch (error) {
      }
    }
    if (administrator) {
      try {
        //@ts-ignore
        const getJoinRequestCountResp = await countByAdmin(UserJoinRequestStatus.CONFIRMING, userDetails.divisionCode);
        this.setState({
          joinRequestCount: getJoinRequestCountResp.data || 0,
        });
      } catch (error) {
      }
    }
  }


  onShareAppMessage() {
    const { userStore: { userDetails } } = this.props;
    return {
      title: `邀请你加入${userDetails.divisionName}`,
      path: `/pages/login/login?divisionCode=${userDetails.divisionCode}&share=true`,
      imageUrl: `${rootSourceBaseUrl}/share.png`,
    }
  }

  /**
   * 加入申请页面
   */
  joinRequest() {
    if (!this.state.isActive) {
      return;
    }
    Taro.navigateTo({
      url: '../joinRequest/index'
    })
  }

  /**
   * 人员管理
   */
  personManage() {
    if (!this.state.isActive) {
      return;
    }
    Taro.navigateTo({
      url: '../personManage/index',
    })
  }

  /**
   * 部门管理
   */
  departmentManage() {
    if (!this.state.isActive) {
      return;
    }
    Taro.navigateTo({
      url: '../departmentManage/index',
    })
  }

  /**
   * 区域管理
   */
  divisionManage() {
    if (!this.state.isActive) {
      return;
    }
    Taro.navigateTo({
      url: '../user_area_manage/user_area_manage',
    })
  }


  /**
   * 个人信息页面
   */
  personalInfo() {
    Taro.navigateTo({
      url: '../personalInfo/index'
    })
  }

  isActive(userDetails: UserDetails): boolean {
    if (!userDetails) {
      return false;
    }
    return DivisionStatus.ACTIVE == userDetails.divisionStatus;
  }

  /**
   * 关注公众号切换
   */
  onSwitch = () => {
    const { isFocus } = this.state;
    this.setState({
      isFocus: !isFocus
    })
  }

  /**
   * 切换行政区
   */
  onChange = () => {
    const { dispatchStore } = this.props;
    dispatchStore.clearData();
    Taro.navigateTo({
      url: '/pages/switchArea/index'
    })

  }

  /**
   * 跳转我的专属二维码
   */
  onJumpMySalespersonQrCode = () => {
    Taro.navigateTo({
      url: '/pages/myInfo/exclusiveQrcode'
    })
  }

  /**
   * 跳转到帮助中心
   */
  onJumpHelpCenter = () => {
    const title = encodeURIComponent('帮助中心');
    let path = `helpCenter?title=${title}`;
    Taro.navigateTo({
      url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
    })
  }

  /**
   * 跳转我邀请的加入申请
   */
  onJumpSalespersonInviteList = () => {
    Taro.navigateTo({
      url: '/pages/myInfo/joinList'
    })
  }

  onAcceptDispatch = () => {
    Taro.navigateTo({
      url: '/pages/myInfo/acceptDispatch'
    })
  }

  onGoodShare = () => {
    Taro.navigateTo({
      url: '/pages/myInfo/goodShare'
    })
  }

  onLaunchDispatch = () => {
    Taro.navigateTo({
      url: '/pages/myInfo/launchDispatch'
    })
  }

  /**
   * 点击申请管理员
   */
  onAdmin = () => {
    const { userStatus } = this.state;
    if (userStatus === 'CAN_REQUEST') {
      this.setState({ isOpened: true })
    }
  }

  handleCancel = () => {
    this.setState({ isOpened: false })
  }

  handleConfirm = () => {
    this.setState({
      isOpened: false
    }, () => {
      const { userStore: { userDetails } } = this.props;
      setAdministratorRequests({
        userId: get(userDetails, 'id', 0),
        userName: get(userDetails, 'name', ''),
        tenantCode: get(userDetails, 'divisionCode'),
        tenantName: get(userDetails, 'divisionName', ''),
        roleCode: ADMINISTRATOR,
        roleName: "管理员"
      }).then(() => {
        this.setState({ userStatus: 'CONFIRMING' })
      })
    })
  }

  eventNumberClick = (event: Event) => {
    let tabType: string = 'PATROL';
    if (event.code == 'inspect_total') {
      tabType = 'INCIDENT';
    } else if (event.code == 'inspect_finish') {
      tabType = 'INCIDENT_FINISHED';
    } else {
      tabType = 'PATROL';
    }
    Taro.navigateTo({
      url: `/pages/myInfo/inspectList?tabType=${tabType}`,
    });
  }

  onItemClick = (item: any) => {
    if (item.key === 'stats'){
      Taro.navigateTo({
        url: `/pages/myInfo/myStats`
      })
    }
    else if(item.key === 'my-pollution'){
      console.log('tem.key=>',item.key)
      Taro.navigateTo({
        url: `/pages/pollution-manage/my`
      })
    }
    else  {
      Taro.navigateTo({
        url: `/pages/myInfo/myList?tabKey=${item.key}&tabName=${item.title}`
      })
    }
  }

  render() {
    const { userStore: { userDetails } } = this.props;
    const { isActive: isActiveValue, events, joinRequestCount, salespersonRequestCount, isFocus, userStatus, isOpened } = this.state;

    if (!userDetails) {
      return (<View className='content'></View>)
    }

    let administrator = isAdministrator(userDetails.roles);
    let salesperson = isSalesperson(userDetails.roles);
    const allSwitchArea = (userDetails.roles || []).some(user => ['experter', 'system_administrator', 'system_operator'].includes(user.code))
    const switchAllowed = (userDetails.roles || []).some(user => ['salesperson', 'system_administrator', 'system_operator'].includes(user.code))

    return (
      userDetails &&
      <View className='content'>
        <View className='topBack'>
          <View className='user_info'>
            <View className='user_info_up'>
              <View onClick={this.personalInfo.bind(this)}>
                <AtAvatar className='avatar' circle image={`${getUserAvatarUrl(userDetails.id)}`} />
              </View>

              <View className='user_div'>
                <View className='user_div__top'>
                  <Text className='username'>{userDetails.nickname || ''}</Text>
                  {
                    userStatus != 'DIVISION_EXISTS_ADMIN' &&
                    <Image className='img' src={MAP_IMG[userStatus]} onClick={this.onAdmin} />
                  }
                </View>
                <Text className='department'>{userDetails.departmentInfo && userDetails.departmentInfo.name || ''}</Text>
              </View>
            </View>

            {
              administrator &&
              <View className='operations'>
                <View className='operations_child' onClick={this.joinRequest.bind(this)}>
                  <Image className='operations_bg' src={isActiveValue ? `${rootSourceBaseUrl}/assets/my/join_apply.png` : `${rootSourceBaseUrl}/assets/my/join_apply_forbidden.png`} />
                  {
                    joinRequestCount && joinRequestCount > 0 &&
                    <View className='num'><AtBadge value={joinRequestCount} ></AtBadge></View>
                  }
                  <Text className='operations_name'>加入申请</Text>
                </View>
                <View className='operations_child' onClick={this.personManage.bind(this)}>
                  <Image className='operations_bg' src={isActiveValue ? `${rootSourceBaseUrl}/assets/my/person_management.png` : `${rootSourceBaseUrl}/assets/my/person_management_forbidden.png`} />
                  <Text className='operations_name'>人员管理</Text>
                </View>
                <View className='operations_child' onClick={this.departmentManage.bind(this)}>
                  <Image className='operations_bg' src={isActiveValue ? `${rootSourceBaseUrl}/assets/my/department_management.png` : `${rootSourceBaseUrl}/assets/my/department_management_forbidden.png`} />
                  <Text className='operations_name'>部门管理</Text>
                </View>
                <View className='operations_child' style={{opacity: '.3'}}>
                  <Image className='operations_bg' src={isActiveValue ? `${rootSourceBaseUrl}/assets/my/district_management.png` : `${rootSourceBaseUrl}/assets/my/district_management_forbidden.png`} />
                  <Text className='operations_name'>区域管理</Text>
                </View>
              </View>
            }

            <View className={isAdministrator ? 'bottom' : 'bottom adminTop'}>
              <View className='inspects'>
                <Text className='title'>我的巡查事件</Text>
                <View className='inspects-list'>
                  {
                    MyInspectsList.map(item => (
                      <View className='list-item' key={item.key} onClick={this.onItemClick.bind(this, item)}>
                        <Image className='img' src={item.img} />
                        <Text className='txt'>{item.title}</Text>
                      </View>
                    ))
                  }
                </View>
              </View>

              {
                (allSwitchArea || salesperson) && (
                  <Block>
                    {switchAllowed && (
                      <View className='area'>
                        <View className='left'>
                          <Image className='img' src={`${rootSourceBaseUrl}/assets/my/area.png`} />
                          <Text className='txt'>切换行政区</Text>
                        </View>
                        <View className='right' onClick={this.onChange}>
                          <Text className='txt'>{userDetails.divisionName}</Text>
                          <AtIcon className='img' value='chevron-right' size='24' color='#7A8499' />
                        </View>
                      </View>
                    )}
                    {salesperson && (
                      <Block>
                        <View className='space_salesperson'></View>
                        <View className='area' onClick={this.onJumpMySalespersonQrCode}>
                          <View className='left'>
                            <Image className='img' src={require('../../assets/my/salesperson_qrcode.png')} />
                            <Text className='txt'>我的专属二维码</Text>
                          </View>
                          <View className='right'>
                            <AtIcon className='img' value='chevron-right' size='24' color='#7A8499' />
                          </View>
                        </View>
                      </Block>
                    )}
                    {salesperson && (
                      <Block>
                        <View className='space_salesperson'></View>
                        <View className='area' onClick={this.onJumpSalespersonInviteList}>
                          <View className='left'>
                            <Image className='img' src={require('../../assets/my/salesperson_invite_user.png')} />
                            <Text className='txt'>我邀请的加入申请</Text>
                          </View>
                          <View className='right'>
                            {
                              salespersonRequestCount && salespersonRequestCount > 0 &&
                              <View className='badge_num'><AtBadge value={salespersonRequestCount} ></AtBadge></View>
                            }
                            <AtIcon className='img' value='chevron-right' size='24' color='#7A8499' />
                          </View>
                        </View>
                      </Block>
                    )}
                    <Block>
                      <View className='space_salesperson'></View>
                      <View className='area' onClick={this.onJumpHelpCenter}>
                        <View className='left'>
                          <Image className='img' src={`${rootSourceBaseUrl}/assets/my/helpCenter.png`} />
                          <Text className='txt'>帮助中心</Text>
                        </View>
                        <View className='right'>
                          <AtIcon className='img' value='chevron-right' size='24' color='#7A8499' />
                        </View>
                      </View>
                    </Block>
                  </Block>
                )
              }
            </View>

          </View>
        </View>

        <AtModal
          isOpened={isOpened}
          className='myPop'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleCancel}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='确认提交成为管理员的申请？'
        />
        <OfficialAccount className={cn('focus-comp', { hide: !isFocus })} />
      </View>
    )
  }
}
