import Taro, {Component} from '@tarojs/taro';
import {View, Text, Button, ScrollView, Radio, Image} from '@tarojs/components'
import {AtImagePicker, AtTextarea} from 'taro-ui'
import {getNewFileName} from '@common/utils/common'
import {rootConstructionSourceBaseUrl, rootSourceBaseUrl} from "@common/utils/requests";
import {getAddressByLocationFromTencentMap} from '@common/utils/mapUtils'
import { isEmpty, get, debounce } from 'lodash';
import moment from 'moment'
import {getLocation} from '../../../service/userDivision'
import {Location} from '../../model'
import {UploadResult, uploadFile, getSignature} from '../../../service/upload'
import {
  inspectContentSubmitNew,
  getUpdatedItemNew,
  getUpdateNew,
  currentLevel,
  getPollutionById,
  QuestionImg
} from '../../service/patrolReport'
import './contentUpdate.scss'

const radio = `${rootSourceBaseUrl}/assets/works/radio.png`
const radioCheck = `${rootSourceBaseUrl}/assets/works/radio_check.png`

const EnumStatus = ['NORMAL','IMMEDIATELY','DELAY']

interface MyProps {
}

interface MyState {
  selectOptions: string[]
  selectedId: number
  inspectContent: string
  files: any
  showUploadBtn: boolean
  submitButtonLoading: boolean
  pollutionSourceId: number | string,
  pollutionSourceName: string,
  labelId: number,
  address: string,
  longitude: number,
  latitude: number,
  content: string,
  pictureOssKeys: string,
  status: string,
  isUpdatePage: boolean,
  id: number,
  dataObj: any,
  type: string, // addOther editOther
  detail: any, // 详细
  checkIndex: number, // 选中的项
}

class Index extends Component<MyProps, MyState> {
  config = {
    navigationBarTitleText: '上传结果',
  };

  constructor(props) {
    super(props)
    const type = this.$router.params.type || '';

    if (type === 'addOther') {
      Taro.setNavigationBarTitle({title: '其他问题'});
    }

    this.state = {
      inspectContent: '',
      // 选择的选项
      selectOptions: ['正常', '立行立改', '严重问题'],
      selectedId: 0,
      // 上传图片文件列表
      files: [],
      // 是否继续显示上传添加按钮
      showUploadBtn: true,
      // 提交时等待开启
      submitButtonLoading: false,
      // 请求接口的参数param
      pollutionSourceId: 0,
      pollutionSourceName: '',
      labelId: 0,
      address: '',
      // 经纬值
      longitude: 0,
      latitude: 0,
      // 内容
      content: '',
      // 图片返回的路径
      pictureOssKeys: '',
      status: 'DELAY', // 默认延期整改
      isUpdatePage: false,
      // 保存的id
      id: 0,
      dataObj: {},
      type,
      detail: {
        other: false,
        options: []
      },
      checkIndex: 0,
    }

    //@ts-ignore
    this.onSubmit = debounce(this.onSubmit, 300)
  }

  componentDidMount() {
    this.getInitData()
  }

  // 初始化的时候请求的数据
  async getInitData() {
    this.getLocationAndDivision()
    const $preload = get(this.$router, 'preload')
    const pollutionSourceId = get($preload,'pollutionSourceId')
    const labelDetails = get($preload, 'labelDetails', {})
    const siteName = get($preload, 'siteName')
    // 如果是回显的页面，那就显示
    if (get($preload, 'update')) {
      const specialPatrolItemId = get(labelDetails, 'specialPatrolItemId')
      if (specialPatrolItemId) {
        const response = await getUpdatedItemNew(specialPatrolItemId)
        let { content, status, pictureOssKeys, pictureOssLinks } = response.data
        const index = EnumStatus.findIndex(item => item === status) || 0
        const optionCode = get(response, 'data.optionCode');
        const options = get(labelDetails, 'options');
        let checkIndex = 0;
        options.forEach((item, index) => {
          if (item.optionCode === optionCode) {
            checkIndex = index
          }
        })
        this.setState({
          dataObj: response.data,
          content: content || '',
          status: status,
          checkIndex,
          pictureOssKeys: (pictureOssKeys || []).join(','),
          selectedId: index,
          isUpdatePage: true,
          files: (pictureOssLinks || []).map((item) => ({ url: item })),
          id: specialPatrolItemId
        })
      }
    }
    // 获取上一个页面传递来的参数
    getPollutionById(pollutionSourceId).then(res => {
      this.setState({
        detail: labelDetails,
        inspectContent: get(labelDetails, 'checkItemContent'),
        labelId: get(labelDetails, 'labelId'),
        pollutionSourceId: pollutionSourceId as any,
        pollutionSourceName: get(res, 'data.name', siteName),
      })
    })
  }

  // 选择staus的时候
  selected = (index) => {
    this.setState({
      selectedId: index,
      status: EnumStatus[index]
    })
  }

