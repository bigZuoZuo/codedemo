import Taro, { Component, Config } from '@tarojs/taro';
import { View, Map, CoverView, CoverImage } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx';
import { Location } from '../../model'
import { rootSourceBaseUrl, isRelease, getUserAvatarUrl, } from '@common/utils/requests'
import PopPollution from '../../components/PopPollution'
import Principal from '../../components/Principal'
import { getLocation } from '../../service/userDivision'
import { Region } from '../../service/dispatch'
import { UserStore } from "@common/store/user";
import { MapStore } from '../../store/map'
import { SystemInfoStore } from '@common/store/systeminfo'
import { isEmpty, get, debounce } from 'lodash'
import './map.scss'
import { getPeopleByLocation } from '../../service/pollutionType'
import {getAddressByLocationFromTencentMap} from '@common/utils/mapUtils'

const biaoJiUrlPath = rootSourceBaseUrl + "/assets/task_dispatch/biaoji.png";

interface MapProps {
    userStore: UserStore;
    mapStore: MapStore;
    systemInfoStore: SystemInfoStore;
}

interface MapState {
    centerLocaltion: Location,
    marker: any,
    nowData: any,
    showPrincipal: boolean,
    label: any,
    peopleData: any,
}


const currentLocaltion = rootSourceBaseUrl + "/assets/task_dispatch/location_center.png";

@inject('userStore', 'mapStore', 'systemInfoStore')
@observer
class MapPage extends Component<MapProps, MapState> {
    config: Config = {
        navigationBarTitleText: '污染源地图',
        disableScroll: true,
        enablePullDownRefresh: false,
    }

    mapCtx: any = null

    static externalClasses = ['com-class']

    constructor(props) {
        super(props);
        this.state = {
            centerLocaltion: {
                longitude: 0,
                latitude: 0
            },
            marker: {
                id: -1,
                latitude: 0,
                longitude: 0,
                title: '',
            },
            nowData: {
                address: ''
            },
            showPrincipal: false,
            peopleData: {}
        }
        this.onRegionchange = debounce(this.onRegionchange, 1000)
    }

    componentWillMount() {
        const { mapStore } = this.props
        //@ts-ignore
        mapStore.setCurrentPlatform(this.props.systemInfoStore.systemInfo.platform)
    }

    componentDidMount() {
        this.mapCtx = Taro.createMapContext('myMap')
        try {
            //@ts-ignore
            const { userStore: { userDetails: { divisionCenterLocation } } } = this.props;
            if (!isEmpty(divisionCenterLocation)) {
                this.setState({
                    centerLocaltion: divisionCenterLocation,
                }, () => {
                    setTimeout(() => {
                        this.onMoveToCurentPosition()
                    }, 500)
                })
            } else {
                getLocation().then(location => {
                    this.setState({
                        centerLocaltion: location,
                    })
                }, this.onMoveToCurentPosition)
            }
        } catch (error) {
            console.log(error);
        }
        Taro.setStorageSync('refreshMapLocation', 1)
    }

    componentDidShow() {
        if (Taro.getStorageSync('refreshMapLocation')) {
            this.componentDidMount()
        }
    }

    componentDidHide() {
        Taro.removeStorageSync('refreshMapLocation')
    }

    //地图移动到当前位置
    onMoveToCurentPosition() {
        this.mapCtx.moveToLocation()
    }

    onCloseHandle = () => {
        this.props.mapStore.resetSelectedMarker()
    }

    onRegionchange = () => {
        try {
            const { mapStore } = this.props;
            mapStore.loadPollutionSources()
        } catch (error) {
            console.log(error);
        }
    }

    onBindMarker = (res) => {
        const { mapStore } = this.props
        this.onClosePrincipal()
        mapStore.resetSelectedMarker()
        mapStore.selectMarker(res.detail.markerId)
        // this.moveToCurrentSelect()
    }

