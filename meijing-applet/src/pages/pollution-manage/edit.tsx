import Taro, {Component, Config} from '@tarojs/taro';
import {observer, inject} from '@tarojs/mobx';
import {View, Text, Button, ScrollView, Picker, Image, Input, Textarea} from '@tarojs/components';
import {AtImagePicker, AtIcon, AtCurtain,} from 'taro-ui'
import {rootSourceBaseUrl} from '@common/utils/requests'
import cn from 'classnames'
import get from 'lodash/get';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import {getPageData, getNewFileName} from '@common/utils/common'
import {getUserInfo} from '@common/service/user'
import {
  getPollutionSourceTypeList,
  pollutionSourceTypeStatus,
  getPollutionDetail,
  editpollutionPources,
  pollutionSourceAssociatedPersons,
  updateAssociatedPersons,
  getPeople, addReporting,
  getInvestmentUnit,
  getSubSourceType,
} from '../../service/pollutionType'
import {getDivisionCode} from '../../service/division'
import {UploadResult, uploadFile, getSignature} from '../../service/upload'
import {listDepartmentByDivision, Department} from '../../service/department'

import './edit.scss'

interface AddProps {
  userStore: any;
}

interface AddState {
  type: string,// add 新增，edit编辑
  id: number | string,
  pollutionTypeList: any,
  files: any,
  showScanDemo: boolean,
  showMore: boolean,
  pollutionStatusList: any,
  dataObj: any,
  isSaving: boolean,
  departmentList: Department[],
  otherPeopleArr: any,
  departmentData: any,
  inspector: any,// 属地信息
  choose: string,// 选择的是属地负责人还是部门负责人 department area
  constructionType: any,// 工地类型
  unitTypeList: any, // 投资单位类型
  pollutionSourceTypeId: number, // 选中的污染源类型
  chooseIndustryType: number, // 选中的工地类型
  showUploadBtn: boolean, // 选中的工地类型
  isAllowableDeficiencyValue:any, // 是否容缺工地
}

@inject('userStore')
@observer
class MarkAdd extends Component<AddProps, AddState> {
  static externalClasses = ['com-class']

  config = {
    navigationBarTitleText: '编辑污染源'
  }

  constructor(props) {
    super(props);
    const {type} = this.$router.params
    let id = '';
    let pollutionSourceTypeId = 0;
    if (this.$router.params.id) {
      id = this.$router.params.id
    }
    let dataObj = {}
    if(this.$router.params.TypeId){
      dataObj.pollutionSourceTypeId =  this.$router.params.TypeId
      dataObj.pollutionSourceTypeName =  this.$router.params.TypeName
    }
    this.state = {
      type,
      id,
      pollutionTypeList: [],
      files: [],
      showScanDemo: false,
      showMore: true,
      pollutionStatusList: [],
      dataObj,
      isSaving: false,
      departmentList: [],
      otherPeopleArr: [],
      departmentData: {},
      inspector: {},
      choose: '',
      constructionType: [],
      unitTypeList: [],
      chooseIndustryType:0,
      showUploadBtn:true,
      isAllowableDeficiencyValue:'1',
    }
  }

  componentDidMount() {
    const {type} = this.state;
    Taro.setNavigationBarTitle({title: type === 'add' ? '新增污染源' : '编辑污染源'})
    this.getUnitList();
    this.getPollutionType();
    this.getPollutionSourceTypeStatus();
    if (type === 'edit') {
      this.fetchData()
    }

  }

