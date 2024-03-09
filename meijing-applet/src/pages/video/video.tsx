import Taro, { Component, Config } from "@tarojs/taro";
import { View, LivePlayer, ScrollView, Image, Block } from "@tarojs/components";
import { AtActivityIndicator } from 'taro-ui'
import { observer, inject } from "@tarojs/mobx";
import { rootConstructionSourceBaseUrl } from '@common/utils/requests'
import { getLivePlayerAddress } from '@common/utils/common'
import NoData from "@common/components/NoData/monitor";
import ListView from "@common/components/ListView";
import VideoAlarmItem from "@common/components/FbiItems/VideoAlarmItem";
import EmptyHolder from "@common/components/EmptyHolder";

import {getVideoBySiteCode, listConstructionVideoInspects, videoPlayDetail} from '../../service/video'
import "./video.scss";
import { get,isEmpty } from "lodash";

const ImgFullBig = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/icon-big.png`
const ImgFullLittle = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/icon-little.png`

interface VideoProps {
  userStore: any;
}

interface VideoState {
  currentVideoCode: string;
  siteCode: string;
  siteName: string;
  currentVideoPlayAddrdss: string;
  isPlaying: boolean;
  isFirstPlay: boolean;
  videoList: any;
  isFull: boolean;
  playerLoading: boolean;
  playerError: boolean;
  paramQuery: {
    offset: number;
    limit: number;
    pollutionSourceId: string;
  };
  list: any[];
  isInit: boolean;
  isLoading: boolean;
  hasMore: boolean;
}

@inject("userStore")
@observer
export default class SiteVideo extends Component<VideoProps, VideoState> {
  config: Config = {
    navigationBarTitleText: "",
    navigationBarTextStyle: "white",
    navigationBarBackgroundColor: "#1B1E26",
  };
  videoContext: any;

