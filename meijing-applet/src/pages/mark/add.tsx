import Taro, {Component, Config} from '@tarojs/taro';
import {observer, inject} from '@tarojs/mobx';
import {View, Text, Button, ScrollView, Picker, Image, Input, Textarea, Switch} from '@tarojs/components';
import {AtImagePicker, AtIcon, AtCurtain} from 'taro-ui'
import {rootSourceBaseUrl} from '@common/utils/requests'
import {
  getPollutionSourceTypeList,
  pollutionSourceTypeStatus,
  addReporting,
  updateAssociatedPersons,
  getDepartmentArea, getPeople
} from '../../service/pollutionType'
import {getAddressByLocationFromTencentMap} from '@common/utils/mapUtils'
import {getPageData, getNewFileName} from '@common/utils/common'
import {getDivision, getDivisionCode} from '../../service/division'
import {UploadResult, uploadFile, getSignature} from '../../service/upload'
import {listDepartmentByDivision, Department} from '../../service/department'

import cn from 'classnames'
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment'

import './add.scss'
import {getUserInfo} from "@common/service/user";

interface AddProps {
  userStore: any;
}

interface AddState {
  pollutionTypeList: any,
  pollutionType?: any,
  files: any,
  showUploadBtn: boolean,
  showScanDemo: boolean,
  showMore: boolean,
  name: string,
  /**
   * 地址
   */
  address: string;
  longitude: number;
  latitude: number;
  divisionCode: string;
  divisionName: string;
  phoneNumber?: string,
  existMonitorDevice: boolean,
  pollutionStatusList: any,
  pollutionStatus?: any,
  linkman: string,
  remark: string,
  dataObj: any,
  currentPersonField: string,
  // departemtList: Department[],
  isSubmitting: boolean,
  departmentData: any,
  otherPeopleArr: any,
  inspector: any,// 部门责任人
  choose: string,// 部门责任人
}

@inject('userStore')
@observer
class MarkAdd extends Component<AddProps, AddState> {
  config: Config = {
    navigationBarTitleText: '新增污染源'
  }

  static externalClasses = ['com-class']

  constructor(props) {
    super(props);
    this.state = {
      pollutionTypeList: [],
      pollutionStatusList: [],
      files: [],
      name: '',
      longitude: 0,
      latitude: 0,
      divisionCode: '',
      divisionName: '',
      address: '',
      showUploadBtn: true,
      showScanDemo: false,
      showMore: true,
      existMonitorDevice: false,
      remark: '',
      linkman: '',
      dataObj: {},
      currentPersonField: '',
      // departemtList: [],
      isSubmitting: false,
      departmentData: {},
      otherPeopleArr: [],
      inspector: {},
      choose: '',
    }
  }

  componentDidMount() {
    this.getPollutionType();
    this.getPollutionSourceTypeStatus();
    // this.getDepartemtList();

  }

  getPossession = (areaCode) => {
    // 属地负责人
    getPeople({
      areaCode
    }).then((res: any) => {
      if (res && res.data) {
        this.setState({
          inspector: {
            linkmanId: res.data.linkmanId,
            linkmanName: res.data.linkmanName,
            linkmanPhone: res.data.linkmanPhone,
          }
        })
      }
    })
  }

