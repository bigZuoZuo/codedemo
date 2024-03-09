import Taro, { Component, Config, } from '@tarojs/taro'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import { AtImagePicker, AtIcon } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx';
import { SimpleRichInput } from '@common/components/rich-text'
import { PollutionType, list as pollutionTypelist } from '../../service/pollutionType'
import { InspectInfo, clapAdd as inspectReport, InspectInfoType, getPollutionType,pollutionTypes } from '../../service/inspect'
import MjLabel from '../../components/MjLabel/index'
import { clearValueInPageData, getCurrentPage, getNewFileName } from '@common/utils/common'
import { joinAts, joinTags, AtOrTag, getShowContent } from '@common/utils/rich-text'
import { getLocation } from '../../service/userDivision'
import { getAddressByLocationFromTencentMap } from '@common/utils/mapUtils'
import { getDivision } from '../../service/division'
import { rootSourceBaseUrl, webSite } from '@common/utils/requests'
import { checkDivision } from '@common/utils/divisionUtils'
import { SimpleUser } from '@common/service/user'
import FpiRecorder from '@common/components/FpiRecorder'
import RadioButton from '@common/components/radioButton'
import FpiPopupChoose from '@common/components/FpiPopupChoose'
import FpiPreviewImage from '@common/components/FpiPreviewImage'
import FpiGrant from '@common/components/FpiGrant';
import { Location } from '../../model'
import {current, current as currentSpecialActivity, SpecialActivity} from '../../service/spectionAction'
import { LabelType } from '../../service/label'
import { DispatchType } from '../../service/dispatch'
import { UploadResult, uploadFile, getSignature } from '../../service/upload'
import { getImpactAnalysisResult } from '../../service/impactAnalysis'
import get from 'lodash/get';
import moment from 'moment';
import './clap.scss'

const bigMapIcon = `${rootSourceBaseUrl}/assets/works/bigmap.png`;

const getFillColor = (index: number, size: number) => {
    let levelValue = Math.ceil(16 + ((size - index) / size) * 64);
    return ("#E22424" + levelValue.toString(16));
}

interface InspectReplyProps {
    userStore: any;
}

interface Photo {
    url: string;
    rotate: number;
}

interface InspectReplyState {
    pollutionTypeList: PollutionType[]; // 污染类型列表
    type: InspectInfoType; // 事件类型
    content: string; // 填写的事件内容
    pollutionType?: PollutionType; // 选择的污染类型
    enforcementLaw: boolean; // 是否行政执法
    status: boolean; // 事件状态 false:未完成 true：完成
    photos: Photo[]; // 图片上传后存放的地址
    recorderPath?: string; // 录音地址
    recoderDuration?: number; // 录音时长
    showUploadBtn: boolean; // 是否显示添加图片按钮
    address: string; // 地址
    longitude: number;
    latitude: number;
    divisionCode: string;
    divisionName: string;
    pollutionSourceId?: number,
    pollutionSourceName?: string,
    pollutionSourceTypeId?: number,
    togethers: SimpleUser[],
    anonymous: boolean, // 匿名上报
    eidtButtonLoading: boolean; // 编辑button loading状态
    dispatchType?: DispatchType,
    reactiveDispatchId?: number; // 响应式调度id
    showRecorder: boolean; // 是否显示录音
    showPreview: boolean; // 显示预览查看
    picIndex: number; // 当前被点击图片的索引值
    impactAnalysisPolygons: any[]; // 影响分析多边形区域
    impactAnalysisData?: any; // 影响分析数据
    reportData: any;
    isLoading: boolean;
    disabled: boolean; // 是否允许提交
}

let isReprt = false; // 是否正在提交

@inject('userStore')
@observer
export default class InspectReply extends Component<InspectReplyProps, InspectReplyState> {
    config: Config = {
        navigationBarTitleText: '我要举报',
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        backgroundColor: '#FFFFFF',
    }

