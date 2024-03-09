import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text, ScrollView} from '@tarojs/components'
import {rootSourceBaseUrl} from '@common/utils/requests'
import {transformTreeData, setNodeUnCheck, getNodeById} from '@common/components/FpiChoose/utils'
import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import EmptyHolder from "@common/components/EmptyHolder";
import {UserStore} from '@common/store/user';
import {observer, inject} from '@tarojs/mobx';
import {getDepartmenAndUser} from '../../service/department'
import UnitModule from './UnitModule'
import UserModule from './UserModule'
import './index.scss'
import get from "lodash/get";
import {isOldVersion} from "@common/utils/common";


//图标引用
const checkedImage = `${rootSourceBaseUrl}/assets/common/radio/checked.png`;
const uncheckedImage = `${rootSourceBaseUrl}/assets/common/radio/unchecked.png`;

interface Props {
  userStore: UserStore;
  departmentCode: string | number,
  config: any,
  onDetail: (any) => void,
  nowCheckId: any,
  chooseType?: string
}

interface State {
  data: any,
  navbar: any,
  checked: boolean,
  nowChoose: any,
  nowCheckId: any,
}

@inject('userStore')
@observer
export default class ChoosePerson extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        id: '',
        name: '',
        type: 1,
        checked: false,
        children: []
      },
      navbar: [],
      checked: false,
      nowChoose: null,
      nowCheckId: props.nowCheckId
    }
  }

  // 初始化数据
  getInitData = async () => {
    let divisionNameParam = ''
    const {departmentCode, chooseType} = this.props;
    let Code = ''
    if (departmentCode != 'null') {
      Code = departmentCode
    }
    try {
      let divisionCodeParam = ''
      let divisionNameParam = ''
      if (isOldVersion()) {
        const {userDetails: {divisionCode, divisionName}} = this.props.userStore;
        divisionCodeParam = divisionCode
        divisionNameParam = divisionName
      } else {
        const {user: {tenant: {divisionCode, divisionName}, tenantUser: {tenantCode}}} = this.props.userStore;
        divisionCodeParam = divisionCode
        divisionNameParam = divisionName
      }
      let departmentUsersResp: any = [];
      if (chooseType === 'department') {
        //选择部门负责人
        departmentUsersResp = await getDepartmenAndUser(Code, false);
      } else if (chooseType === 'area') {
        //选择属地负责人
        departmentUsersResp = await getDepartmenAndUser(Code, true);
      } else {
        departmentUsersResp = await getDepartmenAndUser(Code);
      }
      if (departmentUsersResp && departmentUsersResp.data) {
        const {data: departmentUserList} = departmentUsersResp;

        const departmentList = departmentUserList.filter(item => item.departmentId);
        transformTreeData(departmentList, divisionNameParam)
        let noDepartment = departmentUserList.find(item => item.departmentId == 0)
        let noDepartmentList = noDepartment ? [noDepartment] : []
        transformTreeData(noDepartmentList, divisionNameParam, 4)
        this.setState({
          data: {
            id: divisionCodeParam,
            name: divisionNameParam,
            type: 1,
            checked: false,
            users: get(noDepartmentList, '[0].users', []),
            children: [
              ...departmentList,
            ]
          },
          navbar: [{id: divisionCodeParam, name: divisionNameParam, isAll: false, checked: false}],
        }, () => {
          const {nowCheckId} = this.state;
          if (nowCheckId) {
            this.onCheck({
              id: nowCheckId * 1,
              type: 4,
              init: true
            })
          }
        })
      }
    } catch (e) {
      console.log(e);
    }
  }

  componentDidShow() {
    this.getInitData();
  }

  // 通过节点id获取节点
  getNodeById = (id: number, type: number = 2) => {
    const {data} = this.state;
    return getNodeById(id, data, type);
  }

  // tab切换
  onTab = (index: number) => {
    let {navbar} = this.state;
    if (index !== navbar.length - 1) {
      navbar.splice(index + 1);
      this.setState({
        navbar
      })
    }
  }

  // 下级
  onSub = (item: any) => {
    let {navbar} = this.state;
    this.setState({
      navbar: [
        ...navbar,
        {id: item.id, name: item.name, isAll: false, checked: item.checked}
      ]
    })
  }

  // 勾选和取消
  onCheck = (item) => {
    const {config} = this.props;
    let {data} = this.state;
    let itemConfig = config.find(cfg => cfg.type == item.type);
    if (!isEmpty(config) && isEmpty(itemConfig)) {
      return;
    }
    let newData = data;
    let newItem = getNodeById(item.id, data, item.type);

    if (newItem) {
      if (itemConfig && itemConfig.single && !item.checked) {
        setNodeUnCheck(itemConfig.type, data);
      }
      // @ts-ignore
      newItem.checked = !item.checked;
      if (newItem.checked) {
        this.setState({
          nowChoose: newItem
        })
      } else {
        this.setState({
          nowChoose: {
            id: 0,
            name: '暂无',
          }
        })
      }
      this.setState({
        data: newData,
      })
    }
  }

  cancelChoose = () => {
    const {data} = this.state;
    setNodeUnCheck(4, data);
    this.setState({
      nowCheckId: 0,
      checked: !this.state.checked,
      nowChoose: {
        id: 0,
        name: '暂无',
      }
    })
  }
  sure = () => {
    let {nowChoose, checked} = this.state;
    const chooseType:string = this.props.chooseType ||'';
    let pages = Taro.getCurrentPages();
    //上一页面
    // if(checked){
    //   nowChoose = {
    //     id:0,
    //     name:'暂无',
    //   }
    // }
    let prevPage = pages[pages.length - 2];
    console.log('chooseType=>',chooseType)
    console.log('nowChoose=>',nowChoose)

    prevPage.setData({[chooseType]:nowChoose});

    Taro.navigateBack();
  }

  render() {
    const {navbar, checked} = this.state;
    const {onDetail} = this.props;
    console.log(navbar)
    return (
      <View className='bg'>
        {navbar.length === 0 &&
        <View className='no-data no1'><EmptyHolder text='暂无数据'/></View>
        }
        <ScrollView className='scrollView' scrollWithAnimation scrollX>
          <View className='navbar'>
            {
              navbar.map((item, index) => (
                <View
                  onClick={this.onTab.bind(this, index)}
                  key={item.id}
                  className={cn('navbar__item', {'navbar__item--nav': index < navbar.length - 1})}
                >{item.name}</View>
              ))
            }
          </View>
        </ScrollView>
        <ScrollView className="body" scrollY>
          <View className='fpi-choose__main'>
            {
              navbar.map((item, index) => {
                const list = this.getNodeById(item.id);
                const users = this.getNodeById(item.id, 4);
                return (
                  <View key={item.id}
                        className={cn('check-container', {'check-container--checked': index === navbar.length - 1})}>
                    <View className='tab__item'>
                      {isEmpty(list.children) && isEmpty(users.users) &&
                      <View className='no-data'><EmptyHolder text='暂无数据'/></View>
                      }
                      {/* 部门 */}
                      <UnitModule
                        data={this.getNodeById(item.id)}
                        onCheck={this.onCheck}
                        type={2}
                        onSub={this.onSub}
                        isChoose={false}
                      />
                      {/* 人员 */}
                      <UserModule
                        data={users}
                        onCheck={this.onCheck}
                        isChoose
                        onDetail={onDetail}
                      />
                    </View>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <View className='bottom'>
          <View className='cancel' onClick={() => {
            this.cancelChoose()
          }}>
            <Image className='img' src={checked ? checkedImage : uncheckedImage}/>
            <Text className='user_txt'>暂不选择</Text>
          </View>
          <View className='btn' onClick={() => {
            this.sure()
          }}>确认</View>
        </View>
      </View>
    )
  }
}
