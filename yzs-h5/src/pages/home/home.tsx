import {useEffect, useState, useCallback} from 'react'
import {Block, View, Text} from '@tarojs/components'
import {Tabs, Image, List} from 'react-vant'
import Taro from '@tarojs/taro'
// import dayjs from 'dayjs'
import {AtNoticebar} from 'taro-ui'
import dayjs from 'dayjs'

// import NavigationBar from '@/components/navigation-bar/navigation-bar'
// import {useStore} from '@/store'
import {api} from '@/api'
import {IBanner} from '@/typings'
// import {GHomeSearchListIn} from '@/api/api'
import {useStore} from '@/store'

import ListState from '@/components/list-state/list-state'
import TabBar from '@/components/tab-bar/tabbar'
import {useCommonDialog} from '@/components/common-dialog'
import {NoticeDetail} from '../comment-list/comment-list'
import './index.scss'
import {BannerSwiperBox} from './banner'


interface showImageOrVideoProps {
  type: string;
  url: string;
  className: string;
  canClick?: boolean;
  oUrl?: string;
  extra?: string;
  dataTab?:string;
  dataTabStyle?:string;
}

export const showImageOrVideo = (props:showImageOrVideoProps) => {
  const { type, url, className, canClick, oUrl, extra,dataTab, dataTabStyle} = props
  const {show: showDialog} = useCommonDialog()
  let showHtml
  // if (type === 'video') {
  //   showHtml = canClick ? (
  //     <img
  //       className={className}
  //       onClick={() => {
  //         showDialog({url: oUrl, type})
  //       }}
  //       src={url}
  //       style={{objectFit: 'cover'}}
  //     />
  //   ) : (
  //     // <View className="all-video-box">
  //     //   <Video
  //     //     src={url}
  //     //     loop
  //     //     controls={true}
  //     //     showFullscreenBtn={false}
  //     //     autoplay={false}
  //     //     muted={false}
  //     //     poster={url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'}
  //     //     objectFit="cover"
  //     //     className={className}
  //     //   />
  //     //   <View
  //     //     onClick={() => {
  //     //       showDialog({url, type})
  //     //     }}
  //     //     className="all-video-mask"
  //     //   ></View>
  //     // </View>
  //     // <Video
  //     //   src={url}
  //     //   loop
  //     //   controls={true}
  //     //   showFullscreenBtn={false}
  //     //   autoplay={false}
  //     //   muted={false}
  //     //   poster={url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'}
  //     //   objectFit="cover"
  //     //   className={className}
  //     //   style={{pointerEvents: 'none'}}
  //     // />
  //     <img className={className} src={url} style={{objectFit: 'cover'}} />
  //   )

  // } else {
  showHtml = canClick ? (
    <img
      className={className}
      onClick={() => {
        showDialog({oUrl, url, type})
      }}
      src={url}
      style={{objectFit: 'cover'}}
    />
  ) : (
    // <View
    //   className={className}
    //   onClick={() => {
    //     showDialog({oUrl, url, type})
    //   }}
    //   style={{background: `url(${url}) no-repeat center center`, backgroundSize: 'cover'}}
    // ></View>
    // <View
    //   className={className}
    //   style={{background: `url(${url}) no-repeat center center`, backgroundSize: 'cover'}}
    // ></View>
    <img className={className} src={url} style={{objectFit: 'cover'}}/>
  )
  // showHtml = (
  //   <>
  //     {showHtml}
  //     {type === '3D' || type === 'video' ? (
  //       canClick ? (
  //         <View
  //           onClick={() => {
  //             showDialog({oUrl, url, type})
  //           }}
  //           className={`custom-3d-icon ${extra}`}
  //         ></View>
  //       ) : (
  //         <View className={`custom-3d-icon ${extra}`}></View>
  //       )
  //     ) : null}
  //   </>
  // )
  // }
  return (
    <>
    {
      !dataTab ? showHtml :
      <div className={dataTabStyle||'cover-img-box'} data-tab={dataTab}>
        {showHtml}
      </div>
    }
      {type === '3D' || type === 'video' ? (
        canClick ? (
          <View
            onClick={() => {
              showDialog({oUrl, url, type})
            }}
            className={`custom-3d-icon ${extra}`}
          ></View>
        ) : (
          <View className={`custom-3d-icon ${extra}`}></View>
        )
      ) : null}
    </>
  )
}