  getLocationAndDivision = async () => {

    try {
      let location: Location = await getLocation();
      let addressResponse = await getAddressByLocationFromTencentMap(location.latitude, location.longitude);
      let addressResult = addressResponse.data.result;

      this.setState({
        longitude: location.longitude,
        latitude: location.latitude,
        address: addressResult.address,
      });
    } catch (error) {
    }
  }

  // 提交按钮或者修改按钮
  onSubmit = async () => {
    let {
      id,
      isUpdatePage,
      pollutionSourceId,
      pollutionSourceName,
      address,
      longitude,
      latitude,
      content,
      status,
      detail,
      checkIndex,
      inspectContent,
      type,
      labelId,
    } = this.state
    const {dataObj, files} = this.state
    const newFiles = files.filter((item: any) => item.url.includes('tmp'))

    // 如果没获取到地址从详情拿
    if(isEmpty(address)){
      const pollutionDetail:any = await getPollutionById(pollutionSourceId);
      if(pollutionDetail && pollutionDetail.data && pollutionDetail.data.address){
        address = pollutionDetail.data.address
      }
    }

    //先完成图片上传
    let pictureOssKeys: string[] = [];
    if (newFiles && newFiles.length > 0) {
      const imageDir: string = this.getImageOssDir();
      const {data: signatureResult} = await getSignature(imageDir);
      let promises: Promise<UploadResult>[] = [];

      for (let i = 0; i < newFiles.length; i++) {
        const filePath: string = newFiles[i].url;
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
          submitButtonLoading: false,
        });
        return;
      }
      pictureOssKeys = imageUploadResults.map(uploadResult => uploadResult.ossKey);
      if (dataObj.pictureOssKeys) {
        dataObj.pictureOssKeys += ',' + pictureOssKeys.join(',')
      } else {
        dataObj.pictureOssKeys = pictureOssKeys.join(',')
      }

    } else {
      // 新增必须上传图片
      if (!get(this.$router, 'preload.update')) {
        // 必须上传图片
        Taro.showToast({
          title: `请上传现场图`,
          mask: true,
          icon: 'none',
          duration: 1000
        });
        return;
      }
    }
    this.setState({
      submitButtonLoading: true,
    }, async () => {
      try {
        let resp;
        const checkOption = detail.options[checkIndex];
        const labelIds = [labelId]
        const pollutionDetail = get(this.$router, 'preload.pollutionDetail',{})
        if(checkOption.labelId){
          labelIds.push(checkOption.labelId)
        }
        // 如果是修改页面
        if (isUpdatePage) {
          let checkItemContent = detail.checkItemContent;
          if (type === 'addOther') {
            checkItemContent = inspectContent;
          }
          let updateParam = {
            id,
            pictureOssKeys: Array.isArray(dataObj.pictureOssKeys) ? dataObj.pictureOssKeys.join(',') : dataObj.pictureOssKeys,
            content,
            status,
            checkItemContent: checkItemContent,
            optionContent: checkOption.content,
            optionName: checkOption.name,
            labelIds,
            optionCode: checkOption.optionCode,
            asIncident: checkOption.asIncident,
            divisionCode: pollutionDetail.divisionCode,
            divisionName: pollutionDetail.divisionName,
            pollutionSourceTypeId: pollutionDetail.pollutionSourceTypeId,
          }
          // 至少为一张图片的警告
          if (updateParam.pictureOssKeys.length === 0) {
            Taro.showToast({
              title: `至少选择一张图片`,
              mask: true,
              icon: 'none',
              duration: 2000
            });
            this.setState({
              submitButtonLoading: false,
            });
            return;
          }

          resp = await getUpdateNew(updateParam)
        } else {
          let checkItemContent = detail.checkItemContent;
          if (type === 'addOther') {
            checkItemContent = inspectContent;
          }
          const isGreenConstruct = Taro.getStorageSync('appKey') === 'green-construct'
          let requestParam = {
            pollutionSourceId: pollutionSourceId,
            pollutionSourceName: pollutionSourceName,
            labelIds,
            address: address,
            longitude: longitude,
            latitude: latitude,
            content: content,
            pictureOssKeys: pictureOssKeys.join(','),
            status: status,
            checkItemId: detail.checkItemId,
            checkItemContent: checkItemContent,
            other: detail.other,
            optionName: checkOption.name,
            optionContent: checkOption.content,
            options: detail.options,
            inventoryCode: detail.inventoryCode,
            optionCode: checkOption.optionCode,
            asIncident: checkOption.asIncident,
            divisionCode: pollutionDetail.divisionCode,
            divisionName: pollutionDetail.divisionName,
            pollutionSourceTypeId: pollutionDetail.pollutionSourceTypeId,
            inventoryType: isGreenConstruct ? 'green' : undefined
          }
          resp = await inspectContentSubmitNew(requestParam)
        }
        if (resp.data.success) {
          Taro.setStorageSync('update-content', true)
          Taro.navigateBack()
          Taro.showToast({
            title: `保存成功`,
            mask: true,
            icon: 'none',
            duration: 500
          });
        }
      } catch (error) {
        console.log(error)
      }
      this.setState({
        submitButtonLoading: false,
      });
    });
  }

  // 获取oss上传文件夹名称
  getImageOssDir() {
    const dayStr: string = moment().format('YYYY/MM/DD');
    return `inspect/images/${dayStr}/`;
  }

  // 添加图片的回调函数
  onImagePickChange = (newFiles, operationType: string, index) => {
    if (operationType === 'remove') {
      const {dataObj: {pictureOssKeys, pictureOssLinks}, dataObj} = this.state
      const pictureOssKeysNew = pictureOssKeys
      !isEmpty(pictureOssKeysNew) && pictureOssKeysNew.splice(index, 1)
      !isEmpty(pictureOssLinks) && pictureOssLinks.splice(index, 1)
      this.setState({
        files: newFiles,
        showUploadBtn: true,
        dataObj: {
          ...dataObj,
          pictureOssKeys: pictureOssKeysNew || [],
          pictureOssLinks: pictureOssLinks || []
        }
      }, () => {
        if (this.state.pictureOssKeys.length === 0) {
          // Taro.showToast({
          //     title: `至少选择一张图片`,
          //     mask: true,
          //     icon: 'none',
          //     duration: 2000
          // });
        }
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

  changeDescription = (event, newValue) => {
    const e = (typeof newValue === 'object') ? newValue : event
    const {value} = e.target || e.currentTarget;
    this.setState({
      content: value,
    });
  }

  onImageClick = () => {

  }

  changeChooseProblem = (checkIndex: number) => {
    this.setState({
      checkIndex,
    })
  }

  changeInspectContent = (event, newValue) => {
    const e = (typeof newValue === 'object') ? newValue : event
    const {value} = e.target || e.currentTarget;
    this.setState({
      inspectContent: value,
    });
  }

  render() {
    const {
      selectedId,
      selectOptions,
      inspectContent,
      detail,
      files,
      showUploadBtn,
      submitButtonLoading,
      isUpdatePage,
      checkIndex,
      content='',
    } = this.state

    const checkList = detail.options || [];
    return (
      <View className='page'>
        <View className='content'>
          <Text className='title'>检查内容：</Text>
          {detail.other &&
          <View>
            <AtTextarea
              className='textarea'
              value={inspectContent}
              onChange={this.changeInspectContent}
              placeholder='请输入检查内容（必填）'
              maxLength={200}
            />
          </View>
          }
          {!detail.other &&
          <View className='textLabel'>
            <Text>{inspectContent}</Text>
          </View>
          }
        </View>

        <View className='content'>
          {checkList.map((item, index) => {
            return (
              <View key={index + item.id}
                className='radioList'
                onClick={this.changeChooseProblem.bind(this, index)}>
                <View>
                  <Image className='radio' src={checkIndex === index ? radioCheck : radio}></Image>
                </View>
                <View>
                  <View className='radioTitle'>
                    {item.name}
                    {(item.icon || item.customIcon) && <Image className='flag' style='margin-left:6px;' src={QuestionImg[item.icon] || item.customIcon}></Image>}
                  </View>
                  <View className='radioText'>{item.content}</View>
                </View>
              </View>
            )
          })
          }
        </View>
        {false &&
        <View className='content padding'>
          <View className='status_select'>
            <Text className='title'>问题状态</Text>
            <View className='options'>
              {
                selectOptions.map((item, index) => {
                  return (
                    <View
                      className={`${selectedId === index ? "item selected" : "item"}`}
                      onClick={this.selected.bind(this, index)}
                    >
                      {item}
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>
        }


        <View className='bottom'>
          <View className='content uploadFile'>
            <View style='padding-bottom:10px'>
              <Text className='title'>上传现场图：</Text>
            </View>
            <AtImagePicker
              className='upload'
              mode='aspectFill'
              files={files}
              length={3}
              showAddBtn={showUploadBtn}
              onChange={this.onImagePickChange.bind(this)}
              onImageClick={this.onImageClick.bind(this)}
            />
            <View className='textWarp'>
              <AtTextarea
                className='textarea'
                value={content}
                onChange={this.changeDescription}
                placeholder='请输入描述内容（非必填）'
                maxLength={200}
              />
            </View>
          </View>
        </View>
        <View  className='submit'>
          <Button
            onClick={this.onSubmit}
            className='submitBtn'
            disabled={submitButtonLoading}
            loading={submitButtonLoading}
          >
            {isUpdatePage ? '确认修改' : '确认上传'}
          </Button>
        </View>
      </View>
    );
  }
}

export default Index
