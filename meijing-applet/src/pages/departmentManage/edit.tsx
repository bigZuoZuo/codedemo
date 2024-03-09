import Taro, {Component, Config,} from '@tarojs/taro'
import {View, Button, Input, Text} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {getPageData, navBackWithData} from '@common/utils/common'
import {observer, inject} from '@tarojs/mobx';
import {add, newUpdate, rootDivisionCode,getDepartmentDetail} from '../../service/department'
import isEmpty from 'lodash/isEmpty'
import './edit.scss'

export enum OperType {
  ADD = 'add',
  EDIT = 'edit'
};

interface DepartmentEditProps {
  userStore: any;
}

interface DepartmentEditState {
  id?: number | string;
  type: OperType | string;
  parentCode: string;
  chooseType:string;
  data:any;
}

@inject('userStore')
@observer
export default class DepartmentEdit extends Component<DepartmentEditProps, DepartmentEditState> {

  config: Config = {
    // navigationBarTitleText: '',
    // navigationBarBackgroundColor: '#107EFF',
    // navigationBarTextStyle: 'white',
    // backgroundColor: '#107EFF',
  }

  constructor(props) {
    super(props)
    this.state = {
      id:0,
      parentCode: rootDivisionCode,
      chooseType:'',
      type: OperType.ADD,
      data:{
        departmentCode: "",
        departmentId: 0,
        departmentName: "",
        linkmanId: 0,
        linkmanName: "",
        managerId: 0,
        managerName: "",
      },
    }
  }

  async componentWillMount() {
    let {id,  type, parentCode} = this.$router.params;
    let subTitle = type == OperType.ADD ? '新增' : '编辑';
    Taro.setNavigationBarTitle({title: `${subTitle}部门`});
    if(type != OperType.ADD){
      getDepartmentDetail(id).then((res:any)=>{
        if(res && res.data){
          this.setState({
            id: id || 0,
            type: type,
            data:res.data
          })
        }
      })
    }else{
      this.setState({
        parentCode
      })
    }
  }

  componentDidShow() {
    const {chooseType,data} = this.state;
    const {leader,linkman} = getPageData();
    if(chooseType==='leader' && !isEmpty(leader)){
      this.setState({
        data:{
          ...data,
          managerId:leader.id,
          managerName:leader.name,
        }
      })
    }
    else if(chooseType==='linkman' && !isEmpty(linkman)){
      this.setState({
        data:{
          ...data,
          linkmanId:linkman.id,
          linkmanName:linkman.name,
        }
      })
    }
  }

  handleNameChange(e: any) {
    const{data} = this.state;
    this.setState({
      data:{
        ...data,
        departmentName: e.target.value,
      }
    });
  }

  async edit() {
    const {id, data, type, parentCode} = this.state;
    const {userStore: {userDetails}} = this.props;

    if (!data.departmentName || data.departmentName.length == 0) {
      return;
    } else if (data.departmentName.replace(/[\u4e00-\u9fa5]/g, 'xx').length > 100) {
      Taro.showToast({
        title: '你输入的部门名称过长',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    try {
      let department;
      if (OperType.ADD == type) {
        department = await add({
          name: data.departmentName,
          divisionCode: userDetails.divisionCode || '',
          divisionName: userDetails.divisionName || '',
          parentCode: parentCode === rootDivisionCode ? '' : parentCode
        });
      } else {
        if (!id) {
          return;
        }
        department = await newUpdate(id, {
          departmentName: data.departmentName,
          linkmanId: data.linkmanId,
          linkmanName: data.linkmanName,
          managerId: data.managerId,
          managerName: data.managerName,
        });
      }

      navBackWithData({
        department_edit: department.data,
        operType: type,
      });
    } catch (error) {
    }
  }
  // 选择人员
  choosePeople = (type:string)=>{
    const {data} = this.state;
    const {departmentCode} = data;
    let checkId = 0;
    if(type==='leader'){
      checkId = data.managerId;
    }
    else if(type==='linkman'){
      checkId = data.linkmanId;
    }
    this.setState({
      chooseType:type
    })
    Taro.navigateTo({
      url: `/pages/personManage/choose?departmentCode=${departmentCode}&checkId=${checkId}&chooseType=${type}`
    })
  }


  render() {
    const {data,type} = this.state;

    return (
      <View className='content'>
        <View className='top_back'></View>
        <View className='warp'>
          <View className='bg'>
            <View className='label'>
              部门名称
            </View>
            <View className='nameView'>
              <Input
                className='name'
                value={data.departmentName}
                placeholderClass='input__placeholder'
                placeholder='请输入部门名称'
                maxLength={50}
                onInput={this.handleNameChange.bind(this)}
              />
            </View>
            {type!=OperType.ADD &&
            <View>
              <View className='list'>
                <View className='left'>部门领导</View>
                <View className='right'>
                  <View onClick={()=>{this.choosePeople('leader')}}>
                    <View className='txt'  >
                      <Text className=''>{data.managerName||'暂无'}</Text>
                    </View>
                    <AtIcon className='chevron_right' value='chevron-right' size='18' color='#7A8499' />
                  </View>
                </View>
              </View>
              <View className='list'>
                <View className='left'>部门联系人</View>
                <View className='right' onClick={()=>{this.choosePeople('linkman')}}>
                  <View>
                    <View className='txt'>
                      <Text className=''>{data.linkmanName||'暂无'}</Text>
                    </View>
                    <AtIcon className='chevron_right' value='chevron-right' size='18' color='#7A8499' />
                  </View>
                </View>
              </View>
            </View>
            }
          </View>
        </View>
        <View className='button_panel'>
          <Button className='eidt_button' onClick={this.edit.bind(this)}>保存</Button>
        </View>
      </View>
    )
  }
}