export const Header = () => {
  const store = useStore()
  const [beau, setBeau] = useState(store.state || {})

  const [fullscreen, setFullScreen] = useState<any>(false)
  const [ios, setIOS] = useState(true)
  useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        const ios = !!(res.system.toLowerCase().search('ios') + 1)
        setIOS(ios)
      },
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
    if (loginResponse.userId && !store.state.userId) {
      setBeau({...loginResponse, logined: true})
    }
  }, [store.state.userId])

  const handleQRCode = () => {
    if (!beau.logined) {
      Taro.navigateTo({url: '/pages/login/login'})
      return
    }
    setFullScreen(true)
    // @ts-ignore
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices.length >= 2 ? devices[1].id : devices[0].id
          // @ts-ignore
          const _html5QrCode = new Html5Qrcode('reader')
          setTimeout(() => {
            setFullScreen('QRCode')
            _html5QrCode
              .start(
                ios ? cameraId : {facingMode: 'environment'},
                {
                  fps: 3, // Optional, frame per seconds for qr code scanning
                  qrbox: {width: 200, height: 200}, // Optional, if you want bounded box UI
                },
                // @ts-ignore
                (decodedText, decodedResult) => {
                  // do something when code is read
                  setFullScreen(false)
                  // alert(decodedText)
                  setTimeout(() => {
                    const url = new URL(decodedText)
                    window.location.replace(url)
                  }, 0)
                },
                // @ts-ignore
                (errorMessage) => {
                  // parse error, ignore it.
                  // Taro.showToast({title: '扫码错误，请重试' || errorMessage, icon: 'none'})
                }
              )
              .catch((err) => {
                setFullScreen(false)
                Taro.showToast({title: '启动相机失败' || err, icon: 'none'})
              })
          }, 500)
        }
      })
      .catch((err) => {
        setFullScreen(false)
        Taro.showToast({title: '授权使用相机失败' || err, icon: 'none'})
      })
  }
  return (
    <View className="header">
      <View className="logo" />
      <View onClick={handleQRCode} className={`scan ${fullscreen && 'fullscreen'}`}>
        <Block wx-if={fullscreen === true}>
          <View className="buttonLoad"></View>
          <View className="rightCircle"></View>
          <View className="buttonText">相机启动中</View>
        </Block>
        <View
          className={`close ${fullscreen && 'fullscreen'}`}
          onClick={(e) => {
            e.stopPropagation()
            //@ts-ignore
            setFullScreen(false)
            window.location.reload()
          }}
        >
          ＋
        </View>
        <Block wx-if={fullscreen}>
          <View id="reader" className={`reader ${fullscreen && 'fullscreen'}`}></View>
        </Block>
      </View>
    </View>
  )
}