  componentDidShow() {
    const currentPageData = getPageData()
    const {otherPeople, superviseDepartment, chooseArea, department, area} = currentPageData;
    const {choose, dataObj} = this.state;
    // 选择属地
    if (!isEmpty(chooseArea) && choose === 'chooseArea') {
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
    if (!isEmpty(area) && choose === 'area') {
      // 获取联系人电话
      getUserInfo(area.id).then((res: any) => {
        if (res && res.data) {
          this.setState({
            inspector: {
              linkmanPhone: res.data.phone,
              linkmanId: area.id,
              linkmanName: area.name,
            }
          })
        }
      })
    }

    // 其他负责人
    if (!isEmpty(otherPeople)) {
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
    if (!isEmpty(superviseDepartment) && choose === 'chooseDepartment') {

      this.setState({
        dataObj: {
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
            departmentData: {
              linkmanId: res.data.linkmanId,
              linkmanName: res.data.linkmanName,
              linkmanPhone: res.data.linkmanPhone,
            },
          });
        } else {
          this.setState({
            departmentData: {
              linkmanId: null,
              linkmanName: null,
              linkmanPhone: null,
            }
          })
        }
      })
    }

    // 选择部门负责人
    if (!isEmpty(department) && choose === 'department') {
      //如果部门为空，选择部门负责人时修改部门
      if (isEmpty(dataObj.superviseDepartmentCode)) {
        this.setState({
          dataObj: {
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

  getPossession = (areaCode) => {
    const {dataObj} = this.state;
    this.setState({
      inspector: {
        linkmanId: dataObj.inspectorId,
        linkmanName: dataObj.inspectorName,
        linkmanPhone: dataObj.linkmanPhone,
      }
    })
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
      } else {
        this.setState({
          inspector: {
            linkmanId: null,
            linkmanName: null,
            linkmanPhone: null,
          }
        })
      }
    })
  }

  /**
   * 获取详情
   */
  fetchData = async () => {
    const {id} = this.$router.params;
    try {
      const res = await getPollutionDetail(id);
      const otherPeople = await pollutionSourceAssociatedPersons(id);
      const data = get(res, 'data', {})
      let otherPeopleArr = get(otherPeople, 'data', [])
      this.setState({
        otherPeopleArr: otherPeopleArr,
        dataObj: data,
        files: (get(data, 'pictureLinks', []) || []).map(pic => ({
          url: pic
        }))
      },()=>{
        // 如果污染源类型是工地 增加负责人
        if (data && data.pollutionSourceTypeId === 2) {
          // otherPeopleArr = this.getFixeValue(otherPeopleArr)
          this.getSubSourceType(data.pollutionSourceTypeId);
        }
      })
      //获取责任人 责任人电话
      if (data.inspectorId) {
        this.setState({
          inspector: {
            linkmanId: data.inspectorId,
            linkmanName: data.inspectorName,
          }
        }, () => {
          getUserInfo(data.inspectorId).then((people: any) => {
            if (people && people.data) {
              const {inspector} = this.state;
              this.setState({
                inspector: {
                  ...inspector,
                  linkmanPhone: people.data.phone
                }
              })
            }
          })
        })
      }
      if (data.supervisorId) {
        getUserInfo(data.supervisorId).then((departmentRes: any) => {
          if (departmentRes && departmentRes.data) {
            this.setState({
              departmentData: {
                linkmanId: data.supervisorId,
                linkmanName: departmentRes.data.name,
                linkmanPhone: departmentRes.data.phone
              }
            })
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 污染类型类型
   */
  getPollutionType = async () => {
    try {
      const res = await getPollutionSourceTypeList();
      const {data} = res;
      this.setState({
        pollutionTypeList: data
      },()=>{
        const {type,dataObj} = this.state;
        if (type === 'add') {
          let ptIndex: number;
          for (ptIndex = 0; ptIndex < data.length; ptIndex++) {
            if (dataObj.pollutionSourceTypeId == data[ptIndex].id) {
              break;
            }
          }
          this.onPollutionTypeChange({
            detail:{
              value:ptIndex,
            }
          });
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  /**
   * 投资类型
   */
  getUnitList = async () => {
    try {
      const res = await getInvestmentUnit();
      const {data} = res;
      this.setState({
        unitTypeList: data
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * 固定扬尘源工地类型
   */
  getSubSourceType = async (PollutionSourceServerId: string | number) => {
    const {constructionType} = this.state;
    if(isEmpty(constructionType)){
      try {
        const res = await getSubSourceType(PollutionSourceServerId);
        const {dataObj,type} = this.state;
        const {data} = res;
        let index = 0;
        if(type==='add'){
          // 默认选中第一个
          this.setState({
            constructionType: data,
            chooseIndustryType:index,
            dataObj:{
              ...dataObj,
              industryId: data[0].id,
              industryName: data[0].name,
            }
          })
        }else{
          const {industryId} = dataObj;
          // 默认选中建筑工地
          data.forEach((item:any,i:number)=>{
            if( item.id===industryId){
              index = i;
            }
          });
          this.setState({
            chooseIndustryType:index,
            constructionType: data,
          })
        }
      } catch (err) {
        console.log(err)
      }
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
        departmentList: data,
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
        divisionCode: currentUserDetails.divisionCode,
        latitude,
        longitude
      });
      const divisionCode = area.data.areaCode;
      const divisionName = area.data.areaName;
      this.getPossession(divisionCode)
      const {dataObj} = this.state;
      this.setState({
        dataObj: {
          ...dataObj,
          latitude: latitude,
          longitude: longitude,
          address: res.address,
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
  onImagePickChange(newFiles, operationType: string, index) {
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
        const { files } = this.state
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

  // 改变污染源类型
  onPollutionTypeChange = (res) => {
    const index = res.detail.value;
    const {dataObj, pollutionTypeList, otherPeopleArr,type} = this.state;
    const id = pollutionTypeList[index].id;
    let newArr = [];
    // 如果污染源类型是工地 增加负责人
    if (id === 2 && type ==='add') {
      newArr = this.getFixeValue(otherPeopleArr)
      this.getSubSourceType(2)
    } else {
      newArr = otherPeopleArr.filter(item => item.duty != '建设单位负责人' && item.duty != '施工单位负责人');
    }
    this.setState({
      otherPeopleArr: newArr,
      dataObj: {
        ...dataObj,
        pollutionSourceTypeId: id,
        pollutionSourceTypeName: pollutionTypeList[index].name,
        status: ''
      }
    });
  }

  getFixeValue = (otherPeopleArr) => {
    if (otherPeopleArr.length === 0) {
      otherPeopleArr = [
        {
          name: '',
          duty: '污染源责任人',
          phoneNumber: '',
        },
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
    } else {
      let addConstructionPeople = true;
      let addBuildPeople = true;
      let addSourcePeople = true;
      otherPeopleArr.forEach(item => {
        if (item.duty === '污染源责任人') {
          addSourcePeople = false;
        }
        if (item.duty === '建设单位负责人') {
          addConstructionPeople = false;
        }
        if (item.duty === '施工单位负责人') {
          addBuildPeople = false;
        }
      })
      if (addConstructionPeople) {
        otherPeopleArr.unshift({
          name: '',
          duty: '建设单位负责人',
          phoneNumber: '',
        })
      }
      if (addBuildPeople) {
        otherPeopleArr.unshift({
          name: '',
          duty: '施工单位负责人',
          phoneNumber: '',
        })
      }
      if (addSourcePeople) {
        otherPeopleArr.unshift({
          name: '',
          duty: '污染源责任人',
          phoneNumber: '',
        })
      }
    }
    return otherPeopleArr;
  }

  // 改变污染源状态
  onPollutionStatusChange = (res) => {
    let index = res.detail.value;
    const {pollutionStatusList, dataObj} = this.state;
    const currentPollution = pollutionStatusList.filter(item => item.pollutionSourceTypeId === dataObj.pollutionSourceTypeId)[index]
    this.setState({
      dataObj: {
        ...dataObj,
        statusId: currentPollution.id,
        statusName: currentPollution.name
      }
    });
  }

  // 输入框值改变
  onInputChange = (key, e) => {
    const {dataObj} = this.state;
    this.setState({
      dataObj: {
        ...dataObj,
        [key]: e.detail.value
      }
    })
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
      notice = '请选择地址';
    } else if (!isEmpty(input.phoneNumber) && !/^1[3456789]\d{9}$/.test(input.phoneNumber)) {
      result = false;
      notice = '请输入正确手机号码';
    } else if (!input.divisionCode || !input.divisionName) {
      result = false;
      notice = '请选择属地';
    }

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

  // 取消返回上一页
  onCancel = () => {
    Taro.navigateBack({})
  }

  getImageOssDir() {
    const dayStr: string = moment().format('YYYY/MM/DD');
    return `pollution-sources/images/${dayStr}/`;
  }

  /**
   * 污染源上报
   */
  onSubmit = async () => {

    this.setState({
      isSaving: true
    }, async () => {
      const {dataObj, files, otherPeopleArr, inspector, departmentData, type} = this.state;
      let {id} = this.state;
      const imageDir: string = this.getImageOssDir();
      const imgArr:any = [];
      let failureNumber = 0;
      let oldPictureArr = [];
      if(dataObj.pictureOssKeys){
         oldPictureArr =  dataObj.pictureOssKeys.split(',');
      }
      for(let file of files){
        // 新增
        if(file.url.includes('tmp')){
          const {data: signatureResult} = await getSignature(imageDir);
          const filePath: string = file.url;
          const uploadRes =  await uploadFile(filePath, imageDir, getNewFileName(filePath), signatureResult);
          if(uploadRes.success){
            imgArr.push(uploadRes.ossKey)
          }else{
            failureNumber++;
          }
        }
        // 已有的图片
        else{
          oldPictureArr.forEach(item=> {
            if(file.url.indexOf(item)>-1){
              imgArr.push(item)
            }
          })
        }
      }
      if(failureNumber>0){
        Taro.showToast({
          title: `有${failureNumber}张图片上传失败，请检查网络环境`,
          mask: true,
          icon: 'none',
          duration: 2000
        });
        this.setState({
          isSaving: false,
        });
        return;
      }
      dataObj.pictureOssKeys = imgArr.join(',');
      if (!this.reportParameterCheck(dataObj)) {
        this.setState({
          isSaving: false
        });
        return;
      }

      try {
        //保存属地责任人和id
        dataObj.inspectorId = inspector.linkmanId;
        dataObj.inspectorName = inspector.linkmanName;
        dataObj.inspectorPhoneNumber = inspector.linkmanPhone;
        dataObj.supervisorId = departmentData.linkmanId;
        dataObj.supervisorName = departmentData.linkmanName;
        dataObj.supervisorPhoneNumber = departmentData.linkmanPhone;
        let editRes = {data: {success: false, message: '', id: 0}};
        //是工地且状态不是完工的取消完工时间
        if(dataObj.pollutionSourceTypeId===2 && dataObj.status!='完工'){
          dataObj.finishedTime = null
        }

        if(dataObj.pollutionSourceTypeId!==2){
          dataObj.industryId = null;
          dataObj.industryName = null;
          dataObj.investmentUnitTypeCode = null;
          dataObj.investmentUnitTypeName = null;
          dataObj.investmentUnitName = null;
          dataObj.licenseTime = null;
          dataObj.finishedTime = null
        }
        if(dataObj.divisionCode.length<12){
          console.log(dataObj.divisionCode.length)
          dataObj.divisionCode = dataObj.divisionCode + new Array(12-dataObj.divisionCode.length+1).join('0')
        }
        if (type === 'add') {
          editRes = await addReporting(dataObj);
          id = editRes.data.id;
          if (!id) {
            Taro.showToast({
              title: editRes.data.message,
              mask: true,
              icon: 'none',
              duration: 2000
            });
            return;
          }
        } else if (type === 'edit') {
          editRes = await editpollutionPources(dataObj);
          id = editRes.data.id;
          if (!editRes.data) {
            Taro.showToast({
              title: editRes.data.message,
              mask: true,
              icon: 'none',
              duration: 2000
            });
            return;
          }
        }


        if (otherPeopleArr) {
          const otherPeopleRes = await updateAssociatedPersons(id, otherPeopleArr);
          if (!otherPeopleRes.data.success) {
            Taro.showToast({
              title: editRes.data.message,
              mask: true,
              icon: 'none',
              duration: 2000
            });
            return;
          }
        }
        if(type==='edit'){
          Taro.navigateBack();
        }else if(type==='add'){
          Taro.redirectTo({
            url: `/pages/mark/success`
          });
        }

      } catch (error) {
        console.log(error);
      }
      this.setState({
        isSaving: false
      });
    })

  }

  /**
   * 修改监管部门
   */
  onDepartmentChange() {
    this.setState({
      choose: 'chooseDepartment'
    })
    const {userStore: {userDetails: currentUserDetails}} = this.props;
    Taro.navigateTo({
      // url: `/pages/department_select/index?dataCode=superviseDepartment&divisionCode=${currentUserDetails.divisionCode}&type=pollution`
      url: `/pages/department_select/index?dataCode=superviseDepartment&divisionCode=${currentUserDetails.divisionCode}`
    });
  }

  /**
   * 修改监管部门负责人或者部门负责人
   */
  choosePeople = (type: string, checkId: string) => {
    const {dataObj} = this.state;
    if (type === 'area') {
      getPeople({areaCode: dataObj.divisionCode}).then(res => {
        if (res && res.data) {
          const departmentCode = res.data.departmentCode;
          this.setState({
            choose: type
          }, () => {
            Taro.navigateTo({
              url: `/pages/personManage/choose?departmentCode=${departmentCode}&chooseType=${type}&checkId=${checkId}`
            })
          })
        }
      })
    } else if (type === 'department') {
      let departmentCode = '';
      if (dataObj.superviseDepartmentCode) {
        departmentCode = dataObj.superviseDepartmentCode
      }
      this.setState({
        choose: type
      }, () => {
        Taro.navigateTo({
          url: `/pages/personManage/choose?departmentCode=${departmentCode}&chooseType=${type}&checkId=${checkId}`
        })
      })
    }
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

  // 添加其他负责人
  addOtherPeople = () => {
    Taro.navigateTo({url: `/pages/pollution-manage/otherPeople`});
  }

  // 删除其他负责人
  removeItem = (index) => {
    const {otherPeopleArr} = this.state;
    otherPeopleArr.splice(index, 1)
    this.setState({
      otherPeopleArr
    })
  }

  // 编辑其他负责人
  editItem = (data) => {
    Taro.navigateTo({url: `/pages/pollution-manage/otherPeople?data=${JSON.stringify(data)}`});
  }

  changeRemark = (e) => {
    const {dataObj} = this.state;
    this.setState({
      dataObj: {
        ...dataObj,
        remark: e.target.value
      }
    })
  }

  // 污染类型是工地时，选择工地类型
  changeConstructionType = (data) => {
    const index = data.detail.value;
    const {constructionType, dataObj} = this.state;
    this.setState({
      dataObj: {
        ...dataObj,
        chooseIndustryType:index,
        industryId: constructionType[index].id,
        industryName: constructionType[index].name,
      }
    });
  }

  onChangeDate = (e) => {
    const {dataObj} = this.state;
    let licenceStartTime = moment(e.detail.value).valueOf() ;
    this.setState({
      dataObj: {
        ...dataObj,
        licenceStartTime,
      }
    });
  }
  onChangeFinishedDate = (e) => {
    const {dataObj} = this.state;
    let finishedTime = moment(e.detail.value).valueOf() ;
    this.setState({
      dataObj: {
        ...dataObj,
        finishedTime,
      }
    });
  }

  onChangeUnitType = (e) => {
    const {dataObj, unitTypeList} = this.state;
    let unitType = e.detail.value;
    this.setState({
      dataObj: {
        ...dataObj,
        investmentInstitutionTypeCode: unitTypeList[unitType].code,
        investmentInstitutionTypeName: unitTypeList[unitType].name
      }
    });
  }

  changeAllowableDeficiency = (e)=>{
    let value = e.detail.value;
    const {dataObj} = this.state;
    this.setState({
      isAllowableDeficiencyValue:value,
      dataObj: {
        ...dataObj,
        isAllowableDeficiency: value === '0' ? true :false,
      }
    })
  }

  render() {
    const {
      showScanDemo, showMore, pollutionTypeList, pollutionStatusList, dataObj, unitTypeList,chooseIndustryType,
      files, isSaving, departmentList, otherPeopleArr, departmentData, inspector, constructionType,showUploadBtn,
      isAllowableDeficiencyValue
    } = this.state;

    let ptIndex: number;
    for (ptIndex = 0; ptIndex < pollutionTypeList.length; ptIndex++) {
      if (dataObj.pollutionSourceTypeId == pollutionTypeList[ptIndex].id) {
        break;
      }
    }

    let depIndex: number;
    for (depIndex = 0; depIndex < departmentList.length; depIndex++) {
      if (dataObj.superviseDepartmentId == departmentList[depIndex].id) {
        break;
      }
    }

    let isAllowableDeficiencyText = '否';
    if(dataObj.isAllowableDeficiency){
      isAllowableDeficiencyText = '是'
    }

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
                    <Picker mode='selector' value={ptIndex} range={pollutionTypeList} range-key='name'
                      onChange={this.onPollutionTypeChange.bind(this)}
                    >
                      <Text className='txt'>{get(dataObj, 'pollutionSourceTypeName', '请选择') || '请选择'}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
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
                      value={get(dataObj, 'name', '')}
                      className='input'
                      placeholderClass='input__placeholder'
                      placeholder='输入地点名称需要和招牌一致'
                      onInput={this.onInputChange.bind(this, 'name')}
                      maxLength={32}
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
                      className={cn('input', {'input__placeholder': isEmpty(dataObj.address)})}
                    >{dataObj.address ? dataObj.address : '选择所在的地址'}</Text>
                    <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                  </View>
                </View>
              </View>

              <View className='list-item custom'>
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
                    showAddBtn={showUploadBtn}
                    files={files}
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
                      <AtIcon className='chevron_right' value={showMore ? 'chevron-up' : 'chevron-down'} size='20'
                        color='#7A8499'
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View className={showMore ? 'show' : 'hide'}>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>污染源状态</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Picker mode='selector' value={0}
                        range={pollutionStatusList.filter(item => item.pollutionSourceTypeId === dataObj.pollutionSourceTypeId)}
                        range-key='name' onChange={this.onPollutionStatusChange.bind(this)}
                      >
                        <Text className='txt'>{get(dataObj, 'statusName', '请选择') || '请选择'}</Text>
                        <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                      </Picker>
                    </View>
                  </View>
                </View>
                {dataObj && dataObj.pollutionSourceTypeId === 2 && dataObj.status ==='完工' &&
                  <View className='list-item'>
                    <View className='left'>
                      <Text className='left__title'>完工时间</Text>
                    </View>
                    <View className='right'>
                      <View className='right__container'>
                        <Picker mode='date'
                                value={moment().format('YYYY-MM-DD')}
                                end={moment().format('YYYY,MM,DD')}
                                onChange={(e) => {
                                  this.onChangeFinishedDate(e)
                                }}
                        >
                          <Text className='text_right'>{ dataObj.finishedTime ? moment(dataObj.finishedTime,'x').format('YYYY-MM-DD') : '请选择' }</Text>
                          <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                        </Picker>
                      </View>
                    </View>
                  </View>
                }
                {dataObj && dataObj.pollutionSourceTypeId === 2 &&
                  <View>
                    <View className='list-item'>
                      <View className='left'>
                        <Text className='left__title'>工地类型</Text>
                      </View>
                      <View className='right'>
                        <View className='right__container'>
                          <Picker mode='selector'
                            value={chooseIndustryType}
                            range={constructionType}
                            range-key='name' onChange={this.changeConstructionType.bind(this)}
                          >
                            <Text className='txt'>{get(dataObj, 'industryName', '请选择') || '请选择'}</Text>
                            <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                          </Picker>
                        </View>
                      </View>
                    </View>
                    <View className='list-item'>
                      <View className='left'>
                        <Text className='left__title'>是否容缺工地</Text>
                      </View>
                      <View className='right'>
                        <View className='right__container'>
                          <Picker mode='selector'
                          value={isAllowableDeficiencyValue}
                          range={['是','否']}
                          onChange={this.changeAllowableDeficiency.bind(this)}
                          >
                          <Text className='txt'>{isAllowableDeficiencyText}</Text>
                          <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                        </Picker>
                      </View>
                      </View>
                    </View>
                  </View>
                }

                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>监管部门</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={this.onDepartmentChange.bind(this)}>
                      <Text className='txt'>{get(dataObj, 'superviseDepartmentName', '请选择') || '请选择'}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                    </View>

                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>监管部门负责人</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={() => {
                      this.choosePeople('department', departmentData.linkmanId)
                    }}
                    >
                      <View>
                        <View className='name'>
                          <Text className='txt'>{get(departmentData, 'linkmanName', '请选择') || '请选择'}</Text>
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
                      <Text className='txt'>{get(dataObj, 'divisionName', '请选择') || '请选择'}</Text>
                      <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>属地责任人</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container' onClick={() => {
                      this.choosePeople('area', inspector.linkmanId)
                    }}
                    >
                      <View>
                        <View className='name'>
                          <Text className='txt'>{get(inspector, 'linkmanName', '请选择') || '请选择'}</Text>
                        </View>
                        <View className='phone'>{get(inspector, 'linkmanPhone', '') || ''}</View>
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
                      <View className={`item_list card${i}`} key={index + item.id} onClick={() => {
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
                  })
                  }
                </ScrollView>
                <View className='addBtnWarp'>
                  <Button className='addBtn' onClick={this.addOtherPeople}>
                    <Image className='btn-img' src={`${rootSourceBaseUrl}/assets/map/add.png`} />
                    添加其他负责人
                  </Button>
                </View>
              </View>
            </View>
            <View className='padding mt'>
              {dataObj && dataObj.pollutionSourceTypeId === 2 &&
              <View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>施工许可证时间</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Picker mode='date'
                        value={dataObj.licenceStartTime ? moment(dataObj.licenceStartTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                        onChange={(e) => {
                          this.onChangeDate(e)
                        }}
                      >
                        <Text className='text_right'>{ dataObj.licenceStartTime ? moment(dataObj.licenceStartTime).format('YYYY-MM-DD') : '请选择' }</Text>
                        <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                      </Picker>
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>投资单位类型</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Picker mode='selector'
                        range={unitTypeList}
                        value={0}
                        range-key='name'
                        onChange={(e) => {
                                this.onChangeUnitType(e)
                              }}
                      >
                        <Text className='text_right'>{get(dataObj, 'investmentInstitutionTypeName', '请选择') || '请选择'}</Text>
                        <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                      </Picker>
                    </View>
                  </View>
                </View>
                <View className='list-item'>
                  <View className='left'>
                    <Text className='left__title'>投资单位名称</Text>
                  </View>
                  <View className='right'>
                    <View className='right__container'>
                      <Input
                        value={get(dataObj, 'investmentInstitutionName', '')}
                        className='input'
                        placeholderClass='input__placeholder'
                        placeholder='输入投资单位名称'
                        onInput={this.onInputChange.bind(this, 'investmentInstitutionName')}
                        maxLength={32}
                      />
                    </View>
                  </View>
                </View>
              </View>
              }

              <View className='company-remark'>
                <View className='title'>备注</View>
                <Textarea onInput={this.changeRemark} value={get(dataObj, 'remark', '') || ''} className='remark' />
              </View>
            </View>
          </ScrollView>

        </View>

        <View className='add-page_footer'>
          <Text className='btn cancel' onClick={this.onCancel}>取消</Text>
          <Button className='btn save' disabled={isSaving} loading={isSaving} onClick={this.onSubmit}>保存</Button>
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
    );
  }
}

export default MarkAdd;