    moveToCurrentSelect = () => {
        const { mapStore: { selectedMarker: { data } } } = this.props
        this.mapCtx.moveToLocation({ latitude: data.latitude, longitude: data.longitude })
    }

    onBindTap = (res) => {
        const { mapStore } = this.props
        mapStore.resetSelectedMarker()
        setTimeout(() => {
            const { mapStore: { selectedMarker } } = this.props
            if (isEmpty(selectedMarker)) {
                // console.log('点击的是地图空白部分',res.detail)
                // const location = {latitude: 30.089814, longitude: 120.496352}
                getAddressByLocationFromTencentMap(res.detail.latitude, res.detail.longitude).then(mapInfo=>{
                  if(res){
                      // console.log(mapInfo)
                      const address = mapInfo.data.result.address;
                      this.setState({
                        nowData:{
                          address
                        }
                      })
                      let marker = {
                        id:-1,
                        latitude:res.detail.latitude,
                        longitude:res.detail.longitude,
                        // width:30,
                        // height:40,
                        // label: {
                        //   padding: 6,
                        //   borderWidth: 1,
                        //   borderRadius: 6,
                        //   width: 180,
                        //   borderColor:'#fff',
                        //   bgColor:'#fff',
                        //   content:address,
                        //   anchorX:-90,
                        //   anchorY:-80,
                        //   color:'#101F42',
                        //   display:'ALWAYS',
                        // }
                      }
                      this.setState({
                        showPrincipal:true,
                        marker:marker
                      })
                      getPeopleByLocation({
                        latitude:res.detail.latitude,
                        longitude:res.detail.longitude
                        // latitude:location.latitude,
                        // longitude:location.longitude
                      }).then((people:any)=>{
                        console.log('peopleData=>',people)
                        if(people){
                          this.setState({
                            peopleData:people.data;
                          })
                        }
                      })

                  }
                })

            }
        }, 200)
    }
    onClosePrincipal = ()=>{
      this.setState({
          showPrincipal:false,
          marker:{
              id:-1,
              longitude: 0,
              latitude: 0
          }
      })
    }

    //点击标签
    onClickTag() {
        Taro.navigateTo({
            url: `/pages/mark/index`
        })
    }

    componentWillUnmount() {
        const { mapStore } = this.props
        mapStore.resetSelectedMarker()
        Taro.removeStorageSync('mapFirstLoad')
    }

    render() {
        const { mapStore: { pollutionSourceMarkers, selectedMarker } } = this.props
        const { marker,nowData,showPrincipal,peopleData } = this.state
        const  markers = [...pollutionSourceMarkers,marker]
        return (
            <View className='map-page'>
                <View style={{ display: 'none' }} onClick={this.onBindTap}></View>
                <Map
                    id='myMap'
                    className='myMap'
                    scale={14}
                    showLocation
                    bindtap={this.onBindTap}
                    markers={markers}
                    onMarkerTap={this.onBindMarker}
                    onRegionChange={this.onRegionchange}
                >
                    <CoverView className="map-float-container">
                        <CoverView className="map-current" onClick={this.onMoveToCurentPosition}>
                            <CoverImage className="current-img" src={currentLocaltion}></CoverImage>
                        </CoverView>
                        <CoverView className="notice">
                          <CoverView className="text">请点击地图查看当前属地负责人</CoverView>
                        </CoverView>
                    </CoverView>
                </Map>
                {showPrincipal &&
                  <Principal nowData={nowData} data={peopleData} onClose={this.onClosePrincipal} />
                }
                {!isEmpty(selectedMarker) && <PopPollution data={selectedMarker.data} onClose={this.onCloseHandle} />}

                <CoverView className="dispatch_tool_group">
                    <CoverView className="dispatch_item" onClick={this.onClickTag}>
                        <CoverImage className="dispatch_icon" src={biaoJiUrlPath}></CoverImage>
                        <CoverView className="txt">标记</CoverView>
                    </CoverView>
                </CoverView>
            </View>
        );
    }
}

export default MapPage;