export const CollectionRecommend = ({beau}) => {
  const handleClick = useCallback(() => {
    Taro.navigateTo({url: `/pages/official-goods-detail/official-goods-detail?id=${beau.id}`})
  }, [beau])
  // const isBefore = dayjs(beau.start_time).isBefore(dayjs()) && beau.available_number !== 0
  const isShowCount = dayjs(beau.start_time).diff(dayjs(), 'hours')
  const isShowCountSeconds = dayjs(beau.start_time).diff(dayjs(), 'seconds')
  const isSoldOut = beau?.state === 'soldout' && beau?.is_can_sale
  const [showTime, setSetShowTime] = useState(+dayjs(beau.start_time) - +dayjs())
  const [timeHtml, setTimeHtml] = useState<any>('')

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const countdown = () => {
      setSetShowTime((v) => v - 1000)
      setTimeout(countdown, 1000)
    }
    countdown()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (isShowCountSeconds >= 0) {
      if (isShowCount >= 24) {
        setTimeHtml(dayjs(beau.start_time).format('MM月DD日 HH:mm'))
      } else {
        const duration = showTime / 1000
        let hours: any = Math.floor(duration / 3600)
        let minutes: any = Math.floor((duration - hours * 3600) / 60)
        let seconds: any = Math.floor(duration - hours * 3600 - minutes * 60)
        hours = String(hours).length >= 2 ? hours : '0' + hours
        minutes = String(minutes).length >= 2 ? minutes : '0' + minutes
        seconds = String(seconds).length >= 2 ? seconds : '0' + seconds
        setTimeHtml(`${hours}:${minutes}:${seconds}`)
      }
    }
  }, [isShowCount, showTime, isShowCountSeconds])

  return (
    <View className="collection-recommend">
      <View className="collection-recommend-box">
        {
          showImageOrVideo({
            type: beau?.material_type,
            url: /3D|music|video/.test(beau?.material_type) ? beau?.cover_url : beau?.images[0],
            className: 'recommend-image',
            dataTab: beau?.chain_type
          })
        }
        {isSoldOut ? null : (
          <View wx-if={isShowCountSeconds >= 0} className="collection-time" key={beau.id}>
            {isShowCount >= 24 ? '即将开售' : '距离开售'}&emsp;
            {timeHtml}
          </View>
        )}
        <View className="video-mask" onClick={handleClick}>
          <view
            className={/3D/.test(beau?.material_type) ? 'd3' : /video/.test(beau?.material_type) ? 'd3 video-icon' : ''}
          ></view>
        </View>
        {/* {isBefore ? null : (
          <Image className="pre-sale"  src={require('../../assets/icons/pre-sale.png')} />
        )} */}
        {/* @ts-ignore  */}
        {isSoldOut ? <Image className="pre-sale sales" src={require('../../assets/icons/saled.png')} /> : null}
        {/* {isBefore ? null : <Text className="pre-sale-text">预售</Text>} */}
        {/* @ts-ignore  */}
        {isSoldOut ? <Text className="pre-sale-text sales">已售罄</Text> : null}
        <View className="recommend-info">
          <Text className="recommend-title" onClick={handleClick}>
            {beau?.name ?? beau?.blind_name ?? ''}
          </Text>
          <View className="recommend-tab" onClick={handleClick}>
            {beau?.is_can_sale ? <Text className="tab-one">限量</Text> : null}
            {beau?.is_can_sale ? <Text className="tab-two">{beau?.total || beau?.amount}份</Text> : null}
            <Text className="tab-three">{beau?.category_name}</Text>
          </View>
          <View className="recommend-footer">
            <View
              // onClick={() => Taro.navigateTo({url: `/pages/issuer/index?id=${beau.issuer_id}`})}
              className="footer-one"
            >
              {!beau?.issuer_logo ? null : <Image className="publish-logo" src={beau?.issuer_logo} />}
              <View className="footer-one-text">{beau.issuer_name}</View>
            </View>
            {beau?.is_can_sale ? (
              <View onClick={handleClick} className="unit">
                {beau?.price_attribute === '10' ? '公益价' : ''}
              </View>
            ) : (
              <View onClick={handleClick} className="unit"></View>
            )}
            <View onClick={handleClick} className="recommend-price">
              {!beau?.is_can_sale ? (
                <Text className="price no-sale">{beau?.nft_type === 'blindbox' ? '盲盒藏品' : '活动藏品'}</Text>
              ) : (
                <Text className="price">￥&nbsp;{beau.price}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export const BlindBox = ({beau, serveTime}) => {
  const handleClick = useCallback(() => {
    if (+dayjs(beau.end_time) < serveTime) {
      Taro.showToast({icon: 'none', title: '活动已结束'})
      return
    }
    if (+dayjs(beau.start_time) > serveTime) {
      Taro.showToast({icon: 'none', title: '活动未开始'})
      return
    }
    Taro.navigateTo({url: `/pages/blind-box-detail/blind-box-detail?id=${beau.id}`})
  }, [beau])
  const isSoldOut = beau?.state === 'soldout' && beau?.is_can_sale
  const [start, setStart] = useState(+dayjs(beau.start_time) - serveTime)
  const [end, setEnd] = useState(+dayjs(beau.end_time) - serveTime)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const countdown = () => {
      setStart((v) => v - 1000)
      setEnd((v) => v - 1000)
      setTimeout(countdown, 1000)
    }
    countdown()
    return () => clearTimeout(timeout)
  }, [])

  const isStart = dayjs(beau.start_time).isBefore(dayjs())
  const remain = isStart ? end : start

  const SECOND = 1000
  const MINUTE = SECOND * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24
  const dd = Math.floor(remain / DAY)
  const hh = Math.floor((remain - DAY * dd) / HOUR)
  const mm = Math.floor((remain - DAY * dd - hh * HOUR) / MINUTE)
  const ss = Math.floor((remain - DAY * dd - hh * HOUR - mm * MINUTE) / SECOND)

  const pad = (v: number) => {
    return v.toString().padStart(2, '0')
  }

  return (
    <View className="collection-recommend">
      <View className="collection-recommend-box">
        {
          showImageOrVideo({
            type: beau?.material_type,
            url: /3D|music|video/.test(beau?.material_type) ? beau?.cover_url : beau?.images[0],
            className: 'recommend-image'
          })
        }
        {end > 0 ? (
          <View wx-if={end > 0} className="collection-time" key={beau.id}>
            {isStart ? '距结束' : '距开始'}&emsp;
            {pad(dd)}&nbsp;天&nbsp;&nbsp;{pad(hh)}&nbsp;:&nbsp;{pad(mm)}&nbsp;:&nbsp;{pad(ss)}
          </View>
        ) : (
          <View className="collection-time" key={beau.id + 'end'}>
            已结束
          </View>
        )}
        <View className="video-mask" onClick={handleClick}>
          <view
            className={/3D/.test(beau?.material_type) ? 'd3' : /video/.test(beau?.material_type) ? 'd3 video-icon' : ''}
          ></view>
        </View>
        {/* {isBefore ? null : (
          <Image className="pre-sale"  src={require('../../assets/icons/pre-sale.png')} />
        )} */}
        {/* @ts-ignore  */}
        {isSoldOut ? <Image className="pre-sale sales" src={require('../../assets/icons/saled.png')} /> : null}
        {/* {isBefore ? null : <Text className="pre-sale-text">预售</Text>} */}
        {/* @ts-ignore  */}
        {isSoldOut ? <Text className="pre-sale-text sales">已售罄</Text> : null}
        <View className="recommend-info">
          <Text className="recommend-title" onClick={handleClick}>
            {beau?.name ?? beau?.blind_name ?? ''}
          </Text>
          <View className="recommend-tab" onClick={handleClick}>
            {beau?.is_can_sale ? <Text className="tab-one">限量</Text> : null}
            {beau?.is_can_sale ? <Text className="tab-two">{beau?.total || beau?.amount}份</Text> : null}
          </View>
          <View className="recommend-footer">
            <View
              // onClick={() => Taro.navigateTo({url: `/pages/issuer/index?id=${beau.issuer_id}`})}
              className="footer-one"
            >
              {!beau?.issuer_logo ? null : <Image className="publish-logo" src={beau?.issuer_logo} />}
              <View className="footer-one-text">{beau.issuer_name}</View>
            </View>
            {beau?.is_can_sale ? (
              <View onClick={handleClick} className="unit">
                {beau?.price_attribute === '10' ? '公益价' : ''}
              </View>
            ) : (
              <View onClick={handleClick} className="unit"></View>
            )}
            <View onClick={handleClick} className="recommend-price">
              {!beau?.is_can_sale ? (
                <Text className="price no-sale">盲盒藏品</Text>
              ) : (
                <Text className="price">￥&nbsp;{beau.price}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export const ZoneList = ({beau}) => {
  const handleClick = useCallback(() => {
    Taro.navigateTo({
      url: '/zone?id=' + beau.id,
    })
  }, [beau])

  return (
    <View className="collection-recommend">
      <View className="collection-recommend-box">
        <img className={'recommend-image'} src={beau?.cover_url} style={{objectFit: 'cover'}} onClick={handleClick} />

        <View className="recommend-info">
          <Text className="recommend-title" onClick={handleClick}>
            {beau?.title ?? ''}
          </Text>
          <View className="recommend-footer">
            <View
              // onClick={() => Taro.navigateTo({url: `/pages/issuer/index?id=${beau.issuer_id}`})}
              className="footer-one"
            >
              {!beau?.issuer?.data?.logo ? null : <Image className="publish-logo" src={beau?.issuer?.data?.logo} />}
              <View className="footer-one-text">{beau?.issuer?.data?.issuer_name}</View>
            </View>
            <View onClick={handleClick} className="unit"></View>
            <View onClick={handleClick} className="recommend-price">
              <Text className="unit">藏品&nbsp;</Text>
              <Text className="price no-sale">{beau?.link_nfts?.total || 0}款</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default () => {
  // const store = useStore()
  const [banner, setBanner] = useState<IBanner[]>([])
  const [notice, setNotice] = useState<any>({})
  const [detail, setDetail] = useState<any>({})
  /**
   * 获取 banner
   */
  useEffect(() => {
    async function fetchData() {
      const [{data: res1}, {data: res3}]: any = await Promise.all([
        api.banner.bannerList(),
        // api.blindbox.listCreate({}),
        api.banner.noticeList({pageSize: 1, status: 'on'}),
        // api.banner.zoneList(),
      ])
      setBanner(res1?.data?.list || [])
      // setBlindBox(res2?.data?.list || [])
      setNotice(res3?.data?.list?.[0] || {})
      // setZone(res4?.payload?.datas || [])
    }
    fetchData()
  }, [])

  const [active, setActive] = useState<string | number>('nft')
  const [finished, setFinished] = useState<boolean>(false)
  const [switchTab, setSwitchTab] = useState<string | boolean>(false)
  const [beau, setBeau] = useState<any>({list: [], total: 0})
  const [page, setPage] = useState<string | number>(1)
  const [queryListLoading, setQueryListLoading] = useState<boolean>(false)

  const queryNftData = useCallback(() => {
    if (queryListLoading || finished) {
      return
    }
    setQueryListLoading(true)
    api.user
      .miniprogramSearchIndexCreate({
        sort: -1,
        limit: 20,
        //@ts-ignore
        skip: (page - 1) * 20,
        //@ts-ignore
        sortBy: 'weight',
        // chainType:"国版链"
      })
      .then((res: any) => {
        if (page > Math.ceil(res.data.total / 20)) {
          setFinished(true)
          return
        }
        //@ts-ignore
        setPage((v) => ++v)
        setBeau((state) => ({
          list: [...state.list, ...res.data.list],
          total: res.data.total,
        }))
      })
      .catch(() => setFinished(true))
      .finally(() => {
        setQueryListLoading(false)
      })
  }, [beau, page, queryListLoading, finished])

  const queryBlindData = useCallback(() => {
    if (queryListLoading || finished) {
      return
    }
    setQueryListLoading(true)
    api.blindbox
      .listCreate({
        limit: 20,
        //@ts-ignore
        skip: (page - 1) * 20,
      })
      .then((res: any) => {
        if (page > Math.ceil(res.data.data.total / 20)) {
          setFinished(true)
          return
        }
        //@ts-ignore
        setPage((v) => ++v)
        setBeau((state) => ({
          list: [...state.list, ...res.data.data.list],
          total: res.data.data.total,
          serveTime: dayjs(res.data.now || ''),
        }))
      })
      .catch(() => setFinished(true))
      .finally(() => {
        setQueryListLoading(false)
      })
  }, [beau, page, queryListLoading, finished])

  const queryZoneData = useCallback(() => {
    if (queryListLoading || finished) {
      return
    }
    setQueryListLoading(true)
    api.banner
      .zoneList({
        //@ts-ignore
        size: 20,
        //@ts-ignore
        page: page,
      })
      .then((res: any) => {
        if (page > Math.ceil(res.data.payload.total / 20)) {
          setFinished(true)
          return
        }
        //@ts-ignore
        setPage((v) => ++v)
        setBeau((state) => ({
          list: [...state.list, ...res.data.payload.datas],
          total: res.data.payload.total,
        }))
      })
      .catch(() => setFinished(true))
      .finally(() => {
        setQueryListLoading(false)
      })
  }, [beau, page, queryListLoading, finished])

  useEffect(() => {
    if (switchTab) {
      //@ts-ignore
      setActive(switchTab)
      switch (switchTab) {
        case 'nft':
          queryNftData()
          break
        case 'zone':
          queryZoneData()
          break
        default:
          queryBlindData()
      }
      setSwitchTab(false)
    }
  }, [switchTab])
  const clearAllArray = (type) => {
    setBeau({
      list: [],
      total: 0,
    })
    setPage(1)
    setFinished(false)
    setSwitchTab(type)
  }
  return detail?.id ? (
    <NoticeDetail detail={detail} setDetail={() => setDetail({})} />
  ) : (
    <>
      <View className="index-container">
        {/* <NavigationBar isNoHome title="好藏品 鸭不住" color="#fff" /> */}
        <Header />
        {notice.title ? (
          <View onClick={() => setDetail(notice)}>
            <AtNoticebar className="home-notice" icon="volume-plus" marquee>
              {notice.title}
            </AtNoticebar>
          </View>
        ) : null}
        <BannerSwiperBox banner={banner} />
        <View className={`${active === 'nft' && 'nft-box'}`}>
          <Tabs
            className="tabbar"
            align="center"
            color="rgba(0,0,0,0)"
            background="rgba(0,0,0,0)"
            active={active}
            onChange={(type) => {
              clearAllArray(type)
            }}
          >
            <Tabs.TabPane name="zone" key="zone" title="国版链通道" titleClass="tab">
              {active === 'zone' ? (
                <View>
                  <List finished={finished} onLoad={queryZoneData} autoCheck={false} immediateCheck={false}>
                    {beau.list.map((item, index) => {
                      return <ZoneList key={index} beau={item.data} />
                    })}
                  </List>
                  <ListState isEmpty={!beau.list.length} />
                </View>
              ) : null}
            </Tabs.TabPane>
            <Tabs.TabPane name="nft" key="nft" title="藏品" titleClass="tab">
              {active === 'nft' ? (
                <View>
                  <List finished={finished} onLoad={queryNftData} autoCheck={false}>
                    {beau.list.map((item, index) => (
                      <CollectionRecommend key={index} beau={item} />
                    ))}
                  </List>
                  <ListState isEmpty={!beau.list.length} />
                </View>
              ) : null}
            </Tabs.TabPane>
            <Tabs.TabPane name="blind" key="blind" title="盲盒" titleClass="tab">
              {active === 'blind' ? (
                <View>
                  <List finished={finished} onLoad={queryBlindData} autoCheck={false} immediateCheck={false}>
                    {beau.list.map((item, index) => (
                      <BlindBox key={index} beau={item} serveTime={beau.serveTime} />
                    ))}
                  </List>
                  <ListState isEmpty={!beau.list.length} />
                </View>
              ) : null}
            </Tabs.TabPane>
          </Tabs>
        </View>
      </View>
      <TabBar index={0} />
    </>
  )
}