  componentDidShow() {
    const currentPageData = getPageData()
    const {otherPeople,area,chooseArea,department,superviseDepartment} = currentPageData;
    const {dataObj,choose} = this.state;
    // 选择属地
    if (!isEmpty(chooseArea) && choose==='chooseArea'  ) {
      this.setState({
        dataObj: {
          ...dataObj,
          divisionCode: chooseArea.code,
          divisionName: chooseArea.name
        }
      }, () => {
        this.getPossession(chooseArea.code)
      })
    }

    // 选择属地责任人
    if(!isEmpty(area) && choose==='area' ){
        // 获取联系人电话
        getUserInfo(area.id).then((res:any)=>{
          if(res&&res.data){
            this.setState({
              inspector:{
                linkmanPhone:res.data.phone,
                linkmanId:area.id,
                linkmanName:area.name,
              }
            })
          }
        })
    }

    // 其他负责人
    if (!isEmpty(otherPeople) ) {
      const {otherPeopleArr} = this.state;
      if (otherPeopleArr.length === 0) {
        otherPeopleArr.push(otherPeople)
      } else {
        let isAdd = true;
        otherPeopleArr.forEach((item: any) => {
          // 更新
          if (item.duty === otherPeople.duty) {
            item.name = otherPeople.name;
            item.phoneNumber = otherPeople.phoneNumber;
            isAdd = false;
          }
        })
        if (isAdd) {
          otherPeopleArr.push(otherPeople)
        }
      }
      this.setState({
        otherPeopleArr,
      })
    }

    // 选择部门
    if (!isEmpty(superviseDepartment) && choose==='chooseDepartment' ) {

      this.setState({
        dataObj:{
          ...dataObj,
          superviseDepartmentId: superviseDepartment.id,
          superviseDepartmentCode: superviseDepartment.code,
          superviseDepartmentName: superviseDepartment.name,
        },
      })
      // 部门负责人
      getPeople({
        departmentId: superviseDepartment.id
      }).then(res => {
        if (res.data) {
          this.setState({
            departmentData:{
              linkmanId: res.data.linkmanId,
              linkmanName: res.data.linkmanName,
              linkmanPhone: res.data.linkmanPhone,
            },
          });
        }else{
          this.setState({
            departmentData:{
              linkmanId:null,
              linkmanName:null,
              linkmanPhone:null,
            }
          })
        }
      })
    }

    // 选择部门负责人
    if (!isEmpty(department) && choose==='department') {
      //如果部门为空，选择部门负责人时修改部门
      if(isEmpty(dataObj.superviseDepartmentCode)){
        this.setState({
          dataObj:{
            ...dataObj,
            superviseDepartmentId: department.departmentId,
            superviseDepartmentCode: department.departmentCode,
            superviseDepartmentName: department.departmentName,
          }
        })
      }
      getUserInfo(department.id).then(res => {
        if (res.data) {
          this.setState({
            departmentData: {
              linkmanId: department.id,
              linkmanName: department.name,
              linkmanPhone: res.data.phone,
            },
          });
        }
      })
    }

  }

