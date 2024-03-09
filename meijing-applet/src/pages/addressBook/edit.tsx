import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';
import { getUserDetails, getUserPhone } from '@common/service/user'
import {listDepartmentByDivision,Department} from '../../service/department'
import { getUserAvatarUrl, rootSourceBaseUrl } from '@common/utils/requests'
import { UserDetails } from '@common/store/user'
import isEmpty from 'lodash/isEmpty'
import cn from 'classnames'

import './edit.scss'

const iconphone = `${rootSourceBaseUrl}/assets/common/phone.png`;
const flagLeader = `${rootSourceBaseUrl}/assets/common/icon_start.png`;
const flagLink = `${rootSourceBaseUrl}/assets/common/icon_link.png`;

interface MyProps {
    userStore: any;
}

interface MyState {
  id: number;
  name: string;
  nickname: string;
  phone: string;
  avatar: string;
  departmentName: string;
  roles: {
    roleCode: string;
    roleName: string;
  }[];
  departemtList: Department[];
  linkmanFlag: string;
  managerFlag: string;
}

@inject('userStore')
@observer
export default class Index extends Component<MyProps, MyState> {

  config: Config = {
    navigationBarTitleText: '人员详情',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  }

  constructor(props) {
    super(props);
   
    this.state = {
      id: 0,
      name: '',
      nickname: '',
      phone: '',
      avatar: '',
      departmentName: '',
      roles: [],
      departemtList: [],
      linkmanFlag: '',
      managerFlag: ''
    }
  }

  async componentDidMount() {
    let { userId, managerFlag, linkmanFlag } = this.$router.params;

    const { userStore: {userDetails:currentUserDetails}} = this.props;
    try {
      const resDepartment = await listDepartmentByDivision(currentUserDetails.divisionCode);
      const viewUserDetailsResp = await getUserDetails(parseInt(userId));
      const userDetails:UserDetails = viewUserDetailsResp.data;

      this.setState({
        id: userDetails.id,
        name: userDetails.userName,
        nickname: userDetails.nickname,
        phone: userDetails.phone,
        avatar: userDetails.avatar,
        departmentName: userDetails.departmentName,
        managerFlag: managerFlag,
        linkmanFlag: linkmanFlag,
        roles: userDetails.userRoles,
        departemtList: resDepartment.data,
      })
    } catch (error) {
    }
  }


  componentDidShow(){

  }

  onMakePhone = async () => {
    let { userId } = this.$router.params;
    const res = await getUserPhone(parseInt(userId));
    Taro.makePhoneCall({
        phoneNumber: res.data
    })
  }

  render () {
    const { id, nickname, phone, name, departmentName, roles, managerFlag, linkmanFlag } = this.state;
  
    let roleName = '';
    if(roles && roles.length>0){
      roleName = roles.map(role => role.roleName).join('、');
    }

    return (
      <View className='content'>
          <View className='userinfo_panel'>
            <View className='user_info_up'>
              <View>
                <AtAvatar className='avatar' circle image={`${getUserAvatarUrl(id)}`} />
              </View>

              <View className='user_div'>
                <View className='user_div__top'>
                  <Text className='username'>{name || ''}</Text>
                  <View className='flag'>
                      {managerFlag === 'true' &&
                          <View className='leader'>
                          <Image className='flag_img' src={flagLeader}/>
                          <Text>领导</Text>
                          </View>
                      }
                      {linkmanFlag === 'true' &&
                          <View className='link'>
                            <Image className='flag_img' src={flagLink} />
                            <Text>联系人</Text>
                          </View>
                      }
                  </View>
                </View>
                <Text className='nickname'>昵称：{nickname}</Text>
              </View>
            </View>

            <View className='top_back'></View>

            <View className='info_item'>
                <Text className='item_left'>部门</Text>
                <View className='item_right'>
                    <Text className='text_right'>{departmentName}</Text>
                </View>
            </View>

            <View className='info_item'>
                <Text className='item_left'>角色</Text>
                <View className='item_right'>
                    <Text className='text_right'>{roleName}</Text>
                </View>
            </View>
            {managerFlag !== 'true' && <View className='info_item'>
              <Text className='item_left'>手机号</Text>
              <View className='item_right'>
                <Text className='text_right'>{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '暂无'}</Text>
              </View>
              <View className='item_img_right'>
                <Image className={cn('icon', { hide: isEmpty(phone) })} onClick={this.onMakePhone.bind(this)} src={iconphone} />
              </View>
            </View>}
          </View>
      </View>
    )
  }
}