    constructor(props) {
        super(props)
        const { userStore: { userDetails } } = props
        this.state = {
            photos: [],
            showUploadBtn: true,
            pollutionTypeList: [],
            type: InspectInfoType.PATROL,
            enforcementLaw: false,
            status: false,
            content: '',
            longitude: 0,
            latitude: 0,
            divisionCode: '',
            divisionName: '',
            address: '',
            togethers: [],
            eidtButtonLoading: false,
            anonymous: false,
            showRecorder: false,
            showPreview: false,
            impactAnalysisPolygons: [],
            picIndex: 0,

            reportData: {
                pollutionTypeId: null,
                pollutionTypeName: "",
                address: "",
                fullAddress: "",
                content: "",
                longitude: '',
                latitude: '',
                time: moment().valueOf(),
                pictureOssKeys: "",
                phone: get(userDetails, 'phone'),
                tenant_code: '330600000000',
                tenant_name: '绍兴市'
            },
            isLoading: false,
            disabled:false,
        }
    }

    componentDidMount() {
        const { reactiveDispatchId, dispatchType, photos = '[]', type } = this.$router.params;

        this.setState({
            type: type == InspectInfoType.INCIDENT ? InspectInfoType.INCIDENT : InspectInfoType.PATROL,
            reactiveDispatchId: reactiveDispatchId && parseInt(reactiveDispatchId) || undefined,
            dispatchType: dispatchType ? (dispatchType == 'ALARM' ? 'ALARM' : 'REACTIVE_DISPATCH') : undefined,
            photos: photos ? JSON.parse(photos) : []
        });

        this.getLocationAndDivision();
        isReprt = false;
    }

    componentDidShow() {
        const currentPollution = Taro.getStorageSync('pollutionType')
        const { reportData } = this.state
        if (currentPollution) {
            this.setState({
                reportData: {
                    ...reportData,
                    pollutionTypeId: currentPollution.id,
                    pollutionTypeName: currentPollution.name,
                }
            })
            Taro.removeStorageSync('pollutionType')
        }else{
          if(!reportData.pollutionTypeId){
            pollutionTypes().then(res => {
              const configs:any = get(res, 'data', [])
              const pollutionType:any =  get(configs.find(item => item.code === 'pollution-type'), 'config');
              const choose = pollutionType.labels[0].pollutionTypes[0];
              this.setState({
                reportData: {
                  ...reportData,
                  pollutionTypeId: choose.id,
                  pollutionTypeName: choose.name,
                }
              })
            })
          }
        }
    }

    getLocationAndDivision = async () => {
        try {
            let location: Location = await getLocation();
            let addressResponse = await getAddressByLocationFromTencentMap(location.latitude, location.longitude);
            let addressResult = addressResponse.data.result;

            const { reportData } = this.state
            this.setState({
                reportData: {
                    ...reportData,
                    fullAddress: get(addressResult, 'formatted_addresses.recommend'),
                    address: get(addressResult, 'address'),
                    longitude: location.longitude,
                    latitude: location.latitude,
                }
            })
        } catch (error) {
        }
    }

    handleContentChange(value: string) {
        const { reportData } = this.state
        reportData.content = value || ''
        this.setState({ reportData });
    }

    onImagePickChange(newFiles, operationType: string) {
        const photos: Photo[] = newFiles.map((obj: any) => {
            return { url: obj.url || '', rotate: 0 }
        });

        if (operationType === 'remove') {
            this.setState({
                photos,
                showUploadBtn: true
            });
        } else {
            this.setState(() => {
                return ({
                    photos,
                })
            }, () => {
                if (this.state.photos.length === 9) {  // 最多9张图片 隐藏添加图片按钮
                    this.setState({
                        showUploadBtn: false
                    })
                }
            });
        }
    }

    onImageClick = (index: number) => {
        this.setState({
            picIndex: index,
            showPreview: true
        })
    }

    onPollutionTypeChange(res) {
        let index = res.detail.value;
        const { pollutionTypeList } = this.state;

        this.setState({
            pollutionType: pollutionTypeList[index]
        });
    }

    onEnforcementLawChange(res) {
        this.setState({
            enforcementLaw: res.detail.value
        });
    }

    onStatusChange(res) {
        this.setState({
            status: res.detail.value
        });
    }

    /**
     * 地址选择
     */
    async addressSelect() {
        try {
            const { reportData } = this.state
            const res = await Taro.chooseLocation();
            const latitude = res.latitude;
            const longitude = res.longitude;
            this.setState({
                reportData: {
                    ...reportData,
                    fullAddress: get(res, 'address'),
                    address: get(res, 'name'),
                    longitude,
                    latitude,
                }
            })
        } catch (error) {
        }
    }