  /**
   * 污染类型
   */
  getPollutionType = async () => {
    const {id} = this.$router.params;
    try {
      const res = await getPollutionSourceTypeList();
      const {data} = res;
      const result = data.find(item => item.id == id)
      // 如果污染源类型是工地 增加负责人
      const {otherPeopleArr} = this.state;
      if (id == 2) {
        otherPeopleArr.push({
          name: '',
          duty: '建设单位负责人',
          phoneNumber: '',
        })
        otherPeopleArr.push({
          name: '',
          duty: '施工单位负责人',
          phoneNumber: '',
        })
      }
      this.setState({
        otherPeopleArr,
        pollutionTypeList: data,
        pollutionType: result
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 污染源状态
   */
  getPollutionSourceTypeStatus = async () => {
    try {
      const res = await pollutionSourceTypeStatus();
      const {data} = res;
      this.setState({
        pollutionStatusList: data
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 获取部门列表
   */
  getDepartemtList = async () => {
    try {
      const {userStore: {userDetails: currentUserDetails}} = this.props;

      const res = await listDepartmentByDivision(currentUserDetails.divisionCode);
      const {data} = res;
      this.setState({
        departemtList: data
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 地址选择
   */
  async addressSelect() {
    try {
      const {userStore: {userDetails: currentUserDetails}} = this.props;
      const res = await Taro.chooseLocation();
      const latitude = res.latitude;
      const longitude = res.longitude;
      let area = await getDivisionCode({
        divisionCode:currentUserDetails.divisionCode,
        latitude,
        longitude
      });
      const divisionCode = area.data.areaCode;
      const divisionName = area.data.areaName;
      this.getPossession(divisionCode)
      const {dataObj} = this.state;
      this.setState({
        latitude: latitude,
        longitude: longitude,
        address: res.address,
        dataObj: {
          ...dataObj,
          divisionCode: divisionCode,
          divisionName: divisionName,
        }
      });
    } catch (error) {
    }
  }

  /**
   * 图片选择
   * @param newFiles
   * @param operationType
   */
  onImagePickChange(newFiles, operationType: string) {
    if (operationType === 'remove') {
      this.setState({
        files: newFiles,
        showUploadBtn: true
      });
    } else {
      this.setState(() => {
        return ({
          files: newFiles
        })
      }, () => {
        const {files} = this.state
        if (files.length === 9) {  // 最多9张图片 隐藏添加图片按钮
          this.setState({
            showUploadBtn: false
          })
        }
      })
    }
  }

  // 示例显示/隐藏
  onCurtain = (isShow: boolean) => {
    this.setState({
      showScanDemo: isShow
    })
  }

  onPollutionTypeChange = (res) => {
    let index = res.detail.value;
    const {pollutionTypeList} = this.state;
    const choose = pollutionTypeList[index];
    if (choose.id != 2) {
      this.setState({
        otherPeopleArr: []
      });
    } else {
      this.setState({
        otherPeopleArr: [
          {
            name: '',
            duty: '建设单位负责人',
            phoneNumber: '',
          },
          {
            name: '',
            duty: '施工单位负责人',
            phoneNumber: '',
          }
        ]
      });
    }

    this.setState({
      pollutionType: choose,
      pollutionStatus: {}
    });
  }

  onPollutionStatusChange = (res) => {
    let index = res.detail.value;
    const {pollutionStatusList, pollutionType} = this.state;
    this.setState({
      pollutionStatus: pollutionStatusList.filter(item => item.pollutionSourceTypeId === pollutionType.id)[index]
    });
  }

  onInputChange = (key, e) => {
    switch (key) {
      case 'name':
        this.setState({name: e.detail.value})
        break;
      case 'phoneNumber':
        this.setState({phoneNumber: e.detail.value})
        break;
      case 'linkman':
        this.setState({linkman: e.detail.value})
        break;
      case 'remark':
        this.setState({remark: e.detail.value})
        break;
    }
  }

  /**
   * 加载更多切换
   */
  onMore = () => {
    const {showMore} = this.state;
    this.setState({
      showMore: !showMore
    })
  }

  /**
   * 是否存在检测设备
   */
  onMonitorChange = () => {
    const {existMonitorDevice} = this.state;
    this.setState({
      existMonitorDevice: !existMonitorDevice
    })
  }

  onPerson = (name: string) => {
    this.setState({currentPersonField: name})
    Taro.navigateTo({
      url: `../person/index?dataCode=${name}&radio=true&type=4&only=true`
    });
  }

  /**
   * 上报污染源参数检查
   */
  reportParameterCheck = (input) => {
    let result: boolean = true;
    let notice: string = '';

    if (!input.pollutionSourceTypeId) {
      result = false;
      notice = '请选择污染类型';
    } else if (!input.name) {
      result = false;
      notice = '请输入污染名称';
    } else if (input.longitude == 0 || input.latitude == 0) {
      result = false;
      notice = '未获取到经纬度';
    } else if (!input.divisionCode || !input.divisionName) {
      result = false;
      notice = '请选择属地';
    }
    // else if (!isEmpty(input.phoneNumber) && !/^1[3456789]\d{9}$/.test(input.phoneNumber)) {
    //     result = false;
    //     notice = '请输入正确手机号码';
    // }

    if (!result) {
      Taro.showToast({
        title: notice,
        mask: true,
        icon: 'none',
        duration: 2000
      });
    }
    return result;
  }

  getImageOssDir() {
    const dayStr: string = moment().format('YYYY/MM/DD');
    return `pollution-sources/images/${dayStr}/`;
  }

  /**
   * 修改部门
   * @param res
   */
  onDepartmentChange() {
    this.setState({
      choose: 'chooseDepartment'
    })
    const {userStore: {userDetails: currentUserDetails}} = this.props;
    Taro.navigateTo({
      url: `/pages/department_select/index?dataCode=superviseDepartment&divisionCode=${currentUserDetails.divisionCode}&type=pollution`
    });
  }

  /**
   * 污染源上报
   */
  onSubmit = async () => {
    const {
      pollutionType, files, name, address, longitude, latitude,
      // linkman, phoneNumber,
      pollutionStatus, remark, existMonitorDevice, dataObj, otherPeopleArr
    } = this.state;
    const {inspector, departmentData} = this.state;
    //先完成图片上传
    let pictureOssKeys: string[] = [];
    let firstPictureUrl = '';
    this.setState({
      isSubmitting: true
    })
    if (files && files.length > 0) {
      const imageDir: string = this.getImageOssDir();
      const {data: signatureResult} = await getSignature(imageDir);
      let promises: Promise<UploadResult>[] = [];

      for (let i = 0; i < files.length; i++) {
        const filePath: string = files[i].url;
        promises.push(uploadFile(filePath, imageDir, getNewFileName(filePath), signatureResult));
      }
      const imageUploadResults: UploadResult[] = await Promise.all(promises);
      const failure_number: number = imageUploadResults.filter(re => !re.success).length;

      if (failure_number > 0) {
        Taro.showToast({
          title: `有${failure_number}张图片上传失败，请检查网络环境`,
          mask: true,
          icon: 'none',
          duration: 2000
        });
        this.setState({
          isSubmitting: false
        })
        return;
      }
      pictureOssKeys = imageUploadResults.map(uploadResult => uploadResult.ossKey);
      firstPictureUrl = imageUploadResults[0].ossKey;
    }

    let input = {
      ...dataObj,
      name: name,
      //保存属地责任人和id
      inspectorId: inspector.linkmanId,
      inspectorName: inspector.linkmanName,
      inspectorPhoneNumber: departmentData.linkmanPhone,
      supervisorId: departmentData.linkmanId,
      supervisorName: departmentData.linkmanName,
      supervisorPhoneNumber: departmentData.linkmanPhone,
      divisionCode: dataObj.divisionCode,
      divisionName: dataObj.divisionName,
      pollutionSourceTypeId: pollutionType.id,
      address: address,
      longitude: longitude,
      latitude: latitude,
      // linkman: linkman,
      // phoneNumber: phoneNumber,
      statusId: get(pollutionStatus, 'id'),
      pictureOssKeys: pictureOssKeys.join(','),
      remark: remark,
      existMonitorDevice: existMonitorDevice
    };
    if (!this.reportParameterCheck(input)) {
      this.setState({
        isSubmitting: false
      })
      return;
    }

    try {
      const reportResp = await addReporting(input);
      let output = reportResp.data;
      if (output && output.id) {
        firstPictureUrl = firstPictureUrl && firstPictureUrl.length > 0 ? encodeURIComponent(firstPictureUrl) : '';
        let contentToSuccessPage = name && name.length > 0 ? encodeURIComponent(name) : '';
        let pollutionTypeName = pollutionType && pollutionType.name || '';
        if (otherPeopleArr) {
          updateAssociatedPersons(output.id, otherPeopleArr).then((res: any) => {
            if (res.data && res.data.success) {
              //跳转到成功页面
              Taro.redirectTo({
                url: `./success?type=mark&inspectId=${output.id}&firstPictureUrl=${firstPictureUrl}&content=${contentToSuccessPage}&pollutionTypeName=${pollutionTypeName}`
              });
            } else {
              Taro.showToast({
                title: res.data.message,
                mask: true,
                icon: 'none',
                duration: 2000
              });
            }
          })
        }
      } else {
        Taro.showToast({
          title: output.data.message,
          mask: true,
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({
      isSubmitting: false
    })
  }

  /**
   * 属地选择
   */
  onAddress = () => {
    this.setState({
      choose: 'chooseArea'
    })
    Taro.navigateTo({url: `/pages/chooseArea/index`});
  }

  /**
   * 获取部门人员
   */
  getDepartmentPeople = (divisionCode: number) => {
    getDepartmentArea(divisionCode).then((res: any) => {
      if (res && res.data) {
        this.setState({
          departmentData: res.data[0]
        })
      }
    })
  }

  /**
   * 删除负责人
   */
  removeItem = (index) => {
    const {otherPeopleArr} = this.state;
    otherPeopleArr.splice(index, 1)
    this.setState({
      otherPeopleArr
    })
  }

  /**
   * 添加其他负责人
   */
  addOtherPeople = () => {
    Taro.navigateTo({url: `/pages/pollution-manage/otherPeople`});
  }

  // 修改其他责任人
  editItem = (data) => {
    Taro.navigateTo({url: `/pages/pollution-manage/otherPeople?data=${JSON.stringify(data)}`});
  }

  /**
   * 修改监管部门负责人或者部门负责人
   */
  choosePeople = (type:string,checkId:string) =>{
    const{dataObj} = this.state;
    if(type==='area'){
      if(isEmpty(dataObj.divisionCode)){
        Taro.showToast({
          title: '请先选择属地！',
          mask: true,
          icon: 'none',
          duration: 2000
        });
      }else{
        getPeople({areaCode:dataObj.divisionCode}).then(res=>{
          if(res&&res.data){
            const departmentCode = res.data.departmentCode;
            this.setState({
              choose:type
            }, ()=> {
              Taro.navigateTo({
                url: `/pages/personManage/choose?departmentCode=${departmentCode}&chooseType=${type}&checkId=${checkId}`
              })
            })
          }
        })
      }

    }
    else if(type==='department'){
      let departmentCode = '';
      if(dataObj.superviseDepartmentCode){
        departmentCode = dataObj.superviseDepartmentCode
      }
      this.setState({
        choose:type
      }, ()=> {
        Taro.navigateTo({
          url: `/pages/personManage/choose?departmentCode=${departmentCode}&chooseType=${type}&checkId=${checkId}`
        })
      })
    }
  }

  render() {
    const {
      showScanDemo, showMore, pollutionTypeList, pollutionStatusList, pollutionStatus, pollutionType,
      address, dataObj, isSubmitting, departmentData, otherPeopleArr, inspector
      // existMonitorDevice, linkman, remark,
    } = this.state;
    return (
      <View className='add-page'>
        <View className='add-page_body'>
          <ScrollView
            className='add-page_body--scroll'
            scrollY
            scrollWithAnimation
          >
            <View className='padding mt'>
              <View className='list-item'>
                <View className='left'>
                  <Text className='left__title required'>污染源类型</Text>
                </View>
                <View className='right'>
                  <View className='right__container'>
                    <Picker mode='selector' value={0} range={pollutionTypeList} range-key='name'
                      onChange={this.onPollutionTypeChange.bind(this)}
                    >
                      <Text className='txt'>{get(pollutionType, 'name', '请选择')}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20'
                        color='#7A8499'
                      />
                    </Picker>
                  </View>
                </View>
              </View>

              <View className='list-item'>
                <View className='left'>
                  <Text className='left__title required'>名称</Text>
                </View>
                <View className='right'>
                  <View className='right__container'>
                    <Input
                      className='input'
                      placeholderClass='input__placeholder'
                      placeholder='输入地点名称需要和招牌一致'
                      onInput={this.onInputChange.bind(this, 'name')}
                    />
                  </View>
                </View>
              </View>

              <View className='list-item'>
                <View className='left'>
                  <Text className='left__title required'>位置</Text>
                </View>
                <View className='right' onClick={this.addressSelect}>
                  <View className='right__container'>
                    <Text
                      className={cn('input', {'input__placeholder': isEmpty(address)})}
                    >{address ? address : '选择所在的地址'}</Text>
                    <AtIcon className='chevron_right' value='chevron-right' size='20'
                      color='#7A8499'
                    />
                  </View>
                </View>
              </View>
              <View className='list-item custom noBorder'>
                <View className='list-item__top'>
                  <View className='left'>
                    <Text className='left__title'>添加照片</Text>
                    <Text className='left__sub'>（请对准进门处/公示牌拍摄）</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Text className='link' onClick={this.onCurtain.bind(this, true)}>查看示例</Text>
                    </View>
                  </View>
                </View>
                <View className='list-item__body'>
                  <AtImagePicker
                    className='imagePickView'
                    mode='aspectFill'
                    files={this.state.files}
                    onChange={this.onImagePickChange.bind(this)}
                  />
                </View>
              </View>
            </View>
            <View className='padding mt'>
              <View className='list-item custom'>
                <View className='list-item__top'>
                  <View className='left'>
                    <Text className='left__title'>其他信息</Text>
                    <Text className='left__sub'>（详细描述、联系方式）</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={this.onMore}>
                      <AtIcon className='chevron_right'
                        value={showMore ? 'chevron-up' : 'chevron-down'} size='20'
                        color='#7A8499'
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View className={cn('list-item-more', {'list-item-more--show': showMore})}>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>污染源状态</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Picker mode='selector' value={0}
                        range={pollutionStatusList.filter(item => item.pollutionSourceTypeId === pollutionType.id)}
                        range-key='name' onChange={this.onPollutionStatusChange.bind(this)}
                      >
                        <Text className='txt'>{get(pollutionStatus, 'name', '请选择')}</Text>
                        <AtIcon className='chevron_right' value='chevron-right' size='20'
                          color='#7A8499'
                        />
                      </Picker>
                    </View>
                  </View>
                </View>

                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>监管部门</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={this.onDepartmentChange.bind(this)}>
                      <Text className='txt'>{get(dataObj, 'superviseDepartmentName', '请选择')}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>监管部门负责人</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={()=>{this.choosePeople('department',departmentData.linkmanId)}}>
                      <View>
                        <View className='name'>
                          <Text className='txt'>{get(departmentData, 'linkmanName', '') || ''}</Text>
                        </View>
                        <View className='phone'>{get(departmentData, 'linkmanPhone', '') || ''}</View>
                      </View>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title required'>属地</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={() => {
                      this.onAddress()
                    }}
                    >
                      <Text className='txt'>{get(dataObj, 'divisionName', '') || ''}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20'
                        color='#7A8499'
                      />
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>属地责任人</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={()=>{this.choosePeople('area',inspector.linkmanId)}}>
                      <View>
                        <View className='name'>
                          <Text
                            className='txt'
                          >{get(inspector, 'linkmanName', '') || ''}</Text>
                        </View>
                        <View
                          className='phone'
                        >{get(inspector, 'linkmanPhone', '') || ''}</View>
                      </View>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                    </View>
                  </View>
                </View>
                <View className='list-item noBorder'>
                  <View className='left'>
                    <Text className='left__title'>其他负责人</Text>
                  </View>
                </View>
                <ScrollView
                  className='scroll_box'
                  scrollX
                  scrollWithAnimation
                >
                  {otherPeopleArr && otherPeopleArr.map((item: any, index: number) => {
                    let i = index % 4;
                    return (
                      <View className={`item_list card${i}`} onClick={() => {
                        this.editItem(item)
                      }}
                      >
                        <View className='close' onClick={(e) => {
                          e.stopPropagation();
                          this.removeItem(index)
                        }}
                        >
                        </View>
                        <View className='nameWarp'>
                          <View className='label'>{item.duty}</View>
                          <View className='content'>{item.name}</View>
                        </View>
                        <View className='phoneWarp'>
                          <View className='flex1'>
                            <View className='label'>电话</View>
                            <View className='content'>{item.phoneNumber}</View>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </ScrollView>
                <View className='addBtnWarp'>
                  <Button className='addBtn' onClick={this.addOtherPeople}>
                    <Image className='btn-img' src={`${rootSourceBaseUrl}/assets/map/add.png`} />
                    添加其他负责人
                  </Button>
                </View>
              </View>
            </View>
            <View className='company-remark'>
              <view className='title'>备注</view>

              <Input
                placeholderClass='input__placeholder'
                placeholder='输入备注'
                onInput={this.onInputChange.bind(this, 'remark')}
                className='remark'
              />
            </View>

          </ScrollView>

        </View>


        <View className='add-page_footer'>
          <Button className='btn-view' type='primary' loading={isSubmitting} disabled={isSubmitting}
            onClick={this.onSubmit}
          >提交</Button>
        </View>

        <AtCurtain
          isOpened={showScanDemo}
          onClose={this.onCurtain.bind(this, false)}
        >
          <View className='curtain_container'>
            <Text className='curtain__title'>请保证地点名称清晰</Text>
            <Image className='curtain__img' src={`${rootSourceBaseUrl}/assets/common/mark-scan.png`} />
          </View>
        </AtCurtain>
      </View>
    )
      ;
  }
}

export default MarkAdd;