  constructor(props) {
    super(props);
    let { siteCode, siteName } = this.$router.params;

    this.state = {
      siteCode,
      siteName,
      currentVideoCode: "",
      currentVideoPlayAddrdss: "",
      isPlaying: true,
      videoList: null,
      isFirstPlay: true,
      isFull: false,
      playerLoading: true,
      playerError: false,
      paramQuery: {
        offset: 0,
        limit: 10,
        pollutionSourceId: siteCode,
      },
      list: [],
      isInit: false,
      isLoading: false,
      hasMore: false,
    };
    if (siteName) {
      Taro.setNavigationBarTitle({
        title: siteName,
      });
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const { siteCode } = this.state;
    let _this = this;
    this.videoContext = Taro.createLivePlayerContext("livePlayer");

    getVideoBySiteCode(siteCode).then((videoList) => {
      const videoResult: any = videoList.data;
      _this.setState({
        videoList: videoList,
      }, () => {
        if (videoResult && videoResult.length > 0) {
          this.resetVideoPlayAddress(videoResult[0].videoCode)
        }
      });
    });
    this.fetchList()
  }

  playVideo() {
    const { isFirstPlay } = this.state;
    this.setState(
      {
        isPlaying: true,
        isFirstPlay: false
      },
      () => {
        if (this.videoContext) {
          if (isFirstPlay) {
            console.log("play");
            this.videoContext.play();
            return;
          }
          // if (!isPlaying) {
          //   console.log("resume");
          //   this.videoContext.resume();
          // } else {
          //   console.log("pause");
          //   this.videoContext.pause();
          // }
        }
      }
    );
  }



  resetVideoPlayAddress(videoCode: string) {
    let _this = this;
    videoPlayDetail(videoCode).then((videoDetail) => {
      let playAddress: string[] = videoDetail.data.playDomainAddress;
      const currentAddress = getLivePlayerAddress(playAddress)
      console.log('player:', currentAddress)
      _this.setState({
        currentVideoPlayAddrdss: currentAddress,
        currentVideoCode: videoCode,
        isFirstPlay: true,
        playerLoading: true,
        playerError: false
      }, () => {
        this.videoContext.stop();
        setTimeout(() => {
          this.playVideo()
        }, 1000)
      });
    });
  }

  onFullScreen = (e) => {
    e.stopPropagation()
    const { isFull } = this.state
    this.setState({
      isFull: !isFull
    }, () => {
      isFull ? this.videoContext.exitFullScreen() : this.videoContext.requestFullScreen({ direction: 90 })
    })
  }

  onStateChange = (e: any) => {
    console.log(e, 'video')
    switch (e.detail.code) {
      case 2001:
      case 2007:
      case 2103:
        this.setState({ playerLoading: true })
        break;
      case 2004:
      case 2105:
        this.setState({ playerLoading: false })
        break;
      case -2301:
        this.setState({ playerLoading: false, playerError: true })
        break;
    }
  }

  onRefresh = () => {
    const { paramQuery } = this.state;
    this.setState({
      paramQuery: {
        ...paramQuery,
        offset: 0
      },
      list: []
    }, () => {
      this.fetchList();
    })
  }

  fetchList = (callback?: any) => {
    const { paramQuery, isInit, list,siteCode } = this.state;
    listConstructionVideoInspects(siteCode,paramQuery).then((res) => {
      const {
        data: { entries = [] },
      } = res;
      let newList = entries;
      if (!isInit) {
        newList = list.concat(newList);
      }
      this.setState({
        list: newList,
        isLoading: false,
        isInit: false,
        hasMore: entries.length == paramQuery.limit,
        paramQuery: {
          ...paramQuery,
          offset: paramQuery.offset + paramQuery.limit,
        },
      }, () => {
        if (callback) {
          callback();
        }
      });
    }).catch(() => {
      callback()
    });
  };

  render() {
    const {
      currentVideoPlayAddrdss,
      isPlaying,
      videoList,
      currentVideoCode,
      isFull,
      playerLoading,
      playerError,
      hasMore,
      isLoading,
      list,
    } = this.state;
    const scrollStyle = {};

    if (isEmpty(get(videoList, 'data'))) {
      return (
        <View className='root-empty'>
          <NoData isVideo showBack text='该站点暂无视频设备' />
        </View>
      )
    }
    const showEmpty = (
      <View className='empty'>
        <EmptyHolder text='暂无数据' />
      </View>
    );

    let isEmptyData = !list || list.length == 0;
    const showList = list.map((item, index) => (
      <VideoAlarmItem
        key={item.id}
        data={item}
        isLast={index === list.length - 1}
      />
    ));

    return (
      <View className='root'>
        {
          isEmpty(get(videoList, 'data')) ?
            (
              <View className='video-empty'>
                <NoData showBack={false} isVideo text='该站点暂无视频设备' />
              </View>
            ) :
            (
              <Block>
                <View
                  className='live_player_container'
                  onClick={this.playVideo.bind(this)}
                >
                  <LivePlayer
                    className='live-player'
                    id='livePlayer'
                    src={currentVideoPlayAddrdss}
                    mode='RTC'
                    autoplay={false}
                    muted={false}
                    orientation='vertical'
                    minCache={1}
                    maxCache={3}
                    objectFit='fillCrop'
                    backgroundMute
                    onStateChange={this.onStateChange}
                  >
                    {playerLoading && <AtActivityIndicator color='#fff' size={48} mode='center' content='加载中...' />}
                    {playerError && <View className='video_error'>网络不佳，请稍后再试</View>}
                    {isPlaying && (<Image className='img_full' src={isFull ? ImgFullLittle : ImgFullBig} onClick={this.onFullScreen} />)}
                  </LivePlayer>
                </View>
                <ScrollView
                  className='scrollview'
                  scrollX
                  scrollWithAnimation
                  style={scrollStyle}
                  onScrollToUpper={() => { }}
                  onScroll={() => { }}
                >
                  {videoList != null &&
                    videoList.data.map((videoItem) => {
                      return (
                        <View className='video_item'>
                          {videoItem.sentry && (
                            <Image
                              className='sentry_icon'
                              src={require("../../assets/video/sentry_icon.png")}
                            ></Image>
                          )}
                          <View
                            className='video_container'
                            onClick={this.resetVideoPlayAddress.bind(
                              this,
                              videoItem.videoCode
                            )}
                          >
                            <Image
                              className={currentVideoCode == videoItem.videoCode ? "video on_selected" : "video"}
                              src={require("../../assets/video/video_item_default.png")}
                            />
                            <View className={currentVideoCode == videoItem.videoCode ? "title on_selected_title" : "title"}>{videoItem.name}</View>
                          </View>
                        </View>
                      );
                    })}
                </ScrollView>
              </Block>
            )

        }
        <View className='inspect_container'>
          <View className='tip'>历史预警记录</View>
          <ListView
            com-class='content'
            hasMore={hasMore}
            hasData={!isEmpty(list)}
            showLoading={isLoading}
            onRefresh={this.onRefresh}
            onEndReached={this.fetchList}
          >
            {isEmptyData ? showEmpty : showList}
          </ListView>
        </View>
      </View>
    );
  }
}