    /**
     * 事件上报参数校验
     */
    checkInput(): boolean {
        const { reportData, photos } = this.state;
        let result: boolean = true;
        let notice: string = '';

        // 必填校验
        if (photos.length === 0 && !reportData.content) {
            result = false;
            notice = '请添加描述或图片';
        }
        else if (!reportData.address) {
            result = false;
            notice = '请选择事发地址';
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

    getImageOssDir() {
        const dayStr: string = moment().format('YYYY/MM/DD');
        return `inspect/images/${dayStr}/`;
    }

    /**
     * 事件上报
     */
    report = async () => {
        if (this.checkInput()) {
            try {
                this.setState({
                    isLoading: true,
                    disabled:true
                }, async () => {
                    const { reportData, photos } = this.state

                    //先完成图片上传
                    let pictureOssKeys: string[] = [];

                    if (photos && photos.length > 0) {
                        const imageDir: string = this.getImageOssDir();
                        const { data: signatureResult } = await getSignature(imageDir);
                        let promises: Promise<UploadResult>[] = [];

                        for (let i = 0; i < photos.length; i++) {
                            const filePath: string = photos[i].url;
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
                        }
                        pictureOssKeys = imageUploadResults.map(uploadResult => uploadResult.ossKey);
                        reportData.pictureOssKeys = pictureOssKeys.join(',');
                    }

                    inspectReport(reportData).then(_ => {
                        Taro.showToast({
                            title: '举报成功',
                            icon: "success",
                            duration: 2000
                        })
                        setTimeout(() => {
                            Taro.navigateBack({})
                        }, 2000)
                    })
                })
            }
            catch (err) {
                this.setState({
                    isLoading: false,
                    disabled:false
                })
            }
        }

        // let { pollutionType, content, enforcementLaw, status,
        //     longitude, latitude, divisionCode, divisionName, address,
        //     type, photos, pollutionSourceId, pollutionSourceName,
        //     pollutionSourceTypeId, recorderPath, recoderDuration, togethers,
        //     reactiveDispatchId, dispatchType, anonymous, impactAnalysisData } = this.state;
        // const { userStore: { userDetails } } = this.props;

        // if (isReprt == true) {
        //     return false;
        // }

        // isReprt = true;
        // this.setState({
        //     eidtButtonLoading: true,
        // });

        // //先完成图片上传
        // let pictureOssKeys: string[] = [];
        // let firstPictureUrl = '';

        // if (photos && photos.length > 0) {
        //     const imageDir: string = this.getImageOssDir();
        //     const { data: signatureResult } = await getSignature(imageDir);
        //     let promises: Promise<UploadResult>[] = [];

        //     for (let i = 0; i < photos.length; i++) {
        //         const filePath: string = photos[i].url;
        //         promises.push(uploadFile(filePath, imageDir, getNewFileName(filePath), signatureResult));
        //     }
        //     const imageUploadResults: UploadResult[] = await Promise.all(promises);
        //     const failure_number: number = imageUploadResults.filter(re => !re.success).length;

        //     if (failure_number > 0) {
        //         Taro.showToast({
        //             title: `有${failure_number}张图片上传失败，请检查网络环境`,
        //             mask: true,
        //             icon: 'none',
        //             duration: 2000
        //         });

        //         isReprt = false;
        //         this.setState({
        //             eidtButtonLoading: false,
        //         });
        //         return;
        //     }
        //     pictureOssKeys = imageUploadResults.map(uploadResult => uploadResult.ossKey);
        // }

        // if (!divisionCode || !divisionName) {
        //     //如果未获取到上报位置所在的行政区
        //     divisionCode = userDetails.divisionCode;
        //     divisionName = userDetails.divisionName;
        // }

        // if (!this.reportParameterCheck()) {
        //     this.setState({
        //         eidtButtonLoading: false,
        //     });
        //     isReprt = false;
        //     return;
        // }

        // try {
        //     const reportResp = await inspectReport(input);
        //     let output: InspectInfo = reportResp.data;

        //     firstPictureUrl = firstPictureUrl && firstPictureUrl.length > 0 ? encodeURIComponent(firstPictureUrl) : '';
        //     let contentToSuccessPage = content && content.length > 0 ? encodeURIComponent(getShowContent(content)) : '';

        //     let pollutionTypeName = pollutionType && pollutionType.name || '';
        //     //跳转到成功页面
        //     await Taro.redirectTo({
        //         url: `./success?type=${type}&inspectId=${output.id}
        //         &firstPictureUrl=${firstPictureUrl}&content=${contentToSuccessPage}
        //         &pollutionTypeName=${pollutionTypeName}`
        //     });
        // } catch (error) {
        //     this.setState({
        //         eidtButtonLoading: false,
        //     });
        //     isReprt = false;
        // }

    }

    onPreviewBack = () => {
        this.setState({
            showPreview: false
        })
    }

    onPreviewDelete = (index: number) => {
        const { photos } = this.state
        photos.splice(index, 1)
        this.setState({
            photos,
            showPreview: false,
            showUploadBtn: true
        })
    }

    /**
     * 授权开启
     */
    onOK = () => {
        this.getLocationAndDivision()
    }

    /**
   * 数据加密显示
   */
    getEncryptionString = (str: string, type: string) => {
        if (!str) { return '' }
        else {
            if (type === 'name') { return str.substr(0, 1) + '**' }
            else if (type === 'phone') { return str.substr(0, 3) + '****' + str.substr(7, 12) }
            else str
        }
    }

    getEllipsisStr = (str: string, len: number) => {
        if ((!str) || str.length <= len) {
            return str
        }
        else {
            return str.substr(0, len) + '...'
        }
    }

    // 标签选择
    onChooseLabel = () => {
        Taro.navigateTo({
            url: './label'
        })
    }

    render() {
        const { photos, showUploadBtn, picIndex, showPreview, reportData, isLoading,disabled } = this.state;
        const { userStore: { userDetails } } = this.props

        const files: any[] = photos.map((p: Photo) => {
            return { url: p.url };
        });

        return (
            <View className='content'>
                <ScrollView className='content-scroll' scrollY scrollWithAnimation>
                    <View className='content-container'>
                        <View className='contentInputView'>
                            <SimpleRichInput
                                class-name="simple_input"
                                placeholder='请输入污染描述'
                                showVoice={false}
                                showLabel={false}
                                value={reportData.content}
                                source="green_construction"
                                onValueChange={this.handleContentChange.bind(this)}
                            />
                        </View>

                        <View className='label-choose'>
                            <MjLabel data={reportData.pollutionTypeName} onChoose={this.onChooseLabel} />
                        </View>

                        <View className='imagePickView_container'>
                            <AtImagePicker
                                className='imagePickView'
                                mode='aspectFill'
                                files={files}
                                length={4}
                                showAddBtn={showUploadBtn}
                                onChange={this.onImagePickChange.bind(this)}
                                onImageClick={this.onImageClick.bind(this)}
                            />
                            {showPreview && <FpiPreviewImage picIndex={picIndex} photos={photos} onBack={this.onPreviewBack.bind(this)} onDelete={this.onPreviewDelete.bind(this)} />}
                        </View>

                        <View className='replyinfoView'>
                            <View className='info_item'>
                                <Text className='item_left required'>事发地址</Text>
                                <View className='item_right' onClick={this.addressSelect.bind(this)}>
                                    <View className='addressInfo'>
                                        <Text className='address_name'>{this.getEllipsisStr(get(reportData, 'address'), 14)}</Text>
                                        <Text className='address'>{this.getEllipsisStr(get(reportData, 'fullAddress'), 18)}</Text>
                                    </View>
                                    <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                                </View>
                            </View>
                            <View className='info_item'>
                                <Text className='item_left'>事发时间</Text>
                                <View className='item_right'>
                                    <Text className='text_right choosed'>{moment(reportData.time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                    <AtIcon className='chevron_right' value='chevron-right' size='20' color='#7A8499' />
                                </View>
                            </View>
                            <View className='info_item'>
                                <Text className='item_left'>姓名</Text>
                                <View className='item_right'>{this.getEncryptionString(get(userDetails, 'nickname'), 'name')}</View>
                            </View>
                            <View className='info_item'>
                                <Text className='item_left'>手机号</Text>{}
                                <View className='item_right'>{this.getEncryptionString(get(reportData, 'phone'), 'phone')}</View>
                            </View>

                            <View className='subInfo'>
                                <Text className='info'>如有疑问，请查看</Text>
                                <Text className='link'>《绍兴蓝天举报说明》</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className='buttonView'>
                    <Button className='eidtButton' loading={isLoading} onClick={this.report.bind(this)} disabled={disabled}>提交</Button>
                </View>

                <FpiGrant onOk={this.onOK} />
            </View>
        )
    }
}
