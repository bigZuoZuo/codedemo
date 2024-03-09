import Taro, { Component, Config, } from '@tarojs/taro'
import { View, Text, Button, Switch } from '@tarojs/components'
import { AtImagePicker, AtTextarea } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';
import { clearValueInPageData, getCurrentPage, navBackWithData, getPrevPageData, getNewFileName } from '@common/utils/common'
import { InspectDetail, eventReview, InspectInfoType } from '../../service/inspect'
import { getLocation } from '../../service/userDivision'
import { Location } from '../../model'
import { UploadResult, uploadFile, getSignature } from '../../service/upload'
import moment from 'moment';

import './check.scss'


interface FilePath {
  url: string;
}

interface InspectReplyProps {
  userStore: any;
}

interface InspectReplyState {
  /**
   * 事件id
   */
  inspectId: number;
  /**
   * 回复事件的内容
   */
  content: string;
  pictureOssKeys?: string;
  /**
    * 事件状态 false:未完成 true：完成
    */
  status: boolean;
  pollutionSourceId?: number,
  pollutionSourceName?: string,
  pollutionSourceTypeId?: number,
  /**
   * 事件类型
   */
  type: InspectInfoType;


  /**
   * 文件上传后存放的地址
   */
  files: FilePath[];
  /**
   * 是否显示添加图片按钮
   */
  showUploadBtn: boolean;

  /**
   * 编辑button loading状态
   */
  eidtButtonLoading: boolean;

  longitude: number,
  latitude: number,
}

@inject('userStore')
@observer
export default class InspectReply extends Component<InspectReplyProps, InspectReplyState> {

  config: Config = {
    navigationBarTitleText: '复查',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  }

  constructor(props) {
    super(props)
    const { inspectId } = this.$router.params;
    this.state = {
      inspectId: inspectId && Number(inspectId) || 0,
      content: '',
      files: [],
      showUploadBtn: true,
      status: false,
      type: InspectInfoType.INCIDENT,
      eidtButtonLoading: false,
      longitude: 0,
      latitude: 0,
    }
  }

  async componentDidMount() {
    let prevPageData = getPrevPageData();
    let inspectDetail: InspectDetail = prevPageData.inspectDetail;

    if (!inspectDetail) {
      return;
    }

    this.setState({
      inspectId: inspectDetail.id,
      status: inspectDetail.status,
      pollutionSourceId: inspectDetail.pollutionSourceId,
      pollutionSourceName: inspectDetail.pollutionSourceName,
      pollutionSourceTypeId: inspectDetail.pollutionSourceTypeId,
      type: inspectDetail.type,
    });

    try {
      let location: Location = await getLocation();
      this.setState({
        longitude: location.longitude,
        latitude: location.latitude,
      });
    } catch (error) {
    }

  }


  componentDidShow() {
    let currentPage = getCurrentPage();
    const { pollutionSourceData } = currentPage.data;

    /**
     * 污染源企业
     */
    if (pollutionSourceData) {
      this.setState({
        pollutionSourceId: pollutionSourceData.id,
        pollutionSourceName: pollutionSourceData.name,
        pollutionSourceTypeId: pollutionSourceData.pollutionSourceTypeId,
      });
    }

    clearValueInPageData(['pollutionSourceData']);
  }


  /**
   * 事件是否处置完成
   */
  onStatusChange() {
    const { status } = this.state;
    this.setState({
      status: !status
    });
  }

  onImagePickChange(newFiles, operationType: string, index: number) {
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

  /**
     * 事件回复参数校验
     * @param input 
     */
  replyParameterCheck(input: any) {
    let result: boolean = true;
    let notice: string = '';

    if ((!input.pictureOssKeys || input.pictureOssKeys.length == 0)
      && (!input.content || input.content.length == 0)) {
      result = false;
      notice = '请输入内容、上传图片';
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

  getImageOssDir(){
    const dayStr:string = moment().format('YYYY/MM/DD');
    return `inspect/reply/images/${dayStr}/`;
  }

  async save() {
    const { inspectId, content, status,
      files, pollutionSourceId, pollutionSourceName, pollutionSourceTypeId } = this.state;
    const { userStore: { userDetails } } = this.props;

    this.setState({
      eidtButtonLoading: true,
    });

    //先完成图片上传
    let pictureOssKeys: string[] = [];

    if (files && files.length > 0) {
      const imageDir:string = this.getImageOssDir();
      const {data: signatureResult} = await getSignature(imageDir);   
      let promises:Promise<UploadResult>[] = [];

      for (let i = 0; i < files.length; i++) {
        const filePath:string = files[i].url;
        promises.push(uploadFile(filePath, imageDir, getNewFileName(filePath), signatureResult));        
      }
      const imageUploadResults:UploadResult[] = await Promise.all(promises);
      const failure_number:number = imageUploadResults.filter(re=>!re.success).length;

      if(failure_number > 0) {
          Taro.showToast({
              title: `有${failure_number}张图片上传失败，请检查网络环境`,
              mask: true,
              icon: 'none',
              duration: 2000
          });

          this.setState({
              eidtButtonLoading: false,
          });
          return;
      }
      pictureOssKeys = imageUploadResults.map(uploadResult=> uploadResult.ossKey);
    }

    let input: any = {
      inspectId: inspectId,
      pollutionSourceId: pollutionSourceId,
      pollutionSourceName: pollutionSourceName,
      pollutionSourceTypeId: pollutionSourceTypeId,
      content: content,
      status: status,
      pictureOssKeys: pictureOssKeys.join(','),
      disposalDepartmentName: userDetails.departmentInfo && userDetails.departmentInfo.name,
      disposalDepartmentId: userDetails.departmentInfo && userDetails.departmentInfo.id,
    };

    if (!this.replyParameterCheck(input)) {
      this.setState({
        eidtButtonLoading: false,
      });
      return;
    }

    try {
      await eventReview(input);
      navBackWithData({
        refresh: true
      });
    } catch (error) {
    }

    this.setState({
      eidtButtonLoading: false,
    });
  }

  changeContent = (event, newValue) => {
    const e = (typeof newValue === 'object') ? newValue : event
    const {value} = e.target || e.currentTarget;
    this.setState({
      content: value,
    });
  }

  render() {
    const { files, content, showUploadBtn, status, type,
      eidtButtonLoading } = this.state;

    return (
      <View className='content'>
        <View className='content_container'>
          <View className='contentInputView'>
           <AtTextarea
              className='textarea'
              value={content}
              onChange={this.changeContent}
              placeholder='请输入（必填）'
              maxLength={200}
            />
          </View>

          <View className='imagePickView_container'>
            <AtImagePicker
              className='imagePickView'
              mode='aspectFill'
              files={files}
              length={4}
              showAddBtn={showUploadBtn}
              onChange={this.onImagePickChange.bind(this)}
            />
          </View>
          <View className='replyinfoView'>
            {
              type == InspectInfoType.INCIDENT &&
              <View className='info_item'>
                <Text className='item_left'>是否处置完成</Text>
                <View className='item_right'>
                  <Switch checked={status} color='#1091FF' onClick={this.onStatusChange.bind(this)} />
                </View>
              </View>
            }
        </View>

        </View>

        <View className='buttonView'>
          <Button className='eidtButton' disabled={eidtButtonLoading} loading={eidtButtonLoading} onClick={this.save.bind(this)}>复查通过</Button>
          <Button className='eidtButton cancleButton' disabled={eidtButtonLoading} loading={eidtButtonLoading} onClick={this.save.bind(this)}>复查不通过</Button>
        </View>
      </View>
    )
  }
}